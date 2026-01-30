"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function NewBatchPage() {
    const [variety, setVariety] = useState<string>("Picual");
    const [acidity, setAcidity] = useState<string>("0.2");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const varieties = ["Arbequina", "Picual", "Hojiblanca"];
    const acidities = ["0.1", "0.2", "0.3", "0.4", "0.5"];

    const handleCertify = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // 1. Capture Geolocation
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                if (!navigator.geolocation) {
                    reject(new Error("Geolocation not supported"));
                }
                navigator.geolocation.getCurrentPosition(resolve, (err) => {
                    console.warn("Geolocation failed, using default:", err);
                    resolve({
                        coords: { latitude: 0.0, longitude: 0.0 }
                    } as GeolocationPosition);
                });
            });

            const { latitude, longitude } = position.coords;

            // 2. Call Make.com via Server Action
            // Ahora delegamos la creación del hash y el guardado en BD a Make.com
            // (La Server Action certifyBatch llama al Webhook)
            const { certifyBatch } = await import("@/app/actions/certifyBatch");
            await certifyBatch({
                variety,
                acidity,
                lat: latitude || 0.0,
                lng: longitude || 0.0,
            });

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);

        } catch (err: any) {
            console.error("Error completo:", err);
            if (err instanceof Error) {
                console.error("Mensaje:", err.message);
            }
            // Si el error es legible, lo mostramos, si no uno genérico
            setError(err.message || "Error al certificar el lote. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center animate-in fade-in">
                <Loader2 className="w-12 h-12 text-gold-matte animate-spin mb-6" />
                <h2 className="text-xl font-serif text-olive-deep">
                    Generando Sello Blockchain e IA...
                </h2>
                <p className="text-gray-500 mt-2 text-sm">
                    Validando parámetros de calidad
                </p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center animate-in zoom-in duration-300">
                <CheckCircle2 className="w-16 h-16 text-green-600 mb-6" />
                <h2 className="text-2xl font-serif text-olive-deep mb-2">
                    ¡Lote Certificado!
                </h2>
                <p className="text-gray-600">
                    El lote ha sido registrado correctamente en la blockchain.
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-8 px-6 py-2 bg-olive-deep text-bone rounded-full text-sm font-medium"
                >
                    Certificar otro
                </button>
            </div>
        );
    }

    return (
        <main className="min-h-screen px-6 pt-12 pb-24">
            <header className="mb-8">
                <h1 className="text-3xl font-serif text-olive-deep mb-2">Nuevo Lote</h1>
                <p className="text-gray-500">Registra y certifica la producción</p>
            </header>

            <div className="space-y-8">
                <section>
                    <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider pl-1">
                        Variedad
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {varieties.map((v) => (
                            <button
                                key={v}
                                onClick={() => setVariety(v)}
                                className={`px-6 py-3 rounded-full border transition-all duration-300 transform hover:scale-105 active:scale-95 ${variety === v
                                    ? "bg-olive-deep text-bone border-olive-deep shadow-lg shadow-olive-deep/30 ring-2 ring-gold-matte ring-offset-2 ring-offset-bone"
                                    : "bg-white text-gray-600 border-gray-100 hover:border-gold-matte hover:text-olive-deep hover:shadow-md"
                                    }`}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                </section>

                <section>
                    <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider pl-1">
                        Acidez (%)
                    </label>
                    <div className="relative group">
                        <select
                            value={acidity}
                            onChange={(e) => setAcidity(e.target.value)}
                            className="w-full appearance-none bg-white border border-gray-100 rounded-2xl px-5 py-4 text-olive-deep font-medium transition-all duration-300 group-hover:border-gold-matte/50 focus:outline-none focus:border-gold-matte focus:ring-4 focus:ring-gold-matte/10 shadow-sm group-hover:shadow-md"
                        >
                            {acidities.map((a) => (
                                <option key={a} value={a}>{a}°</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-gray-400 group-hover:text-gold-matte transition-colors">
                            <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </section>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleCertify}
                    className="w-full relative group overflow-hidden bg-gradient-to-r from-gold-matte to-yellow-600 text-white font-bold tracking-brand py-5 rounded-2xl shadow-xl shadow-gold-matte/30 transition-all duration-300 hover:shadow-2xl hover:shadow-gold-matte/40 hover:-translate-y-1 active:scale-[0.98]"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        Certificar Lote
                        <CheckCircle2 className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </span>
                </button>
            </div>
        </main>
    );
}
