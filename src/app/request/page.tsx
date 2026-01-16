"use client";

import { useAuth } from "@/lib/auth_context";
import { RequestForm } from "@/components/forms/RequestForm";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useEffect, useState } from "react";
import { getUserProfile } from "@/lib/services/userService";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function RequestPage() {
    const { user } = useAuth();
    const [initialDept, setInitialDept] = useState("");
    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
        async function loadProfile() {
            if (user) {
                try {
                    const profile = await getUserProfile(user.uid);
                    if (profile?.department) {
                        setInitialDept(profile.department);
                    }
                } catch (error) {
                    console.error("Error loading profile:", error);
                } finally {
                    setLoadingProfile(false);
                }
            } else {
                setLoadingProfile(false);
            }
        }
        loadProfile();
    }, [user]);

    if (loadingProfile || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white/50" />
            </div>
        );
    }

    return (
        <AuthGuard>
            <div className="min-h-screen bg-black/20 p-4 md:p-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="flex items-center justify-between pb-6 border-b border-white/10">
                        <h1 className="text-2xl font-bold text-white">Development Request</h1>
                        <Link href="/dashboard">
                            <Button variant="ghost">Back to Dashboard</Button>
                        </Link>
                    </div>

                    <div className="relative fade-in-up">
                        <RequestForm user={user} initialDepartment={initialDept} />
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
