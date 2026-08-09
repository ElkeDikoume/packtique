# Packtique 🧳

**AI-powered travel packing assistant that remembers your style.**

Packtique turns a boarding pass image into a personalized packing list in seconds — and gets smarter every trip. Upload your ticket, describe your travel style, and get a curated list tailored to your destination, climate, and past preferences. No more over-packing. No more forgetting your umbrella in London.

**Live demo:** [packtique.vercel.app](https://packtique.vercel.app)

---

## How It Works

1. **Upload your boarding pass** — Packtique reads the image with AWS Bedrock (Claude Haiku) and extracts origin, destination, dates, airline, and flight number automatically.
2. **Tell it your style** — a quick description of how you travel (business formal, adventure minimalist, whatever fits) gets embedded as a 1,536-dimensional vector via Amazon Titan Embeddings V2.
3. **Get your packing list** — Claude Haiku generates a personalized list using your trip details plus your top-3 similar past trips, retrieved via CockroachDB vector similarity search.
4. **It learns** — every trip you save becomes part of your style memory, so future lists reflect what has actually worked for you.

---

## Architecture

```
User (boarding pass image)
        |
        v
   Next.js 16 (Vercel)
        |
   +----+----------------------------+
   |                                 |
   v                                 v
AWS Bedrock                 CockroachDB Serverless
Claude Haiku 4.5            (cobalt-queen cluster)
  - Extract flight info       - style_profiles table
  - Generate packing list     - VECTOR(1536) embeddings
                              - Distributed vector index
Amazon Titan Embeddings V2   - Cosine similarity search
  - 1536-dim style vectors    - Trip history storage
```

**Stack:** Next.js 16 · TypeScript · AWS Bedrock · CockroachDB Serverless · Vercel

---

## CockroachDB Integration

### Tool 1: Distributed Vector Indexing

Packtique stores each trip's style embedding as a `VECTOR(1536)` column in CockroachDB and queries it with cosine similarity to surface the user's most relevant past trips at list-generation time.

**Schema:**

```sql
CREATE TABLE style_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  destination TEXT NOT NULL,
  season TEXT,
  trip_purpose TEXT,
  bag_brand TEXT,
  bag_model TEXT,
  service_tier TEXT,
  item_categories JSONB,
  embedding VECTOR(1536) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CockroachDB Distributed Vector Index
CREATE VECTOR INDEX ON style_profiles (embedding);
```

The `VECTOR INDEX` is CockroachDB's distributed implementation of approximate nearest-neighbor search — it partitions the vector space across nodes so similarity queries scale horizontally without sacrificing speed.

**Similarity search at query time** (`src/app/api/profile/route.ts`):

```typescript
// Generate embedding for the current trip style
const embedding = await generateEmbedding(queryText);
const embeddingStr = `[${embedding.join(',')}]`;

// Retrieve top-3 most similar past trips using cosine distance (<=>)
const res = await query(
  `SELECT destination, season, bag_brand, bag_model, service_tier, item_categories,
          1 - (embedding <=> $2::vector) AS similarity
   FROM style_profiles
   WHERE user_id = $1
   ORDER BY embedding <=> $2::vector
   LIMIT 3`,
  [userId, embeddingStr]
);
```

The `<=>` operator is CockroachDB's cosine distance function. Ordering by it ascending (smallest distance = most similar) and returning the top 3 gives the travel style memory that feeds the packing list prompt.

### Tool 2: CockroachDB Cloud Managed MCP Server

The CockroachDB Cloud console exposes a **Model Context Protocol (MCP) server** directly in the Connect dialog (Connect → Model Context Protocol tab). This gives AI coding assistants direct, authenticated access to your cluster's schema and query capabilities during development.

During Packtique's development, the MCP server was used to:
- Introspect the live schema to verify `VECTOR(1536)` column types and index creation
- Test `<=>` cosine similarity queries against real data before wiring them into the API routes
- Debug connection issues between the Next.js app and CockroachDB Serverless

---

## AWS Bedrock Integration

All AI inference runs through **AWS Bedrock** — no OpenAI, no external model APIs.

### Claude Haiku 4.5 (`us.anthropic.claude-haiku-4-5-20251001-v1:0`)

Used for two tasks: boarding pass image extraction and packing list generation. The model receives the trip details plus the top-3 most similar past trips (retrieved from CockroachDB vector search), then returns a structured packing list organized by category.

### Amazon Titan Embeddings V2 (`amazon.titan-embed-text-v2:0`)

Converts each trip's style description into a 1,536-dimensional vector stored as `VECTOR(1536)` in CockroachDB. Dimensions: 1536, normalized.

---

## Local Setup

### Prerequisites

- Node.js 18+
- AWS account with Bedrock enabled in `us-east-1` with model access for `claude-haiku-4-5` and `amazon.titan-embed-text-v2`
- CockroachDB Serverless cluster (free tier works)

### Environment Variables

Create `.env.local`:

```bash
DATABASE_URL=postgresql://[user]:[password]@[host]:26257/defaultdb?sslmode=verify-full
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

### Run Locally

```bash
npm install
npm run dev
```

---

## Hackathon Requirements

| Requirement | Implementation |
|---|---|
| CockroachDB Distributed Vector Indexing | `CREATE VECTOR INDEX ON style_profiles (embedding)` + `<=>` cosine similarity queries |
| CockroachDB Cloud Managed MCP Server | Used via Connect → MCP tab for schema introspection and query testing during development |
| AWS Bedrock | Claude Haiku 4.5 (extraction + generation) + Titan Embeddings V2 (1536-dim vectors) |
| Deployed application | [packtique.vercel.app](https://packtique.vercel.app) |

---

## License

MIT
