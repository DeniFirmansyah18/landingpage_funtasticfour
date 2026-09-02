"use client";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login gagal";
      const friendly =
        msg.includes("invalid-credential") || msg.includes("wrong-password")
          ? "Email atau password salah."
          : msg.includes("too-many-requests")
          ? "Terlalu banyak percobaan. Coba lagi nanti."
          : "Terjadi kesalahan. Coba lagi.";
      setError(friendly);
      throw err;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return { user, loading, error, signIn, signOut };
}
