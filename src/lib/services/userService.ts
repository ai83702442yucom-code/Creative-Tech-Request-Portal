import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { UserProfile } from "../types";

export async function saveUserDepartment(uid: string, department: string) {
    if (!uid || !department) return;

    const userRef = doc(db, "users", uid);
    // Using setDoc with merge to ensure document exists
    await setDoc(userRef, {
        department,
        updatedAt: serverTimestamp()
    }, { merge: true });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
        return { uid, ...snap.data() } as UserProfile;
    }
    return null;
}

export async function syncUserProfile(uid: string, data: Partial<UserProfile>) {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
        ...data,
        uid,
        updatedAt: serverTimestamp()
    }, { merge: true });
}
