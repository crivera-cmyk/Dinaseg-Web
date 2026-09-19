"use client";

// lib/cart.ts — Carrito 100% client-side (localStorage), sin login ni
// servidor (ver PLAN_WEB_PUBLICA.md, sección "Comparador y cotización").
// Al enviar, /api/carrito/cotizar manda todo el carrito como UNA cotización
// (ver app/carrito/page.tsx) — no hay pago online todavía, solo cotización.
import { useCallback, useSyncExternalStore } from "react";

export type CartItem = { sku: string; nombre: string; familia: string; cantidad: number };

const CART_KEY = "dinaseg_cart_v1";
const EVENT = "dinaseg-cart-changed";

function safeParse(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return safeParse(localStorage.getItem(CART_KEY));
  } catch {
    // Puede fallar en modo privado/con site data bloqueado — el carrito
    // simplemente no persiste, no debe romper la página.
    return [];
  }
}

function writeCart(items: CartItem[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    /* ver comentario en readCart() */
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
  // String como snapshot (no el array) para que useSyncExternalStore pueda
  // comparar por valor sin devolver un objeto nuevo en cada llamada.
  if (typeof window === "undefined") return "[]";
  return localStorage.getItem(CART_KEY) || "[]";
}

export function useCart() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const items = safeParse(snapshot);

  const add = useCallback((item: Omit<CartItem, "cantidad">, cantidad = 1) => {
    const current = readCart();
    const idx = current.findIndex((i) => i.sku === item.sku);
    if (idx >= 0) current[idx] = { ...current[idx], cantidad: current[idx].cantidad + cantidad };
    else current.push({ ...item, cantidad });
    writeCart(current);
  }, []);

  const remove = useCallback((sku: string) => {
    writeCart(readCart().filter((i) => i.sku !== sku));
  }, []);

  const setCantidad = useCallback((sku: string, cantidad: number) => {
    const current = readCart();
    const idx = current.findIndex((i) => i.sku === sku);
    if (idx < 0) return;
    if (cantidad <= 0) current.splice(idx, 1);
    else current[idx] = { ...current[idx], cantidad };
    writeCart(current);
  }, []);

  const clear = useCallback(() => writeCart([]), []);

  const total = items.reduce((n, i) => n + i.cantidad, 0);

  return { items, add, remove, setCantidad, clear, total };
}
