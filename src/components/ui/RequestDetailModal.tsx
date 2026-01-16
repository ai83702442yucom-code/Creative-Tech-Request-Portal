import { ToolRequest, RequestStatus } from "@/lib/types";
import { useAuth } from "@/lib/auth_context";
import { StatusBadge } from "../ui/StatusBadge";
import { X, Calendar, User, AlignLeft, CheckCircle, Save, Trash2, Edit2 } from "lucide-react";
import { Button } from "../ui/Button";
import { useState, useEffect } from "react";
import { updateRequestAdmin, deleteRequest } from "@/lib/services/requestService"; // Assume implemented
import { toast } from "sonner";
import { Input } from "../ui/Input";

interface RequestDetailModalProps {
    request: ToolRequest | null;
    isOpen: boolean;
    onClose: () => void;
    isAdmin?: boolean;
    onEdit?: () => void;
}

const STATUS_OPTIONS: RequestStatus[] = ["pending", "discussing", "developing", "done", "cancelled"];

export function RequestDetailModal({ request, isOpen, onClose, isAdmin }: RequestDetailModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<{ status: RequestStatus; adminNote: string; estimatedDate: string }>({
        status: "pending",
        adminNote: "",
        estimatedDate: ""
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (request && isOpen) {
            let dateStr = "";
            if (request.estimatedDate) {
                // Handle Firestore Timestamp
                const date = typeof (request.estimatedDate as any).toDate === 'function'
                    ? (request.estimatedDate as any).toDate()
                    : new Date(request.estimatedDate as any);
                dateStr = date.toISOString().split('T')[0];
            }

            setEditData({
                status: request.status,
                adminNote: request.adminNote || "",
                estimatedDate: dateStr
            });
            setIsEditing(false); // Reset edit mode on open
        }
    }, [request, isOpen]);

    if (!isOpen || !request) return null;

    const { user } = useAuth(); // Import useAuth to get current admin info

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateRequestAdmin(request.doc_id, {
                status: editData.status,
                adminNote: editData.adminNote,
                estimatedDate: editData.estimatedDate ? new Date(editData.estimatedDate) : undefined,
                adminHandler: user ? {
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL
                } : undefined
            });
            toast.success("Request updated");
            setIsEditing(false);
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this request?")) return;
        try {
            await deleteRequest(request.doc_id);
            toast.success("Request deleted");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Panel */}
            <div
                className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-[#0f0c29]/90 border border-white/10 shadow-2xl transition-all p-6 text-left align-middle"
                style={{
                    background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.95), rgba(15, 12, 41, 0.95))'
                }}
            >
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                            <span className="text-xs text-white/40 font-mono tracking-wider">{request.ticketNo}</span>
                            {isEditing ? (
                                <select
                                    value={editData.status}
                                    onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value as RequestStatus }))}
                                    className="bg-white/10 border border-white/20 text-white text-xs rounded px-2 py-1"
                                >
                                    {STATUS_OPTIONS.map(s => <option key={s} value={s} className="text-black">{s}</option>)}
                                </select>
                            ) : (
                                <StatusBadge status={request.status} />
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-white leading-tight">{request.toolName}</h2>
                    </div>

                    <div className="flex items-center space-x-2">
                        {isAdmin && !isEditing && (
                            <Button variant="ghost" onClick={() => setIsEditing(true)} className="p-2 h-auto text-white/50 hover:text-white" title="Edit">
                                <Edit2 className="w-4 h-4" />
                            </Button>
                        )}
                        <Button variant="ghost" onClick={onClose} className="p-2 h-auto text-white/50 hover:text-white">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                <div className="py-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Meta */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                            <span className="text-white/40 text-xs uppercase">申請人</span>
                            <div className="flex items-center space-x-2 text-white/90">
                                <User className="w-4 h-4 text-purple-400" />
                                <span>{request.applicantName}</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-white/40 text-xs uppercase">部門</span>
                            <div className="text-white/90">{request.department}</div>
                        </div>
                        {/* Estimated Date Section */}
                        <div className="space-y-1 col-span-2 sm:col-span-1">
                            <span className="text-white/40 text-xs uppercase flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> 預計完成日期
                            </span>
                            {isEditing ? (
                                <input
                                    type="date"
                                    value={editData.estimatedDate}
                                    onChange={(e) => setEditData(prev => ({ ...prev, estimatedDate: e.target.value }))}
                                    className="bg-white/10 border border-white/20 text-white text-sm rounded px-2 py-1 w-full"
                                />
                            ) : (
                                <div className="text-white/90 font-mono">
                                    {request.estimatedDate ? (
                                        (request.estimatedDate as any).toDate ?
                                            (request.estimatedDate as any).toDate().toLocaleDateString() :
                                            new Date(request.estimatedDate as any).toLocaleDateString()
                                    ) : (
                                        <span className="text-white/30 italic">尚未排程</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-white/60 flex items-center gap-2">
                            <AlignLeft className="w-4 h-4" /> 需求描述
                        </h3>
                        <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                            {request.description}
                        </div>
                    </div>

                    {/* Criteria */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-white/60 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" /> 驗收標準
                        </h3>
                        <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                            {request.criteria}
                        </div>
                    </div>

                    {(request.adminNote || isEditing) && (
                        <div className="space-y-2 pt-4 border-t border-white/10">
                            <h3 className="text-sm font-semibold text-white/60 flex items-center gap-2">
                                管理員註記
                            </h3>
                            {isEditing ? (
                                <textarea
                                    value={editData.adminNote}
                                    onChange={(e) => setEditData(prev => ({ ...prev, adminNote: e.target.value }))}
                                    className="w-full h-20 bg-white/10 border border-white/20 rounded p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30"
                                    placeholder="新增內部註記..."
                                />
                            ) : (
                                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-100 text-sm italic">
                                    {request.adminNote}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Admin Actions */}
                    {isEditing && (
                        <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                            <Button onClick={handleDelete} variant="danger" className="text-xs">
                                <Trash2 className="w-4 h-4 mr-2" /> 刪除需求
                            </Button>

                            <div className="space-x-2">
                                <Button onClick={() => setIsEditing(false)} variant="ghost">取消</Button>
                                <Button onClick={handleSave} isLoading={saving}>
                                    <Save className="w-4 h-4 mr-2" /> 儲存變更
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
