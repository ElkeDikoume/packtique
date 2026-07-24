import { NextRequest, NextResponse } from 'next/server'
import { extractBoardingPass, generatePackingList } from '@/lib/bedrock'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const text = formData.get('text') as string | null

    let content = text ?? ''

    if (file) {
      // For PDFs and text files, read as text
      // For images, convert to base64 and include in prompt
      const isImage = file.type.startsWith('image/')
      if (isImage) {
        const buffer = await file.arrayBuffer()
        const base64 = Buffer.from(buffer).toString('base64')
        content = `[Image boarding pass — base64: data:${file.type};base64,${base64.slice(0, 200)}...]`
      } else {
        content = await file.text()
      }
    }

    if (!content) {
      return NextResponse.json({ error: 'No content provided' }, { status: 400 })
    }

    const tripData = await extractBoardingPass(content)
    const packingItems = await generatePackingList(tripData)

    return NextResponse.json({ trip: tripData, items: packingItems })
  } catch (err) {
    console.error('Extract error:', err)
    return NextResponse.json(
      { error: 'Extraction failed', detail: String(err) },
      { status: 500 }
    )
  }
}
