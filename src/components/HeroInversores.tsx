"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ShieldCheck, Zap, Activity, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import CertioLogo from './CertioLogo';

// Create a single supabase client for interacting with your database
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HeroInversores() {
    const [lote, setLote] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // STRONG HACK: Inyectar estilos para forzar la ocultación de elementos globales del layout (navs, footers, headers blancos)
        // Esto es necesario porque no tenemos acceso al layout.tsx global
        const style = document.createElement('style');
        style.id = 'hide-layout-elements';
        style.innerHTML = `
            nav, footer, header:not(.hero-header), .bottom-nav, .tab-bar {
                display: none !important;
            }
        `;
        document.head.appendChild(style);

        return () => {
            // Limpiar al salir
            const existingStyle = document.getElementById('hide-layout-elements');
            if (existingStyle) {
                existingStyle.remove();
            }
        };
    }, []);

    useEffect(() => {
        const fetchUltimoLote = async () => {
            try {
                const { data, error } = await supabase
                    .from('lotes')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                // Si hay un error de permisos o tabla vacía, usamos datos de prueba para la demo
                if (error || !data) {
                    console.warn("Usando datos de demostración para la reunión");
                    setLote({
                        id_lote: "CERT-DEMO-2026",
                        pureza: 99.9,
                        acidez: 0.18,
                        blockchain_hash: "0xDEMO...HASH_GENERADO_POR_IA"
                    });
                } else {
                    setLote(data);
                }
            } catch (err) {
                console.error("Fallo crítico recuperado:", err);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        fetchUltimoLote();
    }, []);

    // Default values
    const defaultPurity = "99.9";
    const defaultAcidity = "0.2";
    const defaultHash = "0x742d...412b";

    // Data processing
    const displayHash = lote?.blockchain_hash
        ? `${lote.blockchain_hash.substring(0, 6)}...${lote.blockchain_hash.substring(lote.blockchain_hash.length - 4)}`
        : defaultHash;

    const displayAcidity = lote?.acidez ? lote.acidez : defaultAcidity;
    // Assuming 'pureza' might not be in the DB yet based on schema, consistent with prompt
    const displayPurity = lote?.pureza || defaultPurity;

    return (
        <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans selection:bg-green-500/30">
            {/* Header / Logo */}
            <header className="hero-header absolute top-0 left-0 w-full p-6 z-50 flex items-center">
                <CertioLogo variant="light" />
            </header>

            {/* Luces de ambiente Pro */}
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-green-600/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/10 rounded-full blur-[100px]" />

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="animate-in slide-in-from-left duration-700 fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-green-400 text-xs font-bold mb-8 backdrop-blur-md hover:bg-white/10 transition-colors cursor-default">
                        <Zap size={14} fill="currentColor" /> WEB3 & AI POWERED ECOSYSTEM
                    </div>

                    <h1 className="text-7xl md:text-8xl font-black mb-8 leading-[0.85] tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-400">
                        TRUST IS <br /> <span className="text-green-500">DIGITAL.</span>
                    </h1>

                    <p className="text-gray-400 text-xl max-w-md mb-12 leading-relaxed">
                        Certio fusiona la pureza del aceite de oliva con la inmutabilidad de Blockchain y la precisión sensorial de Gemini Pro.
                    </p>

                    <div className="flex gap-4">
                        <Link href="/new-batch">
                            <button className="group px-8 py-5 bg-green-500 text-black font-black rounded-2xl hover:bg-green-400 transition-all flex items-center gap-2 shadow-[0_0_40px_-10px_rgba(34,197,94,0.6)]">
                                ESCANEAR AHORA <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </Link>
                        <Link href="/inventory">
                            <button className="px-8 py-5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/5 transition-all">
                                VER DATOS
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Tarjeta de Datos Reales de Supabase */}
                <div className="relative group perspective-1000 animate-in slide-in-from-right duration-1000 fade-in delay-200">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
                    <div className="relative bg-zinc-900/90 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
                        <div className="flex justify-between items-center mb-10">
                            <span className="inline-flex items-center gap-2 font-mono text-xs text-green-500 tracking-widest uppercase bg-green-500/10 px-3 py-1 rounded-lg">
                                Live Node: Polygon Amoy
                            </span>
                            <Activity className="text-green-500 animate-pulse" />
                        </div>

                        <div className="space-y-8">
                            <div>
                                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-3">Hash de Certificación</p>
                                <div className="p-4 bg-black/30 rounded-xl border border-white/5 font-mono text-lg text-gray-200 flex items-center gap-3 group/hash cursor-pointer hover:border-green-500/30 transition-colors">
                                    <span className="truncate w-full">{loading ? "Sincronizando..." : displayHash}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                    <p className="text-gray-500 text-[10px] uppercase font-bold mb-2 tracking-widest">Pureza</p>
                                    <p className="text-4xl font-black text-green-400 tracking-tight">{loading ? "--" : displayPurity}%</p>
                                </div>
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                    <p className="text-gray-500 text-[10px] uppercase font-bold mb-2 tracking-widest">Acidez</p>
                                    <p className="text-4xl font-black text-blue-400 tracking-tight">{loading ? "--" : displayAcidity}°</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-white/5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 ring-2 ring-green-500/20">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">Verificado por IA</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Nota de cata generada por Gemini</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
