"use client";

import { useAuth } from "@/lib/auth_context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user && pathname !== "/login") {
            router.push("/login"); // Save redirect URL if needed
        }
    }, [user, loading, router, pathname]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white/50" />
            </div>
        );
    }

    // If on login page, render children (which is the login page)
    // If authenticated, render children (protected content)
    // If unauthenticated and not on login, we redirect (and ideally show spinner)

    if (!user && pathname !== "/login") {
        return null; // Or spinner while redirecting
    }

    return <>{children}</>;
}
