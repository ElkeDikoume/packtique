import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { generateEmbedding } from '@/lib/bedrock'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      userId: string
      tripId: string
      destination: string
      season: string
      trip_purpose: string
      bag_brand: string
      bag_model: string
      service_tier: string
      item_categories: Record<string, number>
    }

    // Build a descriptive string for embedding
    const profileText = [
      `Destination: ${body.destination}`,
      `Season: ${body.season}`,
      `Purpose: ${body.trip_purpose}`,
      `Bag: ${body.bag_brand} ${body.bag_model}`,
      `Service: ${body.service_tier}`,
      `Categories: ${Object.entries(body.item_categories).map(([k, v]) => `${k}(${v})`).join(', ')}`,
    ].join('. ')

    // Generate embedding via Titan Embeddings V2
    const embedding = await generateEmbedding(profileText)
    const embeddingStr = `[${embedding.join(',')}]`

    await query(
      `INSERT INTO style_profiles
        (user_id, trip_id, destination, season, trip_purpose,
         bag_brand, bag_model, service_tier, item_categories, embedding)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::vector)`,
      [
        body.userId,
        body.tripId,
        body.destination,
        body.season,
        body.trip_purpose,
        body.bag_brand,
        body.bag_model,
        body.service_tier,
        JSON.stringify(body.item_categories),
        embeddingStr,
      ]
    )

    return NextResponse.json({ saved: true })
  } catch (err) {
    console.error('Profile save error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

// Query similar past trips for pre-filling
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const destination = searchParams.get('destination') ?? ''
    const purpose = searchParams.get('purpose') ?? 'Leisure'

    if (!userId) return NextResponse.json({ profiles: [] })

    const queryText = `Destination: ${destination}. Purpose: ${purpose}.`
    const embedding = await generateEmbedding(queryText)
    const embeddingStr = `[${embedding.join(',')}]`

    const res = await query(
      `SELECT destination, season, bag_brand, bag_model, service_tier, item_categories,
              1 - (embedding <=> $2::vector) AS similarity
       FROM style_profiles
       WHERE user_id = $1
       ORDER BY embedding <=> $2::vector
       LIMIT 3`,
      [userId, embeddingStr]
    )

    return NextResponse.json({ profiles: res.rows })
  } catch (err) {
    console.error('Profile fetch error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
