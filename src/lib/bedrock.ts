import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime'

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION ?? 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// Extract structured trip data from boarding pass text/image
export async function extractBoardingPass(content: string): Promise<TripData> {
  const prompt = `You are extracting travel information from a boarding pass or flight confirmation.
Return ONLY a valid JSON object with these exact fields. If a field cannot be determined, use null.

{
  "airline": "airline name",
  "flight_number": "e.g. AF 011",
  "origin": "city name (IATA code)",
  "destination": "city name (IATA code)",
  "depart_date": "YYYY-MM-DD",
  "return_date": "YYYY-MM-DD or null",
  "fare_class": "Economy / Premium Economy / Business / First",
  "checked_bag_kg": number or null,
  "carry_on_kg": number or null,
  "trip_purpose": "Leisure / Business / null"
}

Boarding pass content:
${content}`

  const command = new InvokeModelCommand({
    modelId: 'us.anthropic.claude-3-5-haiku-20241022-v1:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const response = await client.send(command)
  const body = JSON.parse(new TextDecoder().decode(response.body))
  const text = body.content[0].text

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON in Bedrock response')
  return JSON.parse(jsonMatch[0]) as TripData
}

// Generate packing list from trip data
export async function generatePackingList(trip: TripData): Promise<PackingItem[]> {
  const prompt = `You are a professional travel packer. Generate a packing list for this trip.

Trip: ${trip.origin} → ${trip.destination}
Dates: ${trip.depart_date} to ${trip.return_date ?? 'unknown'}
Fare class: ${trip.fare_class}
Checked bag: ${trip.checked_bag_kg ?? 23}kg
Purpose: ${trip.trip_purpose ?? 'Leisure'}

Return ONLY a JSON array of items (15-20 items):
[
  {
    "name": "item name",
    "category": "Clothing | Electronics | Toiletries | Documents",
    "why": "one short reason (max 50 chars)",
    "ai_suggested": true
  }
]`

  const command = new InvokeModelCommand({
    modelId: 'us.anthropic.claude-3-5-haiku-20241022-v1:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const response = await client.send(command)
  const body = JSON.parse(new TextDecoder().decode(response.body))
  const text = body.content[0].text

  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('No JSON array in Bedrock response')
  return JSON.parse(jsonMatch[0]) as PackingItem[]
}

// Generate embedding for style profile (Titan Embeddings V2)
export async function generateEmbedding(text: string): Promise<number[]> {
  const command = new InvokeModelCommand({
    modelId: 'amazon.titan-embed-text-v2:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({ inputText: text, dimensions: 1536, normalize: true }),
  })

  const response = await client.send(command)
  const body = JSON.parse(new TextDecoder().decode(response.body))
  return body.embedding as number[]
}

export interface TripData {
  airline: string | null
  flight_number: string | null
  origin: string | null
  destination: string | null
  depart_date: string | null
  return_date: string | null
  fare_class: string | null
  checked_bag_kg: number | null
  carry_on_kg: number | null
  trip_purpose: string | null
}

export interface PackingItem {
  name: string
  category: string
  why: string
  ai_suggested: boolean
}
