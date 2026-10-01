// // import { getPayload } from 'payload'
// // import configPromise from '@payload-config'
// // import { NextResponse } from 'next/server'

// // export async function POST(req: Request) {
// //   console.log('--------------------------------------------------')
// //   console.log('🚀 [PASSWORD LOGIN] Incoming login request initiated')

// //   try {
// //     const body = await req.json()

// //     // Mobile number extracted safely from request body
// //     const phone = body.phone || body.username
// //     const password = body.password

// //     // 1. Validation Check
// //     if (!phone) {
// //       return NextResponse.json({ message: 'Mobile number is required' }, { status: 400 })
// //     }

// //     if (!password) {
// //       return NextResponse.json({ message: 'Password is required' }, { status: 400 })
// //     }

// //     const payload = await getPayload({ config: configPromise })

// //     // 2. Search user by phone number
// //     console.log(`🔍 [PASSWORD LOGIN] Searching user in DB for phone: "${phone}"`)
// //     const userResult = await payload.find({
// //       collection: 'quiz-users',
// //       where: {
// //         phone: {
// //           equals: phone,
// //         },
// //       },
// //       overrideAccess: true,
// //       showHiddenFields: true,
// //     })

// //     if (!userResult.docs.length) {
// //       console.warn(`❌ [PASSWORD LOGIN] User not found for phone: "${phone}"`)
// //       return NextResponse.json({ message: 'Invalid mobile number or password' }, { status: 401 })
// //     }

// //     const user = userResult.docs[0]

// //     // 3. Password Verification via Payload authenticate helper
// //     console.log(`🔐 [PASSWORD LOGIN] Authenticating user ID: ${user.id}...`)

// // let loginResult
// // try {
// //   loginResult = await payload.login({
// //     collection: 'quiz-users',
// //     data: {
// //       // Payload expects email or username field by default based on strategy
// //       email: (user as any).email || user.phone,
// //       username: (user as any).username || user.phone,
// //       password: password,
// //     },
// //     overrideAccess: true,
// //   })
// // } catch (authError: any) {
// //   console.error('❌ Authentication failed detail:', authError)
// //   return NextResponse.json({ message: 'Invalid mobile number or password' }, { status: 401 })
// // }
// // if (!loginResult?.token) {
// //   return NextResponse.json({ message: 'Invalid mobile number or password' }, { status: 401 })
// // }

// //     console.log('🎉 [PASSWORD LOGIN] Login successful!')
// //     console.log('--------------------------------------------------')

// //     // Sensitive fields cleaning
// //     delete (user as any).salt
// //     delete (user as any).hash

// //     return NextResponse.json({
// //       message: 'Login successful',
// //       token: loginResult.token,
// //       user: loginResult.user || user,
// //     })
// //   } catch (error: any) {
// //     console.error('🔥 [PASSWORD LOGIN ERROR]:', error?.message || error)
// //     return NextResponse.json({ message: 'Invalid mobile number or password' }, { status: 401 })
// //   }
// // }
// import { getPayload } from 'payload'
// import configPromise from '@payload-config'
// import { NextResponse } from 'next/server'
// import { verifyPassword } from 'payload/shared' // Payload built-in password verify helper
// import { SignJWT } from 'jose'

// export async function POST(req: Request) {
//   console.log('--------------------------------------------------')
//   console.log('🚀 [PASSWORD LOGIN] Incoming login request initiated')

//   try {
//     const body = await req.json()

//     const phone = body.phone || body.username
//     const password = body.password

//     // 1. Validation Check
//     if (!phone) {
//       return NextResponse.json({ message: 'Mobile number is required' }, { status: 400 })
//     }
//     if (!password) {
//       return NextResponse.json({ message: 'Password is required' }, { status: 400 })
//     }

//     const payload = await getPayload({ config: configPromise })

//     // 2. Phone number வைத்து பயனரைத் தேடுதல்
//     console.log(`🔍 Searching user for phone: "${phone}"`)
//     const userResult = await payload.find({
//       collection: 'quiz-users',
//       where: {
//         phone: {
//           equals: phone,
//         },
//       },
//       overrideAccess: true,
//       showHiddenFields: true, // DB-ல் உள்ள hash & salt எடுக்க வேண்டும்
//     })

//     if (!userResult.docs.length) {
//       console.warn(`❌ User not found for phone: "${phone}"`)
//       return NextResponse.json({ message: 'Invalid mobile number or password' }, { status: 401 })
//     }

//     const user = userResult.docs[0] as any

//     // 3. User Accounts-ல் Password Hash & Salt இருக்கிறதா எனப் பார்த்தல்
//     if (!user.hash || !user.salt) {
//       console.warn('❌ User account does not have password hash stored')
//       return NextResponse.json({ message: 'Invalid mobile number or password' }, { status: 401 })
//     }

//     // 4. DIRECT PASSWORD VERIFICATION (No Payload Login Helper dependency)
//     console.log(`🔐 Verifying password for user: ${user.name} (${user.id})...`)
//     const isPasswordValid = await verifyPassword({
//       password: password,
//       hash: user.hash,
//       salt: user.salt,
//     })

//     if (!isPasswordValid) {
//       console.warn('❌ Password mismatch for user')
//       return NextResponse.json({ message: 'Invalid mobile number or password' }, { status: 401 })
//     }

//     // 5. Generate Auth Token
//     const secretKey = new TextEncoder().encode(payload.secret)
//     const token = await new SignJWT({
//       id: user.id,
//       collection: 'quiz-users',
//       phone: user.phone,
//     })
//       .setProtectedHeader({ alg: 'HS256' })
//       .setExpirationTime('7d')
//       .sign(secretKey)

//     console.log('🎉 [PASSWORD LOGIN] Login successful!')
//     console.log('--------------------------------------------------')

//     // Clean sensitive hidden fields before returning
//     delete user.salt
//     delete user.hash

//     return NextResponse.json({
//       message: 'Login successful',
//       token: token,
//       user: user,
//     })
//   } catch (error: any) {
//     console.error('🔥 [PASSWORD LOGIN ERROR]:', error?.message || error)
//     return NextResponse.json({ message: 'Invalid mobile number or password' }, { status: 401 })
//   }
// }
