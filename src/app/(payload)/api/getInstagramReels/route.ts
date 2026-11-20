import { NextResponse } from 'next/server'

// Facebook Page linked to the Instagram Business Account (set both in .env)
const PAGE_ID = process.env.INSTAGRAM_PAGE_ID || '672199299308709'
const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN

export async function GET() {
  if (!ACCESS_TOKEN) {
    return NextResponse.json({ error: 'INSTAGRAM_ACCESS_TOKEN is not set' }, { status: 500 })
  }

  try {
    // STEP 1: Get Instagram Business Account ID linked to the Page
    const igAccountRes = await fetch(
      `https://graph.facebook.com/v19.0/${PAGE_ID}?fields=instagram_business_account&access_token=${ACCESS_TOKEN}`
    )
    const igAccountData = await igAccountRes.json()

    if (!igAccountData.instagram_business_account?.id) {
      return NextResponse.json({ error: 'No connected Instagram Business Account found' }, { status: 404 })
    }

    const instagramBusinessAccountId = igAccountData.instagram_business_account.id

    // STEP 2: Fetch media from the Instagram Business Account
    const mediaRes = await fetch(
      `https://graph.facebook.com/v19.0/${instagramBusinessAccountId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${ACCESS_TOKEN}`
    )
    const mediaData = await mediaRes.json()

    if (!mediaData?.data || mediaData.data.length === 0) {
      return NextResponse.json({ error: 'No media found' }, { status: 404 })
    }

    return NextResponse.json(mediaData)
  } catch (error: any) {
    console.error('Instagram API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch Instagram media' }, { status: 500 })
  }
}
