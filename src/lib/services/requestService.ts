import { db } from "../firebase";
import {
    collection,
    runTransaction,
    serverTimestamp,
    doc,
    query,
    orderBy,
    onSnapshot
} from "firebase/firestore";
import { ToolRequest, RequestStatus } from "../types";
import { saveUserDepartment } from "./userService";

interface SubmitRequestParams {
    toolName: string;
    description: string;
    criteria: string;
    department: string;
    user: {
        uid: string;
        displayName: string | null;
        email: string | null;
    };
}

export async function createRequest(params: SubmitRequestParams): Promise<string> {
    const { toolName, description, criteria, department, user } = params;

    // 1. Save Department Preference
    await saveUserDepartment(user.uid, department);

    // 2. Transaction for Ticket ID
    return await runTransaction(db, async (transaction) => {
        // Generate shard key for today: requests_20260116
        const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // 20260116
        const counterRef = doc(db, "counters", `requests_${todayStr}`);

        // Read counter
        const counterSnap = await transaction.get(counterRef);
        let currentCount = 0;

        if (counterSnap.exists()) {
            currentCount = counterSnap.data().count || 0;
        }

        const nextCount = currentCount + 1;
        const ticketNo = `REQ-${todayStr}-${String(nextCount).padStart(3, "0")}`;

        // Create Request Document Reference
        const requestRef = doc(collection(db, "requests"));

        // Set Counter (inc)
        transaction.set(counterRef, { count: nextCount }, { merge: true });

        // Set Request
        const newRequest: Partial<ToolRequest> = {
            ticketNo,
            applicantUid: user.uid,
            applicantName: user.displayName || user.email || "Unknown",
            department,
            toolName,
            description,
            criteria,
            status: "pending",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        transaction.set(requestRef, newRequest);

        return requestRef.id;
    });
}

export function subscribeToRequests(
    filterParams: { status?: RequestStatus; search?: string },
    callback: (requests: ToolRequest[]) => void
) {
    const q = query(
        collection(db, "requests"),
        orderBy("createdAt", "desc")
    );

    // Real-time listener
    return onSnapshot(q, (snapshot) => {
        let requests = snapshot.docs.map(d => ({ doc_id: d.id, ...d.data() } as ToolRequest));

        if (filterParams.status) {
            requests = requests.filter(r => r.status === filterParams.status);
        }

        if (filterParams.search) {
            const lower = filterParams.search.toLowerCase();
            requests = requests.filter(r =>
                r.toolName.toLowerCase().includes(lower) ||
                r.applicantName.toLowerCase().includes(lower) ||
                r.ticketNo.toLowerCase().includes(lower)
            );
        }

        callback(requests);
    });
}

export async function updateRequestAdmin(
    docId: string,
    data: {
        status?: RequestStatus;
        adminNote?: string;
        estimatedDate?: Date;
        adminHandler?: {
            uid: string;
            displayName: string | null;
            photoURL: string | null;
        };
    }
) {
    const ref = doc(db, "requests", docId);
    await runTransaction(db, async (transaction) => {
        // Only update allowed fields
        transaction.update(ref, {
            ...data,
            updatedAt: serverTimestamp()
        });
    });
}

export async function deleteRequest(docId: string) {
    const ref = doc(db, "requests", docId);
    await runTransaction(db, async (transaction) => {
        transaction.delete(ref);
    });
}
