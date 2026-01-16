import { ToolRequest } from "@/lib/types";
import { Card } from "../ui/Card";
import { StatusBadge } from "../ui/StatusBadge";
import { Calendar, User } from "lucide-react";

interface RequestCardProps {
    request: ToolRequest;
    onClick: () => void;
}

export function RequestCard({ request, onClick }: RequestCardProps) {
    return (
        <Card
            onClick={onClick}
            hoverEffect
            className="cursor-pointer bg-white/5 border-white/10 p-5 space-y-4"
        >
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <div className="text-xs text-white/40 font-mono">{request.ticketNo}</div>
                    <h3 className="font-semibold text-white/90 truncate pr-2">{request.toolName}</h3>
                </div>
                <StatusBadge status={request.status} />
            </div>

            <p className="text-sm text-white/60 line-clamp-2 min-h-[40px]">
                {request.description}
            </p>

            <div className="flex items-center justify-between text-xs text-white/40 pt-2 border-t border-white/5">
                <div className="flex items-center space-x-2">
                    <User className="w-3 h-3" />
                    <span>{request.applicantName}</span>
                </div>

                {/* Admin Handler (Last Editor) */}
                {request.adminHandler && (
                    <div className="flex items-center space-x-2" title={`Last updated by ${request.adminHandler.displayName || 'Admin'}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {request.adminHandler.photoURL ? (
                            <img src={request.adminHandler.photoURL} alt="Admin" className="w-4 h-4 rounded-full border border-white/20" />
                        ) : (
                            <div className="w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center text-[8px] text-indigo-300 font-bold">
                                A
                            </div>
                        )}
                        <span className="hidden sm:inline text-white/30">{request.adminHandler.displayName}</span>
                    </div>
                )}

                <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3" />
                    <span>
                        {(request.createdAt as any)?.toDate ? (request.createdAt as any).toDate().toLocaleDateString() : 'Just now'}
                    </span>
                </div>
            </div>
        </Card>
    );
}
