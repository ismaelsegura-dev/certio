"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search } from "lucide-react";
import Image from "next/image";

interface Lote {
    id: string;
    variedad: string;
    created_at: string;
    nota_cata: string;
    blockchain_id: string;
}

export default function InventoryPage() {
    const [lotes, setLotes] = useState<Lote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLotes();
    }, []);

    const fetchLotes = async () => {
        try {
            const { data, error } = await supabase
                .from("lotes")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setLotes(data || []);
        } catch (error) {
            console.error("Error fetching inventory:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen px-6 pt-12 pb-24">
            <header className="mb-6 flex justify-between items-end animate-in slide-in-from-top-4 duration-700">
                <div>
                    <div className="relative w-24 h-8 mb-2">
                        <Image
                            src="/logo.png"
                            alt="Certio"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <p className="text-gray-500 text-sm">Lotes certificados</p>
                </div>
            </header>

            {/* Search Bar - Visual only for MVP */}
            <div className="relative mb-8">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar por hash o variedad..."
                    className="w-full bg-white border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold-matte"
                />
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {lotes.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            No hay lotes certificados aún.
                        </div>
                    ) : (
                        lotes.map((lote, idx) => (
                            <div
                                key={lote.id}
                                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-olive-deep/5 hover:border-gold-matte/30 cursor-default group animate-in slide-in-from-bottom-2 fade-in"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="bg-olive-deep/5 text-olive-deep text-xs font-bold px-3 py-1.5 rounded-lg group-hover:bg-olive-deep group-hover:text-bone transition-colors duration-300">
                                        {lote.variedad}
                                    </span>
                                    <span className="text-xs text-gray-400 font-medium">
                                        {new Date(lote.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-4 group-hover:text-gray-900 transition-colors">
                                    {lote.nota_cata}
                                </p>
                                <div className="flex items-center gap-2 overflow-hidden bg-gray-50 px-3 py-2 rounded-lg group-hover:bg-bone transition-colors">
                                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 animate-pulse" />
                                    <code className="text-[10px] text-gray-400 truncate">
                                        {lote.blockchain_id}
                                    </code>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </main>
    );
}
