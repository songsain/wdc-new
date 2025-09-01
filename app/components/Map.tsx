'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';

export default function Map() {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;

    if (!mapboxgl.accessToken) {
      console.error('Missing NEXT_PUBLIC_MAPBOX_TOKEN');
      return;
    }

    const map = new mapboxgl.Map({
      container: ref.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [126.9784, 37.5665], // 서울시청
      zoom: 11,
    });
    mapRef.current = map;

    new mapboxgl.Marker().setLngLat([126.9784, 37.5665]).addTo(map);
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '70vh',         // ★ 높이 필수
        borderRadius: 12,
        overflow: 'hidden',
        outline: '1px solid #ddd' // 디버그용
      }}
    />
  );
}
