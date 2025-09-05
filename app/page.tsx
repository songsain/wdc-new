"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import mapboxgl from "mapbox-gl";

type LngLat = { lng: number; lat: number };
type Feature = {
  type: "Feature";
  properties: {
    id: string;
    slug: string;
    name: string;
    summary?: string | null;
    description?: string | null;
    image_url?: string | null;
  };
  geometry: { type: "Point"; coordinates: [number, number] };
};
type FC = { type: "FeatureCollection"; features: Feature[] };

export default function Home() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
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

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // 로드되면 API에서 데이터 불러와서 소스/레이어 추가
    map.on("load", async () => {
      try {
        const res = await fetch("/api/places", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load places");
        const data: FC = await res.json();

        if (!map.getSource("places")) {
          map.addSource("places", { type: "geojson", data });
        }

        if (!map.getLayer("places-layer")) {
          map.addLayer({
            id: "places-layer",
            type: "circle",
            source: "places",
            paint: {
              "circle-radius": 7,
              "circle-color": "#3b82f6",
              "circle-stroke-width": 2,
              "circle-stroke-color": "#ffffff",
            },
          });
        }

        // 커서 변경
        map.on("mouseenter", "places-layer", () => (map.getCanvas().style.cursor = "pointer"));
        map.on("mouseleave", "places-layer", () => (map.getCanvas().style.cursor = ""));

        // 클릭 → 팝업
        map.on("click", "places-layer", (e) => {
          const feat = e.features?.[0] as any as Feature | undefined;
          if (!feat) return;
          const [lng, lat] = feat.geometry.coordinates;

          popupRef.current?.remove();

          const html = `
            <div style="font-family:ui-sans-serif;min-width:220px;max-width:280px">
              <div style="font-weight:700;font-size:16px;margin-bottom:6px">${feat.properties.name ?? "장소"}</div>
              <div style="font-size:12px;color:#888;margin-bottom:10px">
                ${feat.properties.summary ?? ""}
              </div>
              <a href="/places/${feat.properties.slug}" style="display:inline-block;background:#3b82f6;color:#fff;padding:8px 10px;border-radius:8px;text-decoration:none;font-weight:600">
                상세보기
              </a>
            </div>
          `;

          popupRef.current = new mapboxgl.Popup({ closeOnClick: false, offset: 16 })
            .setLngLat([lng, lat])
            .setHTML(html)
            .addTo(map);
        });

        // 빈 곳 클릭 → 팝업 닫기
        map.on("click", (evt) => {
          const feats = map.queryRenderedFeatures(evt.point, { layers: ["places-layer"] });
          if (feats.length === 0) popupRef.current?.remove();
        });
      } catch (err) {
        console.error(err);
      }
    });

    return () => {
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 내 위치 이동 (GPS → IP 폴백)
  const locateMe = async () => {
    if (locating) return;
    setLocating(true);
    try {
      if ("geolocation" in navigator) {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 0,
          });
        });
        flyTo({ lng: pos.coords.longitude, lat: pos.coords.latitude });
        return;
      }
      const ipPos = await ipFallback();
      if (ipPos) flyTo(ipPos);
    } catch {
      const ipPos = await ipFallback();
      if (ipPos) flyTo(ipPos);
    } finally {
      setLocating(false);
    }
  };

  const flyTo = (pos: LngLat) => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({ center: [pos.lng, pos.lat], zoom: 14, essential: true });
  };

  const ipFallback = async (): Promise<LngLat | null> => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      if (!res.ok) throw new Error("ip geo failed");
      const data = await res.json();
      if (data.longitude && data.latitude) {
        return { lng: Number(data.longitude), lat: Number(data.latitude) };
      }
      return null;
    } catch {
      return null;
    }
  };

  return (
    <div className="font-sans min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] text-white p-8">
      {/* 로고 */}
      <header className="mb-12">
        <Image src="/wonderchain-logo.png" alt="WonderChain Logo" width={200} height={60} />
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

        {/* 지도 + 내 위치 버튼 */}
        <div className="relative w-full h-[45vh] md:h-[40vh] lg:h-[36vh] mt-8 rounded-lg overflow-hidden ring-1 ring-white/10">
          <div ref={mapContainerRef} className="w-full h-full" />
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
