-- ============================================================
-- Packtique — CockroachDB schema
-- Run once against your CockroachDB Serverless cluster.
-- Enable pgvector in the CockroachDB Cloud UI first:
--   Cluster → Settings → Extensions → pgvector → Enable
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS trips (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id),
            airline TEXT,
              flight_number TEXT,
                origin TEXT,
                  destination TEXT,
                    depart_date DATE,
                      return_date DATE,
                        fare_class TEXT,
                          checked_bag_kg INT,
                            carry_on_kg INT,
                              trip_purpose TEXT,
                                weather TEXT,
                                  created_at TIMESTAMPTZ DEFAULT now()
                                  );

                                  CREATE TABLE IF NOT EXISTS packing_items (
                                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                      trip_id UUID REFERENCES trips(id),
                                        name TEXT NOT NULL,
                                          category TEXT,
                                            why TEXT,
                                              ai_suggested BOOLEAN DEFAULT false,
                                                included BOOLEAN DEFAULT true,
                                                  created_at TIMESTAMPTZ DEFAULT now()
                                                  );

                                                  CREATE TABLE IF NOT EXISTS style_profiles (
                                                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                                      user_id UUID REFERENCES users(id),
                                                        trip_id UUID REFERENCES trips(id),
                                                          destination TEXT,
                                                            season TEXT,
                                                              trip_purpose TEXT,
                                                                bag_brand TEXT,
                                                                  bag_model TEXT,
                                                                    service_tier TEXT,
                                                                      item_categories JSONB,
                                                                        -- 1536 dims = Titan Embeddings V2
                                                                          embedding VECTOR(1536),
                                                                            created_at TIMESTAMPTZ DEFAULT now()
                                                                            );

                                                                            -- HNSW index for fast cosine similarity search
                                                                            CREATE INDEX IF NOT EXISTS style_profiles_embedding_idx
                                                                              ON style_profiles USING hnsw (embedding vector_cosine_ops);

                                                                              -- ============================================================
                                                                              -- After running schema, POST /api/seed to insert 4 demo trips
                                                                              -- for demo@packtique.ai with real Titan V2 embeddings.
                                                                              -- ============================================================