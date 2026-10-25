import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    // The 3D work section briefly lived at its own address before it moved into
    // the home page; anyone who was sent that link lands on the home page.
    return [{ source: '/exhibition', destination: '/', permanent: false }];
  },
};

export default nextConfig;
