"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import mapboxgl from "mapbox-gl";

type LngLat = { lng: number; lat: number };

export default function Home() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const meMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [locating, setLocating] = useState(false);

  // 지도 초기화
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

    // 컨트롤
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // GeolocateControl (모바일 GPS 추적)
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true,
      showAccuracyCircle: false,
      fitBoundsOptions: { maxZoom: 15 },
    });
    map.addControl(geolocate, "top-right");

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 내 위치로 이동(버튼 동작)
  const flyTo = (pos: LngLat) => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({ center: [pos.lng, pos.lat], zoom: 14, essential: true });

    // 마커 업데이트
    if (!meMarkerRef.current) {
      meMarkerRef.current = new mapboxgl.Marker({ color: "#3b82f6" }); // 파란 마커
    }
    meMarkerRef.current.setLngLat([pos.lng, pos.lat]).addTo(mapRef.current);
  };

  const ipFallback = async (): Promise<LngLat | null> => {
    try {
      // 간단한 IP 기반 위치 (권한 불필요, 대략적)
      const res = await fetch("https://ipapi.co/json/");
      if (!res.ok) throw new Error("ip geo failed");
      const data = await res.json();
      if (typeof data.longitude === "number" && typeof data.latitude === "number") {
        return { lng: data.longitude, lat: data.latitude };
      }
      // 일부 API는 문자열로 줄 수 있음
      if (data.longitude && data.latitude) {
        return { lng: Number(data.longitude), lat: Number(data.latitude) };
      }
      return null;
    } catch {
      return null;
    }
  };

  const locateMe = async () => {
    if (locating) return;
    setLocating(true);
    try {
      // 1) 브라우저 GPS 우선 시도
      if ("geolocation" in navigator) {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 0,
          });
        });
        const coords = { lng: pos.coords.longitude, lat: pos.coords.latitude };
        flyTo(coords);
        return;
      }
      // 2) IP 기반 대체
      const ipPos = await ipFallback();
      if (ipPos) {
        flyTo(ipPos);
        return;
      }
      alert("위치를 가져올 수 없습니다. (브라우저 권한 또는 네트워크 확인)");
    } catch (err) {
      // GPS 실패 → IP fallback
      const ipPos = await ipFallback();
      if (ipPos) {
        flyTo(ipPos);
      } else {
        alert("위치를 가져올 수 없습니다. (권한 거부 또는 네트워크 문제)");
      }
    } finally {
      setLocating(false);
    }
  };

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

      {/* 소개/버튼 */}
      <main className="text-center space-y-6 max-w-xl w-full">
        <h1 className="text-4xl font-bold">Welcome to WonderChain</h1>
        <p className="text-lg text-gray-300">
          Explore the next generation Web3.5 ecosystem. Join our community and
          experience blockchain innovation like never before.
        </p>

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

        {/* 지도 + 오버레이 버튼 */}
        <div className="relative w-full h-[70vh] mt-8 rounded-lg overflow-hidden ring-1 ring-white/10">
          {/* 지도 컨테이너 */}
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* 내 위치 버튼 (지도 위 오버레이) */}
          <button
            onClick={locateMe}
            disabled={locating}
            className="absolute left-3 top-3 bg-white/90 text-black px-3 py-2 rounded-md text-sm font-semibold shadow hover:bg-white disabled:opacity-60"
          >
            {locating ? "위치 확인 중..." : "내 위치"}
          </button>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="mt-auto text-gray-400 text-sm pt-12">
        © 2025 WonderChain. All rights reserved.
      </footer>
    </div>
  );
}
