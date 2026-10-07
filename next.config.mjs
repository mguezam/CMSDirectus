/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8055',
                pathname: '/assets/**',
            },
        ],
        // Solo per sviluppo locale
        dangerouslyAllowLocalIP: true,
    },
};

export default nextConfig;
