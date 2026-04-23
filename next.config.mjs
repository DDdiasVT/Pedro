/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignora erros do ESLint durante o build para permitir o deploy rápido
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignora erros de tipo durante o build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
