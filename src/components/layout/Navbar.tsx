"use client";

import { useAuth } from "@/lib/auth_context";
import Link from "next/link";
import { Button } from "../ui/Button";
import { useEffect, useState } from "react";
import { Settings, LogOut } from "lucide-react";

export function Navbar() {
    const { user, logout } = useAuth();
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            import("@/lib/services/configService").then(mod => {
                mod.getSystemConfig().then(config => {
                    if (config?.logoUrl) setLogoUrl(config.logoUrl);
                });
            });
        }
    }, [user]);

    if (!user) return null;

    const isAdmin = (user as any).isAdmin;

    if (!user) return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-40 bg-black/20 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-white/30">
                        {logoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-white/5 text-xs font-bold text-white/40">
                                LOGO
                            </div>
                        )}
                    </div>
                    {!logoUrl && (
                        <span className="text-white font-bold text-lg tracking-tight">
                            Internal<span className="text-blue-400">Tools</span>
                        </span>
                    )}
                </Link>

                <div className="flex items-center space-x-4">
                    {isAdmin && (
                        <Link href="/admin">
                            <Button variant="ghost" className="text-xs h-8">
                                <Settings className="w-3 h-3 mr-2" />
                                管理員
                            </Button>
                        </Link>
                    )}

                    <div className="flex items-center space-x-3 pl-4 border-l border-white/10">
                        <span className="text-sm text-white/60 hidden md:block">
                            {user.displayName}
                        </span>
                        <Button
                            variant="ghost"
                            onClick={logout}
                            className="text-white/40 hover:text-white p-2 h-auto"
                            title="登出"
                        >
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
