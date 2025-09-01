"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import mapboxgl from "mapbox-gl";

export default function Home() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.error("Missing NEXT_PUBLIC_MAPBOX_TOKEN");
      return;
    }
    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [127.024612, 37.5326], // 서울
      zoom: 10,
    });
    mapRef.current = map;

    // 네비게이션(줌) 컨트롤
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // 마커 예시
    new mapboxgl.Marker().setLngLat([127.024612, 37.5326]).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="font-sans min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] text-white p-8">
      {/* 로고 */}
      <header className="mb-12">
        <Image
          src="/wonderchain-logo.png"
          alt="WonderChain Logo"
          width={200}
          height={60}
        />
      </header>

      {/* 소개 텍스트 */}
      <main className="text-center space-y-6 max-w-xl w-full">
        <h1 className="text-4xl font-bold">Welcome to WonderChain</h1>
        <p className="text-lg text-gray-300">
          Explore the next generation Web3.5 ecosystem. Join our community and
          experience blockchain innovation like never before.
        </p>

        {/* 버튼 영역 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <a
            href="https://wonderchain.net"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-3 rounded-md font-semibold"
          >
            Visit Website
          </a>
        <a
            href="https://t.me/wonderchain"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black hover:bg-gray-200 transition-colors px-6 py-3 rounded-md font-semibold"
          >
            Join Telegram
          </a>
        </div>

        {/* 지도 영역 */}
        <div className="w-full h-[500px] mt-8 rounded-lg overflow-hidden ring-1 ring-white/10">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>
      </main>

      {/* 푸터 */}
      <footer className="mt-auto text-gray-400 text-sm pt-12">
        © 2025 WonderChain. All rights reserved.
      </footer>
    </div>
  );
}
