"use client";

// lib/compare.ts — Comparador 100% client-side (localStorage), exactamente
// como está diseñado en PLAN_WEB_PUBLICA.md ("Lista de SKUs en localStorage,
// reflejada en la URL ?comparar=sku1,sku2 para poder compartir el link. No
// necesita servidor ni login."). app/comparar/page.tsx sincroniza la URL.
import { useCallback, useSyncExternalStore } from "react";

const COMPARE_KEY = "dinaseg_compare_v1";
const EVENT = "dinaseg-compare-changed";
const MAX = 4; // más de 4 columnas no entra cómodo en una tabla comparativa.

function safeParse(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

function readCompare(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return safeParse(localStorage.getItem(COMPARE_KEY));
  } catch {
    return [];
  }
}

function writeCompare(skus: string[]) {
  try {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(skus));
  } catch {
    /* modo privado / site data bloqueado — no persiste, no rompe la página */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function getSnapshot() {
  if (typeof window === "undefined") return "[]";
  return localStorage.getItem(COMPARE_KEY) || "[]";
}

export function useCompare() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const skus = safeParse(snapshot);

  const toggle = useCallback((sku: string) => {
    const current = readCompare();
    const idx = current.indexOf(sku);
    if (idx >= 0) current.splice(idx, 1);
    else {
      if (current.length >= MAX) current.shift(); // saca el más viejo, no bloquea al usuario
      current.push(sku);
    }
    writeCompare(current);
  }, []);

  const setAll = useCallback((skus: string[]) => writeCompare(skus.slice(0, MAX)), []);
  const clear = useCallback(() => writeCompare([]), []);

  return { skus, toggle, setAll, clear, isSelected: (sku: string) => skus.includes(sku), max: MAX };
}
