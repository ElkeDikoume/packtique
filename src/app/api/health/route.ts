import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import {
  BedrockRuntimeClient,
    InvokeModelCommand,
    } from '@aws-sdk/client-bedrock-runtime'

    export const maxDuration = 30

    export async function GET() {
      const results: Record<string, unknown> = {
          timestamp: new Date().toISOString(),
              env: {
                    AWS_REGION: process.env.AWS_REGION ?? 'not set',
                          AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ? '✓ set' : '✗ missing',
                                AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? '✓ set' : '✗ missing',
                                      DATABASE_URL: process.env.DATABASE_URL ? '✓ set' : '✗ missing',
                                          },
                                            }

                                              // ── Test CockroachDB connection ──────────────────────────────────────────
                                                try {
                                                    const res = await query('SELECT current_database(), now()', [])
                                                        results.database = {
                                                              ok: true,
                                                                    database: res.rows[0].current_database,
                                                                          server_time: res.rows[0].now,
                                                                              }
                                                                                } catch (err) {
                                                                                    results.database = { ok: false, error: String(err) }
                                                                                      }

                                                                                        // ── Test Bedrock connectivity (minimal token-generating call) ────────────
                                                                                          try {
                                                                                              const client = new BedrockRuntimeClient({
                                                                                                    region: process.env.AWS_REGION ?? 'us-east-1',
                                                                                                          credentials: {
                                                                                                                  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                                                                                                                          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
                                                                                                                                },
                                                                                                                                    })

                                                                                                                                        const command = new InvokeModelCommand({
                                                                                                                                              modelId: 'us.anthropic.claude-haiku-4-5-20251001-v1:0',
                                                                                                                                                    contentType: 'application/json',
                                                                                                                                                          accept: 'application/json',
                                                                                                                                                                body: JSON.stringify({
                                                                                                                                                                        anthropic_version: 'bedrock-2023-05-31',
                                                                                                                                                                                max_tokens: 5,
                                                                                                                                                                                        messages: [{ role: 'user', content: 'Say: ok' }],
                                                                                                                                                                                              }),
                                                                                                                                                                                                  })

                                                                                                                                                                                                      const response = await client.send(command)
                                                                                                                                                                                                          const body = JSON.parse(new TextDecoder().decode(response.body)) as {
                                                                                                                                                                                                                content: { text: string }[]
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                        results.bedrock = { ok: true, ping: body.content[0]?.text ?? '(empty)' }
                                                                                                                                                                                                                          } catch (err) {
                                                                                                                                                                                                                              results.bedrock = { ok: false, error: String(err) }
                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                  const allOk =
                                                                                                                                                                                                                                      (results.database as { ok: boolean }).ok &&
                                                                                                                                                                                                                                          (results.bedrock as { ok: boolean }).ok

                                                                                                                                                                                                                                            return NextResponse.json(results, { status: allOk ? 200 : 503 })
                                                                                                                                                                                                                                            }