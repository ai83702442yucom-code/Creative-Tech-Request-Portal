import { cn } from "@/lib/utils";
import { RequestStatus } from "@/lib/types";

interface StatusBadgeProps {
    status: RequestStatus;
    className?: string;
}

export const statusConfig: Record<RequestStatus, { label: string; color: string; bg: string }> = {
    pending: { label: "待處理", color: "text-gray-200", bg: "bg-gray-500/20 border-gray-500/30" },
    discussing: { label: "討論中", color: "text-red-200", bg: "bg-red-500/20 border-red-500/30" },
    developing: { label: "開發中", color: "text-orange-200", bg: "bg-orange-500/20 border-orange-500/30" },
    done: { label: "已完成", color: "text-green-200", bg: "bg-green-500/20 border-green-500/30" },
    cancelled: { label: "已取消", color: "text-zinc-400", bg: "bg-black/40 border-white/5" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = statusConfig[status] || statusConfig.pending;

    return (
        <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-md",
            config.color,
            config.bg,
            className
        )}>
            <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", config.color.replace("text-", "bg-"))} />
            {config.label}
        </span>
    );
}
