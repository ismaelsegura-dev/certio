"use client";

import HeroInversores from "@/components/HeroInversores";
import Link from "next/link";
import { Plus, Box, BarChart3, ArrowRight } from "lucide-react";

export default function Home() {
    return (
        <main className="bg-[#0a0a0a] min-h-screen pb-20">
            {/* Hero Section */}
            <HeroInversores />

            {/* Navigation Section */}
            <div className="max-w-7xl mx-auto px-6 -mt-32 md:-mt-40 relative z-20 pb-20">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                    <span className="w-8 h-1 bg-green-500 rounded-full"></span>
                    Acceso Rápido
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Nuevo Lote */}
                    <Link href="/new-batch" className="group">
                        <div className="h-full bg-zinc-900/50 border border-white/10 p-8 rounded-3xl hover:bg-zinc-800/50 transition-all hover:border-green-500/30 hover:shadow-[0_0_30px_-10px_rgba(34,197,94,0.2)]">
                            <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform">
                                <Plus size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Nuevo Lote</h3>
                            <p className="text-gray-400 text-sm mb-6">Certificar una nueva producción en Blockchain.</p>
                            <div className="flex items-center text-green-500 text-sm font-bold group-hover:gap-2 transition-all">
                                INICIAR <ArrowRight size={16} className="ml-1" />
                            </div>
                        </div>
                    </Link>

                    {/* Card 2: Inventario */}
                    <Link href="/inventory" className="group">
                        <div className="h-full bg-zinc-900/50 border border-white/10 p-8 rounded-3xl hover:bg-zinc-800/50 transition-all hover:border-blue-500/30 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)]">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                                <Box size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Inventario</h3>
                            <p className="text-gray-400 text-sm mb-6">Gestionar lotes certificados y trazabilidad.</p>
                            <div className="flex items-center text-blue-500 text-sm font-bold group-hover:gap-2 transition-all">
                                EXPLORAR <ArrowRight size={16} className="ml-1" />
                            </div>
                        </div>
                    </Link>

                    {/* Card 3: Estadísticas */}
                    <Link href="/stats" className="group">
                        <div className="h-full bg-zinc-900/50 border border-white/10 p-8 rounded-3xl hover:bg-zinc-800/50 transition-all hover:border-purple-500/30 hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.2)]">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                                <BarChart3 size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Métricas</h3>
                            <p className="text-gray-400 text-sm mb-6">Análisis de producción y ventas en tiempo real.</p>
                            <div className="flex items-center text-purple-500 text-sm font-bold group-hover:gap-2 transition-all">
                                VER DASHBOARD <ArrowRight size={16} className="ml-1" />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </main>
    );
}
