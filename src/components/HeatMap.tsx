"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    { ssr: false }
);
const CircleMarker = dynamic(
    () => import("react-leaflet").then((mod) => mod.CircleMarker),
    { ssr: false }
);

import "leaflet/dist/leaflet.css";

interface Point {
    lat: number;
    lng: number;
    intensity: number;
}

export default function HeatMap({ points }: { points: Point[] }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="h-[300px] bg-gray-100 rounded-xl animate-pulse" />;

    // Default center (Spain approximated) or average of points
    const center: [number, number] = points.length > 0
        ? [points[0].lat, points[0].lng]
        : [37.77, -3.79]; // Jaen approx

    return (
        <div className="h-[300px] w-full rounded-xl overflow-hidden shadow-inner border border-gray-200 z-0 relative">
            <MapContainer center={center} zoom={6} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {points.map((p, idx) => (
                    <CircleMarker
                        key={idx}
                        center={[p.lat, p.lng]}
                        radius={10}
                        pathOptions={{
                            color: 'transparent',
                            fillColor: '#C5A059',
                            fillOpacity: 0.6
                        }}
                    />
                ))}
            </MapContainer>
        </div>
    );
}
