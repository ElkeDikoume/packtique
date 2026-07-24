import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { TripData, PackingItem } from '@/lib/bedrock'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      email: string
      trip: TripData
      items: PackingItem[]
    }

    // Upsert user
    const userRes = await query(
      `INSERT INTO users (email) VALUES ($1)
       ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
       RETURNING id`,
      [body.email]
    )
    const userId = userRes.rows[0].id

    // Insert trip
    const tripRes = await query(
      `INSERT INTO trips (user_id, airline, flight_number, origin, destination,
        depart_date, return_date, fare_class, checked_bag_kg, carry_on_kg, trip_purpose)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
      [
        userId,
        body.trip.airline,
        body.trip.flight_number,
        body.trip.origin,
        body.trip.destination,
        body.trip.depart_date,
        body.trip.return_date,
        body.trip.fare_class,
        body.trip.checked_bag_kg,
        body.trip.carry_on_kg,
        body.trip.trip_purpose,
      ]
    )
    const tripId = tripRes.rows[0].id

    // Insert packing items
    for (const item of body.items) {
      await query(
        `INSERT INTO packing_items (trip_id, name, category, why, ai_suggested)
         VALUES ($1,$2,$3,$4,$5)`,
        [tripId, item.name, item.category, item.why, item.ai_suggested]
      )
    }

    return NextResponse.json({ userId, tripId })
  } catch (err) {
    console.error('Trip save error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
