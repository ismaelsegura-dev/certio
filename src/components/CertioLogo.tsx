"use client";

import Link from "next/link";

interface CertioLogoProps {
    variant?: "light" | "dark";
    fixed?: boolean;
    className?: string;
}

export default function CertioLogo({ variant = "dark", fixed = false, className = "" }: CertioLogoProps) {
    const textColor = variant === "light" ? "text-white" : "text-olive-deep";
    const hoverText = variant === "light" ? "group-hover:text-green-500" : "group-hover:text-olive-deep/80";
    const positionClass = fixed ? "fixed top-6 left-6 z-50" : "";

    return (
        <Link href="/" className={`inline-flex items-center gap-3 group ${positionClass} ${className}`}>
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-black font-black text-xl group-hover:scale-105 transition-transform shadow-[0_0_20px_-5px_rgba(34,197,94,0.5)]">
                C
            </div>
            <span className={`text-xl font-bold tracking-tighter transition-colors ${textColor} ${hoverText}`}>
                CERTIO
            </span>
        </Link>
    );
}
