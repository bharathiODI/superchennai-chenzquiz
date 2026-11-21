import { appendFile, mkdir } from 'fs/promises'
import path from 'path'

/**
 * Last-resort lead recovery: when the database write fails, the
 * submission is appended to `.data/failed-submissions.jsonl` so it can be
 * replayed by hand. Gitignore `.data/`; in Docker, mount it if you want
 * the file to outlive the container.
 *
 * A form that says "Thank you" while writing nothing loses real leads —
 * this file is the loud version of that failure.
 */
export const appendFailedSubmission = async (record: Record<string, unknown>): Promise<string | null> => {
  try {
    const dir = path.resolve(process.cwd(), '.data')
    await mkdir(dir, { recursive: true })
    const file = path.join(dir, 'failed-submissions.jsonl')
    await appendFile(file, `${JSON.stringify({ ...record, failedAt: new Date().toISOString() })}\n`, 'utf8')
    return file
  } catch {
    return null
  }
}
