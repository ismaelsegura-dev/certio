"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon missing assets
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface HeatMapProps {
    locations: { lat: number; lng: number; variety: string; id: number }[];
}

export default function HeatMap({ locations }: HeatMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        // Initialize map if not already done
        if (!mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapRef.current).setView([37.77, -3.78], 6); // Default center (Jaén/Spain approx)

            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 19
            }).addTo(mapInstanceRef.current);
        }

        const map = mapInstanceRef.current;

        // Clear existing layers (except tiles)
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker || layer instanceof L.Circle) {
                map.removeLayer(layer);
            }
        });

        // Add markers for locations
        if (locations.length > 0) {
            const validLocations = locations.filter(l => l.lat && l.lng);

            validLocations.forEach(loc => {
                L.circle([loc.lat, loc.lng], {
                    color: '#656d4a', // olive-deep
                    fillColor: '#a68a64', // gold-matte
                    fillOpacity: 0.5,
                    radius: 5000 // 5km radius to simulate "region"
                }).addTo(map)
                    .bindPopup(`<b>${loc.variety}</b><br>Lote #${loc.id}`);
            });

            // Adjust view to fit bounds if there are markers
            if (validLocations.length > 0) {
                const group = L.featureGroup(validLocations.map(l => L.marker([l.lat, l.lng])));
                map.fitBounds(group.getBounds().pad(0.1));
            }
        }

        // Cleanup on unmount
        return () => {
            // We don't remove the map instance here strictly to avoid re-init issues in strict mode, 
            // but in a perfect world we might. For this demo, it persists.
        };
    }, [locations]);

    return (
        <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-sm border border-gray-100 z-0 relative">
            <div ref={mapRef} className="w-full h-full" />
        </div>
    );
}
