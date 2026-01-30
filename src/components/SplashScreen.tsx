"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2500); // Display for 2.5 seconds

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bone transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <div className="relative w-48 h-16 animate-pulse">
                <Image
                    src="/logo.png"
                    alt="Certio Logo"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
        </div>
    );
}
