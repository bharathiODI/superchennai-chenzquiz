# Chenzquiz local setup (Windows)
# Run from the project root:  powershell -ExecutionPolicy Bypass -File .\scripts\setup-local.ps1
# Imports the newest db\*.sql (or db\chenzquiz.dump) into an empty DB.
# Replace existing local data:  ... -File .\scripts\setup-local.ps1 -Reimport

param([switch]$Reimport)

$ErrorActionPreference = 'Stop'
$Root = Split-Path $PSScriptRoot -Parent
Set-Location $Root

function Step($m) { Write-Host "`n==> $m" -ForegroundColor Cyan }
function Fail($m) { Write-Host "ERROR: $m" -ForegroundColor Red; exit 1 }

# 1. Node
Step 'Node'
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Fail 'Node not found. Install Node 22 LTS: winget install OpenJS.NodeJS.LTS' }
$nodeVer = (node -v).TrimStart('v')
if ([int]$nodeVer.Split('.')[0] -lt 20) { Fail "Node $nodeVer is too old - need 20.9 or newer." }
Write-Host "Node $nodeVer OK"

# 2. Disk space
$drv = Get-PSDrive -Name (Split-Path -Qualifier $Root).TrimEnd(':')
$freeGB = [math]::Round($drv.Free / 1GB, 1)
Write-Host "Free on $($drv.Name): $freeGB GB"
if ($freeGB -lt 2.5) { Write-Host "WARNING: under 2.5 GB free - npm install / .next cache may run out of space." -ForegroundColor Yellow }

# 3. Read DATABASE_URI from .env
Step '.env'
if (-not (Test-Path .env)) { Fail '.env missing.' }
$m = [regex]::Match((Get-Content .env -Raw), '(?m)^DATABASE_URI=(.+)$')
if (-not $m.Success) { Fail 'DATABASE_URI not set in .env' }
$uri = [Uri]($m.Groups[1].Value.Trim().Trim('"'))
$cred = $uri.UserInfo.Split(':', 2)
$dbUser = [Uri]::UnescapeDataString($cred[0])
$dbPass = if ($cred.Count -gt 1) { [Uri]::UnescapeDataString($cred[1]) } else { '' }
$dbHost = $uri.Host
$dbPort = if ($uri.Port -gt 0) { $uri.Port } else { 5432 }
$dbName = $uri.AbsolutePath.TrimStart('/')
Write-Host "DB: $dbUser@${dbHost}:$dbPort/$dbName"

# 4. PostgreSQL + database
Step 'PostgreSQL'
$psql = (Get-Command psql -ErrorAction SilentlyContinue).Source
if (-not $psql) {
  $psql = Get-ChildItem 'C:\Program Files\PostgreSQL\*\bin\psql.exe' -ErrorAction SilentlyContinue |
    Sort-Object { [int]($_.Directory.Parent.Name -replace '\D.*', '') } -Descending |
    Select-Object -First 1 -ExpandProperty FullName
}
if (-not $psql) { Fail 'PostgreSQL not found. Install PostgreSQL 16+ (postgresql.org/download/windows), use the password from .env, then re-run.' }
$pgBin = Split-Path $psql
$env:PGPASSWORD = $dbPass
$pgArgs = @('-h', $dbHost, '-p', $dbPort, '-U', $dbUser)

$existsSql = "SELECT 1 FROM pg_database WHERE datname='$dbName'"
$exists = & $psql @pgArgs -d postgres -tAc $existsSql
$tries = 0
while ($LASTEXITCODE -ne 0 -and $tries -lt 3) {
  $tries++
  $sec = Read-Host "Enter the local PostgreSQL password for '$dbUser' (typing is hidden)" -AsSecureString
  $dbPass = [Runtime.InteropServices.Marshal]::PtrToStringBSTR([Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec))
  $env:PGPASSWORD = $dbPass
  $exists = & $psql @pgArgs -d postgres -tAc $existsSql
  if ($LASTEXITCODE -eq 0) {
    $newUri = "postgres://${dbUser}:$([Uri]::EscapeDataString($dbPass))@${dbHost}:$dbPort/$dbName"
    $envText = (Get-Content .env -Raw).Replace($m.Value.TrimEnd("`r"), "DATABASE_URI=$newUri")
    Set-Content .env $envText -NoNewline -Encoding ASCII
    Write-Host 'Password OK - saved to .env' -ForegroundColor Green
  }
}
if ($LASTEXITCODE -ne 0) { Fail "Cannot connect to Postgres as $dbUser. Is the service running? Is the password right?" }
if ("$exists".Trim() -ne '1') {
  & $psql @pgArgs -d postgres -c "CREATE DATABASE `"$dbName`""
  if ($LASTEXITCODE -ne 0) { Fail "Could not create database $dbName" }
  Write-Host "Created database $dbName"
} else { Write-Host "Database $dbName exists" }

# 5. Import data: newest db\*.sql (plain pg_dump) or db\chenzquiz.dump (custom format)
$sqlFile = Get-ChildItem (Join-Path $Root 'db\*.sql') -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
$dump  = Join-Path $Root 'db\chenzquiz.dump'
$media = Join-Path $Root 'db\media.tar.gz'
$tableSql = "SELECT count(*) FROM information_schema.tables WHERE table_schema='public'"
if ($sqlFile -or (Test-Path $dump)) {
  if ($Reimport) {
    Step "Recreating database $dbName"
    & $psql @pgArgs -d postgres -c "DROP DATABASE IF EXISTS $dbName WITH (FORCE)"
    & $psql @pgArgs -d postgres -c "CREATE DATABASE $dbName"
    if ($LASTEXITCODE -ne 0) { Fail "Could not recreate $dbName" }
  }
  $tables = & $psql @pgArgs -d $dbName -tAc $tableSql
  if ([int]("$tables".Trim()) -eq 0) {
    if ($sqlFile) {
      Step "Importing $($sqlFile.Name)"
      & $psql @pgArgs -d $dbName -q -f $sqlFile.FullName
    } else {
      Step 'Restoring db\chenzquiz.dump'
      & (Join-Path $pgBin 'pg_restore.exe') @pgArgs -d $dbName --no-owner --no-acl $dump
    }
    $tables = & $psql @pgArgs -d $dbName -tAc $tableSql
    Write-Host "Import done - $("$tables".Trim()) tables in $dbName" -ForegroundColor Green
  } else { Write-Host "DB $dbName already has tables - skipping import. Re-run with -Reimport to replace it." }
} else {
  Write-Host 'No dump in db\ - starting with an empty DB (Payload creates the tables on first run).'
}
if ((Test-Path $media) -and -not (Test-Path 'public\media')) {
  Step 'Extracting media'
  tar -xzf $media -C public
}

# 6. Dependencies
Step 'npm dependencies'
$env:ELECTRON_SKIP_BINARY_DOWNLOAD = '1'   # desktop wrapper not needed for web dev; saves ~250 MB
if (-not (Test-Path node_modules)) {
  npm.cmd ci
  if ($LASTEXITCODE -ne 0) { Write-Host 'npm ci failed - trying npm install' -ForegroundColor Yellow; npm.cmd install }
  if ($LASTEXITCODE -ne 0) { Fail 'npm install failed' }
} else { Write-Host 'node_modules present - skipping (delete it to reinstall)' }

# 7. Run
Step 'Dev server: http://localhost:3000   Admin: http://localhost:3000/admin'
npm.cmd run dev
