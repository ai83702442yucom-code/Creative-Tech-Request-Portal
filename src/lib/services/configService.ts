import { db, storage } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function updateSystemLogo(file: File): Promise<string> {
    const storageRef = ref(storage, "system/logo.png");
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    const configRef = doc(db, "config", "system");
    await setDoc(configRef, {
        logoUrl: url,
        updatedAt: serverTimestamp(),
    }, { merge: true });

    return url;
}

export async function getSystemConfig() {
    const configRef = doc(db, "config", "system");
    const snap = await import("firebase/firestore").then(m => m.getDoc(configRef));
    return snap.exists() ? snap.data() : null;
}
