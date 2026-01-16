"use client";

// Auth Context v3
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
    User,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import { auth } from "./firebase";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // Fetch user role
                try {
                    const { doc, getDoc, setDoc } = await import("firebase/firestore");
                    const { db } = await import("./firebase");

                    const userRef = doc(db, "users", currentUser.uid);
                    const userSnap = await getDoc(userRef);

                    let role = "user";

                    if (userSnap.exists()) {
                        role = userSnap.data().role || "user";
                    } else {
                        // Create initial user doc
                        await setDoc(userRef, {
                            displayName: currentUser.displayName,
                            email: currentUser.email,
                            role: "user",
                            createdAt: new Date()
                        });
                    }

                    setUser({
                        ...currentUser,
                        role,
                        isAdmin: role === "admin"
                    });
                } catch (err) {
                    console.error("Error fetching user role:", err);
                    // Fallback to basic user if error
                    setUser({ ...currentUser, role: "user", isAdmin: false });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        const timer = setTimeout(() => {
            setLoading((prev) => {
                if (prev) console.warn("Auth state change timed out, forcing loading false");
                return false;
            });
        }, 5000);

        return () => {
            unsubscribe();
            clearTimeout(timer);
        };
    }, []);

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            router.push("/");
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed. Please check your console/network.");
        }
    };

    const logout = async () => {
        await signOut(auth);
        router.push("/login");
    };

    const contextValue = { user, loading, signInWithGoogle, logout };

    return (
        <AuthContext.Provider value={contextValue} >
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
