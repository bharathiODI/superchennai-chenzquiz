import { app, BrowserWindow } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  win.loadURL('http://localhost:3000')

  win.once('ready-to-show', () => {
    win.show()
  })

  win.webContents.session.on('will-download', (event, item) => {
    const filePath = path.join(app.getPath('downloads'), item.getFilename())
    item.setSavePath(filePath)

    item.once('done', (_, state) => {
      if (state === 'completed') {
        console.log('✅ Download complete:', filePath)
      } else {
        console.error(' Download failed:', state)
      }
    })
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
