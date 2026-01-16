import { ToolRequest } from "@/lib/types";
import { RequestCard } from "./RequestCard";
import { Loader2 } from "lucide-react";

interface RequestListProps {
    requests: ToolRequest[];
    loading: boolean;
    onSelect: (request: ToolRequest) => void;
}

export function RequestList({ requests, loading, onSelect }: RequestListProps) {
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-white/30" />
            </div>
        );
    }

    if (requests.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-white/40 space-y-2 border border-dashed border-white/10 rounded-xl bg-white/5">
                <p>未找到任何需求。</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requests.map((req) => (
                <RequestCard key={req.doc_id} request={req} onClick={() => onSelect(req)} />
            ))}
        </div>
    );
}
