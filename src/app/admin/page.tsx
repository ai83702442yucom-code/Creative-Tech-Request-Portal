"use client";

import { useAuth } from "@/lib/auth_context";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { updateSystemLogo } from "@/lib/services/configService";
import { toast } from "sonner";

export default function AdminPage() {
    const { user, loading } = useAuth();
    const [checking, setChecking] = useState(true);
    const router = useRouter();
    const [logoUploading, setLogoUploading] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            } else {
                // Cast to custom type or dictionary to avoid implicit any errors if strict
                const currentUser = user as unknown as { isAdmin?: boolean };
                if (!currentUser.isAdmin) {
                    router.push("/");
                }
                setChecking(false);
            }
        }
    }, [user, loading, router]);

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLogoUploading(true);
        try {
            await updateSystemLogo(file);
            toast.success("Logo updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update logo");
        } finally {
            setLogoUploading(false);
        }
    };

    if (loading || checking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-white/50" />
            </div>
        );
    }

    return (
        <AuthGuard>
            <div className="min-h-screen bg-black/20 p-4 md:p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h1 className="text-3xl font-bold text-white">系統管理</h1>

                    <div className="grid gap-6">
                        <Card className="bg-white/5 border-white/10 p-6 space-y-4">
                            <h2 className="text-xl font-semibold text-white">系統設定</h2>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">系統 LOGO</label>
                                <div className="flex items-center gap-4">
                                    <Button
                                        className="relative overflow-hidden"
                                        variant="secondary"
                                        isLoading={logoUploading}
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        上傳 LOGO
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={handleLogoUpload}
                                        />
                                    </Button>
                                    <span className="text-xs text-white/40">支援格式：PNG, JPG, SVG</span>
                                </div>
                            </div>
                        </Card>

                        {/* Future Admin Features */}
                        <Card className="bg-white/5 border-white/10 p-6 opacity-50">
                            <h2 className="text-xl font-semibold text-white">使用者管理</h2>
                            <p className="text-sm text-white/60">即將推出。</p>
                        </Card>
                    </div>

                    <Button variant="ghost" onClick={() => router.push("/")}>
                        返回儀表板
                    </Button>
                </div>
            </div>
        </AuthGuard>
    );
}
