"use client";

import { useState, useEffect } from "react";
import CertioLogo from "@/components/CertioLogo";
import { certifyBatch } from "@/app/actions/certifyBatch";
import { CheckCircle2, AlertCircle, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import PyramidLoader from "@/components/PyramidLoader";

export default function NewBatchPage() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [selectedVariety, setSelectedVariety] = useState<string>("Picual");
    const router = useRouter();

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setLocationError(null);
                },
                (error) => {
                    console.error("Error getting location", error);
                    let errorMessage = "Ubicación no disponible";
                    if (error.code === error.PERMISSION_DENIED) {
                        errorMessage = "Permiso denegado. Activa la ubicación.";
                    } else if (error.code === error.TIMEOUT) {
                        errorMessage = "Tiempo de espera agotado.";
                    }
                    setLocationError(errorMessage);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
            );
        } else {
            setLocationError("Geolocalización no soportada");
        }
    }, []);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setStatus('idle');

        // Append manually controlled fields
        formData.set('variedad', selectedVariety);
        if (location) {
            formData.set('lat', location.lat.toString());
            formData.set('lng', location.lng.toString());
        }

        try {
            const result = await certifyBatch(formData);
            if (result.success) {
                setStatus('success');
                setTimeout(() => {
                    router.push('/inventory');
                }, 2000);
            } else {
                setStatus('error');
            }
        } catch (e) {
            console.error(e);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    }

    // Generate acidity options 0.1 to 0.9
    const acidityOptions = Array.from({ length: 9 }, (_, i) => ((i + 1) / 10).toFixed(1));

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center z-50 fixed inset-0">
                <PyramidLoader />
                <p className="mt-8 text-olive-deep font-bold text-xl animate-pulse">Certificando en Blockchain...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-neutral-50 p-6 flex flex-col items-center">
            <CertioLogo variant="dark" fixed={true} />

            <div className="w-full max-w-4xl mt-20 text-center">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 animate-in slide-in-from-bottom-5 duration-700">

                    {status === 'success' ? (
                        <div className="py-12 flex flex-col items-center animate-in zoom-in-50 duration-500">
                            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 size={48} />
                            </div>
                            <h2 className="text-3xl font-serif text-olive-deep mb-2">¡Lote Certificado!</h2>
                            <p className="text-gray-500">Datos y ubicación registrados en Blockchain.</p>
                            <p className="text-sm text-green-600 mt-4 font-bold animate-pulse">Redirigiendo al inventario...</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8">
                                <h1 className="text-4xl font-serif text-olive-deep mb-2">Certificar Lote</h1>
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                    <MapPin size={14} className={location ? "text-green-500" : "text-gray-400"} />
                                    {location ? (
                                        <span className="text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                                            {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                                        </span>
                                    ) : (
                                        <span className="text-amber-500">{locationError || "Detectando ubicación con alta precisión..."}</span>
                                    )}
                                </div>
                            </div>

                            <form action={handleSubmit} className="text-left max-w-2xl mx-auto">
                                <div className="flex flex-col md:flex-row gap-8 items-start">

                                    {/* Columna Izquierda: Variedad */}
                                    <div className="flex-1 w-full space-y-4">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Variedad</label>
                                        <div className="flex flex-col gap-3">
                                            {['Picual', 'Arbequina', 'Hojiblanca'].map((v) => (
                                                <button
                                                    key={v}
                                                    type="button"
                                                    onClick={() => setSelectedVariety(v)}
                                                    className={`p-4 rounded-2xl border-2 text-lg font-bold transition-all duration-200 flex items-center justify-between ${selectedVariety === v
                                                            ? 'border-olive-deep bg-olive-deep text-white shadow-lg scale-[1.02]'
                                                            : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {v}
                                                    {selectedVariety === v && <div className="w-3 h-3 bg-white rounded-full"></div>}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Columna Derecha: Acidez y Botón */}
                                    <div className="flex-1 w-full space-y-8">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Acidez Máxima (%)</label>
                                            <div className="relative">
                                                <select
                                                    name="acidez"
                                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-2xl font-black text-olive-deep outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 appearance-none text-center cursor-pointer transition-all"
                                                >
                                                    {acidityOptions.map(opt => (
                                                        <option key={opt} value={opt}>{opt}%</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z" /></svg>
                                                </div>
                                            </div>
                                            <p className="text-center text-xs text-gray-400 mt-2">Nivel de acidez detectado por sensor</p>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-5 bg-olive-deep text-white text-xl font-bold rounded-2xl hover:bg-olive-deep/90 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none flex items-center justify-center gap-3"
                                        >
                                            "CERTIFICAR AHORA"
                                        </button>
                                    </div>
                                </div>

                                {status === 'error' && (
                                    <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-center text-sm font-medium animate-in fade-in">
                                        <AlertCircle size={16} className="inline mr-2 mb-0.5" />
                                        Error de conexión al Blockchain. Verifica tu conexión.
                                    </div>
                                )}
                            </form>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
