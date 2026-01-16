"use client";

import { useAuth } from "@/lib/auth_context";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useEffect, useState } from "react";
import { subscribeToRequests } from "@/lib/services/requestService";
import { RequestStatus, ToolRequest } from "@/lib/types";
import { RequestList } from "@/components/ui/RequestList";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { RequestDetailModal } from "@/components/ui/RequestDetailModal";
import { statusConfig } from "@/components/ui/StatusBadge";

const STATUS_FILTERS: RequestStatus[] = ["pending", "discussing", "developing", "done", "cancelled"];

export default function DashboardPage() {
  const { user } = useAuth();
  const [allRequests, setAllRequests] = useState<ToolRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
  const [selectedRequest, setSelectedRequest] = useState<ToolRequest | null>(null);
  const isAdmin = (user as any)?.isAdmin || false;

  useEffect(() => {
    // Subscribe to all requests and filter client-side to avoid re-subscribing
    const unsubscribe = subscribeToRequests({}, (data: ToolRequest[]) => {
      setAllRequests(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const requests = allRequests.filter(r => {
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    const searchLower = search.toLowerCase();
    const matchSearch =
      r.ticketNo.toLowerCase().includes(searchLower) ||
      r.toolName.toLowerCase().includes(searchLower) ||
      (r.applicantName || "").toLowerCase().includes(searchLower);
    return matchStatus && matchSearch;
  });

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black/20 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
                創研需求管理平台
              </h1>
              <p className="text-white/60">驅動企業創新，打造數位資產的實踐基地</p>
            </div>
            <Link href="/request">
              <Button className="w-full md:w-auto shadow-lg shadow-blue-500/20">
                <Plus className="w-4 h-4 mr-2" /> 新增需求
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 bg-white/5 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
            <div className="flex-1">
              <Input
                placeholder="搜尋單號、工具名稱、申請人..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-black/20"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={statusFilter === "all" ? "primary" : "ghost"}
                onClick={() => setStatusFilter("all")}
                className="text-xs h-9"
              >
                全部
              </Button>
              {STATUS_FILTERS.map(s => (
                <Button
                  key={s}
                  variant={statusFilter === s ? "primary" : "ghost"}
                  onClick={() => setStatusFilter(s)}
                  className="text-xs h-9 capitalize"
                >
                  {statusConfig[s].label}
                </Button>
              ))}
            </div>
          </div>

          {/* List */}
          <RequestList
            requests={requests}
            loading={loading}
            onSelect={setSelectedRequest}
          />
        </div>


        {/* Modal */}
        <RequestDetailModal
          request={selectedRequest}
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          isAdmin={isAdmin}
          onEdit={() => { }}
        />
      </div>
    </AuthGuard>
  );
}
