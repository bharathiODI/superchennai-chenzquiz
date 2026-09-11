// import ffmpeg from 'fluent-ffmpeg'
// import path from 'path'
// import fs from 'fs'
// import ffmpegPath from 'ffmpeg-static'

// // 🔥 IMPORTANT: set ffmpeg binary path
// ffmpeg.setFfmpegPath(ffmpegPath as string)

// export const compressVideo = async ({ doc }: any) => {
//   if (!doc?.filename) return doc

//   // Payload stores files in public/media (recommended setup)
//   const inputPath = path.join(process.cwd(), 'public/media', doc.filename)

//   const compressedName = `compressed-${Date.now()}-${doc.filename}`
//   const outputPath = path.join(process.cwd(), 'public/media', compressedName)

//   // 🔥 check file exists
//   if (!fs.existsSync(inputPath)) {
//     throw new Error(`Input video not found: ${inputPath}`)
//   }

//   return new Promise((resolve, reject) => {
//     ffmpeg(inputPath)
//       .outputOptions([
//         '-vcodec libx264',
//         '-crf 28',
//         '-preset fast',
//         '-movflags +faststart', // better streaming
//       ])
//       .save(outputPath)
//       .on('end', () => {
//         resolve({
//           ...doc,
//           filename: compressedName,
//           url: `/media/${compressedName}`,
//         })
//       })
//       .on('error', (err: any) => {
//         reject(err)
//       })
//   })
// }
