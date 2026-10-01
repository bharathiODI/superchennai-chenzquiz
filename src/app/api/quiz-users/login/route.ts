// import { getPayload } from 'payload'
// import configPromise from '@payload-config'
// import { NextResponse } from 'next/server'

// export async function POST(req: Request) {
//   console.log('--------------------------------------------------')
//   console.log('🚀 [PASSWORD LOGIN] Incoming login request initiated')

//   try {
//     const body = await req.json()

//     // Mobile number extracted safely from request body
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

//     // 2. Search user by phone number
//     console.log(`🔍 [PASSWORD LOGIN] Searching user in DB for phone: "${phone}"`)
//     const userResult = await payload.find({
//       collection: 'quiz-users',
//       where: {
//         phone: {
//           equals: phone,
//         },
//       },
//       overrideAccess: true,
//       showHiddenFields: true,
//     })

//     if (!userResult.docs.length) {
//       console.warn(`❌ [PASSWORD LOGIN] User not found for phone: "${phone}"`)
//       return NextResponse.json({ message: 'Invalid mobile number or password' }, { status: 401 })
//     }

//     const user = userResult.docs[0]

//     // 3. Password Verification via Payload authenticate helper
//     console.log(`🔐 [PASSWORD LOGIN] Authenticating user ID: ${user.id}...`)

// let loginResult
// try {
//   loginResult = await payload.login({
//     collection: 'quiz-users',
//     data: {
//       // Payload expects email or username field by default based on strategy
//       email: (user as any).email || user.phone,
//       username: (user as any).username || user.phone,
//       password: password,
//     },
//     overrideAccess: true,
//   })
// } catch (authError: any) {
//   console.error('❌ Authentication failed detail:', authError)
//   return NextResponse.json(
//     { message: 'Invalid mobile number or password' },
//     { status: 401 }
//   )
// }
//     if (!loginResult?.token) {
//       return NextResponse.json({ message: 'Invalid mobile number or password' }, { status: 401 })
//     }

//     console.log('🎉 [PASSWORD LOGIN] Login successful!')
//     console.log('--------------------------------------------------')

//     // Sensitive fields cleaning
//     delete (user as any).salt
//     delete (user as any).hash

//     return NextResponse.json({
//       message: 'Login successful',
//       token: loginResult.token,
//       user: loginResult.user || user,
//     })
//   } catch (error: any) {
//     console.error('🔥 [PASSWORD LOGIN ERROR]:', error?.message || error)
//     return NextResponse.json({ message: 'Invalid mobile number or password' }, { status: 401 })
//   }
// }
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  console.log('--------------------------------------------------')
  console.log('🚀 [PASSWORD LOGIN] Incoming login request initiated')

  try {
    const body = await req.json()

    // Mobile number can come as either "phone" or "username"
    const phone = body.phone || body.username
    const password = body.password

    // 1. Validation
    if (!phone) {
      return NextResponse.json({ message: 'Mobile number is required' }, { status: 400 })
    }

    if (!password) {
      return NextResponse.json({ message: 'Password is required' }, { status: 400 })
    }

    const payload = await getPayload({
      config: configPromise,
    })

    // 2. Find user using phone number
    console.log(`🔍 [PASSWORD LOGIN] Searching user in DB for phone: "${phone}"`)

    const userResult = await payload.find({
      collection: 'quiz-users',
      where: {
        phone: {
          equals: phone,
        },
      },
      overrideAccess: true,
      showHiddenFields: true,
    })

    if (!userResult.docs.length) {
      console.warn(`❌ [PASSWORD LOGIN] User not found for phone: "${phone}"`)

      return NextResponse.json({ message: 'Invalid mobile number or password' }, { status: 401 })
    }

    const user = userResult.docs[0] as any

    console.log(`👤 [PASSWORD LOGIN] User found. ID: ${user.id}`)

    // 3. Payload authentication
    //
    // Payload's generated type says quiz-users login expects:
    // {
    //   email: string
    //   password: string
    // }
    //
    // So username must NOT be passed here.

    const email = user.email

    if (!email) {
      console.error(`❌ [PASSWORD LOGIN] User ${user.id} does not have an email address`)

      return NextResponse.json(
        {
          message: 'This account cannot be logged in because no email is associated with it',
        },
        { status: 401 },
      )
    }

    console.log(`🔐 [PASSWORD LOGIN] Authenticating user ID: ${user.id}...`)

    let loginResult

    try {
      loginResult = await payload.login({
        collection: 'quiz-users',
        data: {
          email,
          password,
        },
        overrideAccess: true,
      })
    } catch (authError: any) {
      console.error('❌ Authentication failed detail:', authError?.message || authError)

      return NextResponse.json({ message: 'Invalid mobile number or password' }, { status: 401 })
    }

    // 4. Verify token
    if (!loginResult?.token) {
      console.warn(`❌ [PASSWORD LOGIN] No token returned for user: ${user.id}`)

      return NextResponse.json({ message: 'Invalid mobile number or password' }, { status: 401 })
    }

    console.log('🎉 [PASSWORD LOGIN] Login successful!')
    console.log('--------------------------------------------------')

    // 5. Remove sensitive fields
    delete user.salt
    delete user.hash
    delete user.password

    // 6. Response
    return NextResponse.json({
      message: 'Login successful',
      token: loginResult.token,
      user: loginResult.user || user,
    })
  } catch (error: any) {
    console.error('🔥 [PASSWORD LOGIN ERROR]:', error?.message || error)

    return NextResponse.json({ message: 'Invalid mobile number or password' }, { status: 401 })
  }
}
