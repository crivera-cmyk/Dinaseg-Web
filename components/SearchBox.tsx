"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBox({
  initialQuery = "",
  compact = false,
}: {
  initialQuery?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/buscar?q=${encodeURIComponent(query)}` : "/buscar");
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar producto, marca o SKU..."
        className={`min-w-0 flex-1 rounded-md border border-zinc-300 px-3 text-sm focus:border-dinaseg-red focus:outline-none ${compact ? "py-1.5" : "py-2"}`}
      />
      <button
        type="submit"
        className={`shrink-0 rounded-md bg-dinaseg-red font-semibold text-white hover:bg-dinaseg-red-dark ${compact ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm"}`}
      >
        🔍
      </button>
    </form>
  );
}
