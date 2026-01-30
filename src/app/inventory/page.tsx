"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Copy, Package, Droplets, MapPin, Activity } from "lucide-react";
import Link from "next/link";
import CertioLogo from "@/components/CertioLogo";

type Lote = {
    id: number;
    variedad: string;
    acidez: number;
    nota_cata: string;
    blockchain_id: string; // Changed from blockchain_hash to match screenshot
    lat: number;
    lng: number;
};

export default function InventoryPage() {
    const [lotes, setLotes] = useState<Lote[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMapId, setSelectedMapId] = useState<number | null>(null);

    useEffect(() => {
        // 1. Carga inicial de datos
        const fetchLotes = async () => {
            const { data, error } = await supabase
                .from("lotes")
                .select("*")
                .order("id", { ascending: false });

            if (error) {
                console.error("Error cargando inventario:", error);
            } else {
                setLotes(data || []);
            }
            setLoading(false);
        };

        fetchLotes();

        // 2. Suscripción a cambios en tiempo real (Realtime)
        const channel = supabase
            .channel('lotes-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'lotes' },
                (payload) => {
                    console.log('Cambio detectado:', payload);
                    // Recargar lotes para simplificar sincronización (o actualizar estado manualmente)
                    fetchLotes();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Podrías añadir un toast aquí
    };

    const toggleMap = (id: number) => {
        setSelectedMapId(selectedMapId === id ? null : id);
    };

    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<'all' | 'premium' | 'standard'>('all');

    const filteredLotes = lotes.filter(lote => {
        const matchesSearch =
            lote.variedad.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lote.id.toString().includes(searchTerm);

        const matchesFilter =
            filterType === 'all' ? true :
                filterType === 'premium' ? lote.acidez < 0.3 :
                    lote.acidez >= 0.3;

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="text-gray-400 font-medium">Cargando inventario...</div>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-neutral-50 pb-24">
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="mb-4">
                            <CertioLogo variant="dark" />
                        </div>
                        <h1 className="text-3xl font-serif text-olive-deep mb-1">Inventario</h1>
                        <p className="text-gray-500 text-sm flex items-center gap-2">
                            <Activity className="w-3 h-3 text-green-500 animate-pulse" />
                            Sincronizado en tiempo real
                        </p>
                    </div>
                    <div className="bg-olive-deep/5 px-4 py-2 rounded-full border border-olive-deep/10">
                        <span className="font-bold text-olive-deep">{lotes.length}</span>
                        <span className="text-olive-deep/60 text-sm ml-1">Lotes</span>
                    </div>
                </div>

                {/* Buscador y Filtros */}
                <div className="space-y-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar por variedad o ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-olive-deep focus:ring-2 focus:ring-olive-deep/20 outline-none transition-all shadow-sm text-sm"
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <div className="flex gap-2 text-xs font-medium overflow-x-auto pb-1 no-scrollbar">
                        <button
                            onClick={() => setFilterType('all')}
                            className={`px-4 py-2 rounded-full border transition-all whitespace-nowrap ${filterType === 'all'
                                ? 'bg-olive-deep text-white border-olive-deep'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => setFilterType('premium')}
                            className={`px-4 py-2 rounded-full border transition-all whitespace-nowrap flex items-center gap-1.5 ${filterType === 'premium'
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Premium (&lt;0.3%)
                        </button>
                        <button
                            onClick={() => setFilterType('standard')}
                            className={`px-4 py-2 rounded-full border transition-all whitespace-nowrap flex items-center gap-1.5 ${filterType === 'standard'
                                ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                            Estándar
                        </button>
                    </div>
                </div>
            </header>

            <div className="px-6 space-y-4">
                {filteredLotes.length === 0 ? (
                    <div className="text-center py-20">
                        <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-gray-400 font-medium">No se encontraron lotes</h3>
                        <p className="text-sm text-gray-400 mt-2">Prueba con otros filtros de búsqueda</p>
                    </div>
                ) : (
                    filteredLotes.map((lote) => (
                        <div
                            key={lote.id}
                            className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-gold-matte/30 relative"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-3xl font-bold text-olive-deep font-serif mb-2">
                                        {lote.variedad}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-olive-deep text-white text-xs font-bold px-2 py-1 rounded">LOTE</span>
                                        <p className="text-lg text-gray-400 font-mono tracking-wider">
                                            #{lote.id}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-3">
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${lote.acidez < 0.3 ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                                        }`}>
                                        {lote.acidez}% Acidez
                                    </span>
                                    {/* Botón QR Certificado */}
                                    <a
                                        href={`https://amoy.polygonscan.com/tx/${lote.blockchain_id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-2 bg-gray-50 hover:bg-olive-deep hover:text-white px-3 py-1.5 rounded-lg border border-gray-200 hover:border-olive-deep transition-all duration-300"
                                        title="Ver Certificado en Amoy Network"
                                    >
                                        <span className="text-xs font-medium uppercase tracking-wider opacity-60 group-hover:opacity-100">Certificado</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect width="5" height="5" x="3" y="3" rx="1" />
                                            <rect width="5" height="5" x="16" y="3" rx="1" />
                                            <rect width="5" height="5" x="3" y="16" rx="1" />
                                            <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
                                            <path d="M21 21v.01" />
                                            <path d="M12 7v3a2 2 0 0 1-2 2H7" />
                                            <path d="M3 12h.01" />
                                            <path d="M12 3h.01" />
                                            <path d="M12 16v.01" />
                                            <path d="M16 12h1" />
                                            <path d="M21 12v.01" />
                                            <path d="M12 21v-1" />
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h4 className="text-xs font-bold text-gold-matte uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                    <span className="w-8 h-[1px] bg-gold-matte"></span>
                                    Nota de Cata IA
                                </h4>
                                <blockquote className="relative p-6 bg-neutral-50 rounded-xl border-l-4 border-olive-deep">
                                    <p className="text-xl text-gray-700 font-serif leading-relaxed italic">
                                        "{lote.nota_cata}"
                                    </p>
                                </blockquote>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-50 pt-4 mt-4">
                                <div className="flex flex-col w-full">
                                    <div className="flex items-center justify-between w-full">
                                        <div
                                            className={`flex items-center gap-1.5 transition-colors ${lote.lat ? 'cursor-pointer text-blue-600 hover:text-blue-800' : 'text-gray-400'}`}
                                            title={lote.lat ? "Ver mapa satelital" : "Sin ubicación"}
                                            onClick={() => lote.lat && toggleMap(lote.id)}
                                        >
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span className={lote.lat ? "underline decoration-blue-200 hover:decoration-blue-600" : ""}>
                                                {lote.lat ? `${lote.lat.toFixed(4)}, ${lote.lng.toFixed(4)}` : "Ubicación pendiente"}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5 min-w-0 max-w-[120px] sm:max-w-[200px]">
                                            <div className="w-3.5 h-3.5 flex items-center justify-center bg-gray-100 rounded text-[8px] font-bold text-gray-500">#</div>
                                            <span className="truncate font-mono">{lote.blockchain_id || 'Pendiente...'}</span>
                                            {lote.blockchain_id && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        copyToClipboard(lote.blockchain_id);
                                                    }}
                                                    className="p-1 hovered:bg-gray-100 rounded transition-colors"
                                                >
                                                    <Copy className="w-3 h-3 text-gray-400 hover:text-olive-deep" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Mapa Desplegable */}
                                    {selectedMapId === lote.id && lote.lat && (
                                        <div className="mt-3 w-full h-48 rounded-lg overflow-hidden border border-gray-200 animate-in slide-in-from-top-2 duration-300">
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                frameBorder="0"
                                                scrolling="no"
                                                marginHeight={0}
                                                marginWidth={0}
                                                src={`https://maps.google.com/maps?q=${lote.lat},${lote.lng}&t=k&z=17&ie=UTF8&iwloc=&output=embed`}
                                                title="Vista Satelital"
                                            ></iframe>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}
