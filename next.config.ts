import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // External packages that should not be bundled into the Edge runtime.
    // pg uses native modules that only work in Node.js serverless.
      serverExternalPackages: ['pg'],
      }

      export default nextConfig
      