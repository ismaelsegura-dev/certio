"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import HeatMap from "@/components/HeatMap";
import { Euro } from "lucide-react";
import Image from "next/image";

export default function StatsPage() {
    const [totalSpend, setTotalSpend] = useState(0.0);
    const [locations, setLocations] = useState<{ lat: number, lng: number, intensity: 1 }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        calculateStats();
    }, []);

    const calculateStats = async () => {
        try {
            // We select only existing columns to avoid errors if precio_certificacion is missing
            const { data, error } = await supabase
                .from("lotes")
                .select("lat, lng");

            if (error) throw error;

            if (data) {
                // Calculate Spend: Count * 0.15 (Fallback since column might be missing)
                const spend = data.length * 0.15;
                setTotalSpend(spend);

                // Map Locations
                const locs = data
                    .filter(d => d.lat !== 0 && d.lng !== 0)
                    .map(d => ({ lat: d.lat, lng: d.lng, intensity: 1 as const }));
                setLocations(locs);
            }
        } catch (error) {
            console.error("Error stats:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen px-6 pt-12 pb-24">
            <header className="mb-8 flex flex-col items-center animate-in slide-in-from-top-4 duration-700">
                <div className="relative w-32 h-10 mb-2">
                    <Image
                        src="/logo.png"
                        alt="Certio"
                        fill
                        className="object-contain"
                    />
                </div>
                <p className="text-gray-500 mb-2">Control de gastos y ubicación</p>
            </header>

            <div className="space-y-6">
                {/* Card Gasto */}
                <div className="bg-olive-deep text-bone p-6 rounded-2xl shadow-xl relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 bg-gold-matte/20 w-24 h-24 rounded-full blur-xl" />

                    <div className="flex items-center gap-2 text-gold-matte mb-1">
                        <Euro className="w-5 h-5" />
                        <span className="text-sm font-medium uppercase tracking-wider">Gasto Mensual</span>
                    </div>
                    <div className="text-4xl font-serif font-bold mt-2">
                        {loading ? "..." : totalSpend.toFixed(2)}€
                    </div>
                    <div className="text-xs text-gray-300 mt-2">
                        Coste certificación (0.15€/lote)
                    </div>
                </div>

                {/* Map Section */}
                <section>
                    <h3 className="text-lg font-serif text-olive-deep mb-4">Mapa de Certificación</h3>
                    {loading ? (
                        <div className="h-[300px] bg-gray-100 rounded-xl animate-pulse" />
                    ) : (
                        <HeatMap points={locations} />
                    )}
                </section>
            </div>
        </main>
    );
}
