// app/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import mapboxgl from "mapbox-gl";

// ===== Types =====
type LngLat = { lng: number; lat: number };

type PlaceFeature = {
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

type PlaceFC = { type: "FeatureCollection"; features: PlaceFeature[] };

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
        const data: PlaceFC = await res.json();

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
        map.on("mouseenter", "places-layer", () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "places-layer", () => {
          map.getCanvas().style.cursor = "";
        });

        // 클릭 → 팝업
        map.on("click", "places-layer", (e) => {
          const feat = e.features?.[0] as unknown as PlaceFeature | undefined;
          if (!feat) return;

          const [lng, lat] = feat.geometry.coordinates as [number, number];

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
            .add
