"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";

// ── Generic collection hook (real-time) ─────────────────────────────────────
export function useCollection<T extends { id?: string; order?: number; createdAt?: any }>(
  collectionName: string,
  orderField = "order"
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const colRef = collection(db, collectionName);
    const unsubscribe = onSnapshot(
      colRef,
      (snap) => {
        // ...d.data() MUST come before id: d.id so d.id is NEVER overwritten by a static payload id!
        const items = snap.docs.map((d) => ({ ...d.data(), id: d.id } as T));
        // Client-side sort guarantees no document is ever dropped due to missing or null order field
        items.sort((a, b) => {
          const ordA = typeof a.order === "number" ? a.order : 999;
          const ordB = typeof b.order === "number" ? b.order : 999;
          if (ordA !== ordB) return ordA - ordB;
          return (a.id || "").localeCompare(b.id || "");
        });
        setData(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.warn(`[Firestore] Read error on collection "${collectionName}":`, err.message);
        setError(err.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [collectionName, orderField]);

  return { data, loading, error };
}

// ── Generic document hook (real-time) ────────────────────────────────────────
export function useDocument<T>(path: string, docId: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ref = doc(db, path, docId);
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        setData(snap.exists() ? ({ ...snap.data(), id: snap.id } as T) : null);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.warn(`[Firestore] Read error on doc "${path}/${docId}":`, err.message);
        setError(err.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [path, docId]);

  return { data, loading, error };
}

// ── CRUD helpers ─────────────────────────────────────────────────────────────
export async function addItem(collectionName: string, data: DocumentData) {
  const { id: _ignoreId, ...cleanData } = data;
  const ref = await addDoc(collection(db, collectionName), {
    ...cleanData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateItem(
  collectionName: string,
  id: string,
  data: Partial<DocumentData>
) {
  const { id: _ignoreId, ...cleanData } = data;
  await setDoc(
    doc(db, collectionName, id),
    {
      ...cleanData,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function deleteItem(collectionName: string, id: string) {
  await deleteDoc(doc(db, collectionName, id));
}

export async function setDocument(
  path: string,
  docId: string,
  data: DocumentData
) {
  const { id: _ignoreId, ...cleanData } = data;
  await setDoc(doc(db, path, docId), {
    ...cleanData,
    updatedAt: serverTimestamp(),
  });
}

export async function getDocument<T>(path: string, docId: string): Promise<T | null> {
  const snap = await getDoc(doc(db, path, docId));
  return snap.exists() ? ({ ...snap.data(), id: snap.id } as T) : null;
}

export async function getCollection<T>(collectionName: string): Promise<T[]> {
  const snap = await getDocs(collection(db, collectionName));
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as T));
}

// ── Seed helper ──────────────────────────────────────────────────────────────
export async function seedCollection(
  collectionName: string,
  items: DocumentData[]
) {
  for (const item of items) {
    const { id: _ignoreId, ...cleanData } = item;
    await addDoc(collection(db, collectionName), {
      ...cleanData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

export async function seedDocument(
  path: string,
  docId: string,
  data: DocumentData
) {
  await setDoc(doc(db, path, docId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ── Count hook ────────────────────────────────────────────────────────────────
export function useCollectionCount(collectionName: string) {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snap) => {
        setCount(snap.size);
      },
      (err) => {
        console.warn(`[Firestore] Permission/Count error on "${collectionName}":`, err.message);
        setCount(0);
      }
    );
    return unsubscribe;
  }, [collectionName]);
  return count;
}
