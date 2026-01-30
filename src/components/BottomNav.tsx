"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusCircle, PackageCheck, BarChart3 } from "lucide-react";

export default function BottomNav() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-lg border border-white/20 shadow-2xl shadow-olive-deep/10 rounded-full px-6 py-4 z-50">
            <div className="flex justify-around items-center">
                <Link
                    href="/new-batch"
                    className={`flex flex-col items-center gap-1 transition-all duration-300 hover:scale-110 ${isActive("/new-batch")
                        ? "text-olive-deep scale-110 drop-shadow-sm"
                        : "text-gray-400 hover:text-gold-matte"
                        }`}
                >
                    <PlusCircle className="w-6 h-6" />
                    <span className="text-xs font-medium">Nuevo Lote</span>
                </Link>
                <Link
                    href="/inventory"
                    className={`flex flex-col items-center gap-1 transition-all duration-300 hover:scale-110 ${isActive("/inventory")
                        ? "text-olive-deep scale-110 drop-shadow-sm"
                        : "text-gray-400 hover:text-gold-matte"
                        }`}
                >
                    <PackageCheck className="w-6 h-6" />
                    <span className="text-xs font-medium">Inventario</span>
                </Link>
                <Link
                    href="/stats"
                    className={`flex flex-col items-center gap-1 transition-all duration-300 hover:scale-110 ${isActive("/stats")
                        ? "text-olive-deep scale-110 drop-shadow-sm"
                        : "text-gray-400 hover:text-gold-matte"
                        }`}
                >
                    <BarChart3 className="w-6 h-6" />
                    <span className="text-xs font-medium">Estadísticas</span>
                </Link>
            </div>
        </nav>
    );
}
