/** next.config.ts — Next.js 설정 파일
 *  - 외부 이미지 도메인(Unsplash, Pexels) 허용 설정
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 외부 이미지 URL 허용 설정 */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
};

export default nextConfig;
