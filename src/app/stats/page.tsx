"use client";

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { supabase } from "@/lib/supabase";
import { TrendingUp, Activity, Award, Scale } from "lucide-react";
import Link from "next/link";
import CertioLogo from "@/components/CertioLogo";

const HeatMap = dynamic(() => import('@/components/HeatMap'), {
    ssr: false,
    loading: () => <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center text-gray-400">Cargando mapa de calor...</div>
});

export default function StatsPage() {
    const [stats, setStats] = useState({
        totalLotes: 0,
        avgAcidez: 0 as number,
        topVariedad: "N/A",
        recentProduction: [] as any[],
        locations: [] as { lat: number; lng: number; variety: string; id: number }[]
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data, error } = await supabase
                    .from("lotes")
                    .select("*")
                    .order("id", { ascending: false });

                if (error) {
                    console.error("Error fetching stats:", error);
                    // No lanzamos error, solo dejamos datos en 0
                } else if (data && data.length > 0) {
                    // Calcular estadísticas básicas
                    const total = data.length;

                    // Promedio Acidez
                    const sumAcidez = data.reduce((acc, curr) => acc + (curr.acidez || 0), 0);
                    const avgAcidez = (sumAcidez / total).toFixed(2);

                    // Variedad más común
                    const variedades: Record<string, number> = {};
                    data.forEach(l => {
                        const v = l.variedad || "Desconocida";
                        variedades[v] = (variedades[v] || 0) + 1;
                    });
                    const topVariedad = Object.entries(variedades).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

                    // Map locations for HeatMap
                    const locations = data
                        .filter(l => l.lat && l.lng)
                        .map(l => ({ lat: l.lat, lng: l.lng, variety: l.variedad, id: l.id }));

                    setStats({
                        totalLotes: total,
                        avgAcidez: parseFloat(avgAcidez),
                        topVariedad,
                        recentProduction: data.slice(0, 5),
                        locations
                    });
                }
            } catch (err) {
                console.error("Crash prevented in stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-gray-400">Calculando métricas...</div>;
    }

    return (
        <main className="min-h-screen bg-neutral-50 p-6 pb-24">
            <CertioLogo variant="dark" fixed={true} />
            <h1 className="text-3xl font-serif text-olive-deep mb-2 animate-in fade-in pt-12">Dashboard de Rendimiento</h1>
            <p className="text-gray-500 mb-8">Vista general para Inversores</p>

            {/* KPIs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs uppercase tracking-wider font-bold">
                        <TrendingUp size={14} /> Ventas Totales (YTD)
                    </div>
                    <p className="text-3xl font-black text-green-700">€245,850</p>
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-2 inline-block">+18.2% vs año anterior</span>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs uppercase tracking-wider font-bold">
                        <TrendingUp size={14} /> Producción Total
                    </div>
                    <p className="text-3xl font-black text-olive-deep">{stats.totalLotes * 1200} L</p>
                    <span className="text-xs text-gray-400 mt-1 block">{stats.totalLotes} Lotes certificados</span>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs uppercase tracking-wider font-bold">
                        <Scale size={14} /> Acidez Promedio
                    </div>
                    <p className="text-3xl font-black text-gold-matte">{stats.avgAcidez}%</p>
                    <span className="text-xs text-olive-deep/60 mt-2 inline-block">Calidad Premium Garantizada</span>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs uppercase tracking-wider font-bold">
                        <Award size={14} /> Top Variedad
                    </div>
                    <p className="text-2xl font-serif text-olive-deep truncate" title={stats.topVariedad}>{stats.topVariedad}</p>
                    <span className="text-xs text-gray-400 mt-2 inline-block">Más demandada este mes</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Mapa de Calor */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <Activity size={18} /> Origen de Producción
                    </h3>
                    {/* @ts-ignore */}
                    <HeatMap locations={stats.locations || []} />
                </div>

                {/* Gráfico de Ventas (Simulado con CSS) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                            <TrendingUp size={18} /> Proyección de Ventas
                        </h3>
                        <select className="text-xs border-none bg-gray-50 rounded-lg px-2 py-1 text-gray-500 outline-none">
                            <option>Últimos 6 meses</option>
                        </select>
                    </div>

                    <div className="flex items-end justify-between h-48 gap-2 w-full px-2">
                        {[40, 65, 45, 80, 95, 120].map((h, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                                <div className="text-xs font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    €{h}k
                                </div>
                                <div
                                    className="w-full bg-olive-deep/10 rounded-t-lg relative group-hover:bg-olive-deep/20 transition-all duration-500"
                                    style={{ height: `${(h / 120) * 100}%` }}
                                >
                                    <div
                                        className="absolute bottom-0 left-0 w-full bg-olive-deep rounded-t-lg transition-all duration-1000 ease-out"
                                        style={{ height: `${(h / 120) * 80}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-400 uppercase font-medium">
                                    {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Table */}
            <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Activity size={18} /> Últimos Lotes Certificados
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {stats.recentProduction.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No hay datos suficientes</div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {stats.recentProduction.map((item, idx) => (
                            <div key={idx} className="p-4 flex justify-between items-center text-sm hover:bg-neutral-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-olive-deep/10 flex items-center justify-center text-olive-deep font-bold text-xs">
                                        #{item.id}
                                    </div>
                                    <div>
                                        <p className="font-bold text-olive-deep">{item.variedad}</p>
                                        <p className="text-xs text-gray-400">Certificado en Blockchain</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="font-mono text-xs font-bold text-olive-deep block mb-1">
                                        {item.acidez}% Acidez
                                    </span>
                                    <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                        Verificado
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
