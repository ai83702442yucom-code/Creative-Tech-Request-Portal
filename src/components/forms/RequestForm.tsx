import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { createRequest } from "@/lib/services/requestService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";

interface RequestFormProps {
    user: User;
    initialDepartment?: string;
}

export function RequestForm({ user, initialDepartment = "" }: RequestFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        toolName: "",
        description: "",
        criteria: "",
        department: initialDepartment,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const ticketId = await createRequest({
                ...formData,
                user: {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                },
            });

            toast.success(`Request submitted: ${ticketId}`);
            router.push("/");
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="max-w-2xl mx-auto space-y-6 bg-white/5 border-white/10">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-white">建立新需求</h2>
                        <p className="text-sm text-white/60">
                            提交新的工具開發需求。
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        className="text-white/40 hover:text-white"
                        onClick={() => router.push("/")}
                    >
                        ✕
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="申請人"
                        value={user.displayName || user.email || ""}
                        disabled
                        className="opacity-50"
                    />
                    <Input
                        label="部門"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        placeholder="例如：營運部"
                        required
                    />
                </div>

                <Input
                    label="工具名稱"
                    name="toolName"
                    value={formData.toolName}
                    onChange={handleChange}
                    placeholder="例如：自動化訂單機器人"
                    required
                />

                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">需求描述</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="glass-input w-full min-h-[100px] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/30"
                        placeholder="請詳細描述工具的功能與用途..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">驗收標準</label>
                    <textarea
                        name="criteria"
                        value={formData.criteria}
                        onChange={handleChange}
                        required
                        className="glass-input w-full min-h-[80px] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/30"
                        placeholder="成功的定義是什麼？ (例如：處理時間 < 1分鐘)"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.push("/")}
                        className="text-white/60"
                        disabled={loading}
                    >
                        取消
                    </Button>
                    <Button type="submit" isLoading={loading} className="w-full md:w-auto min-w-[120px]">
                        提交申請
                    </Button>
                </div>
            </Card>
        </form>
    );
}
