"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface ShortcutMap {
  [key: string]: () => void;
}

export function useKeyboardShortcuts(
  onToggleCommandPalette?: () => void,
) {
  const router = useRouter();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Skip if user is typing in an input/textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        // Allow Escape always
        if (e.key !== "Escape") return;
      }

      const ctrl = e.ctrlKey || e.metaKey;

      // Ctrl+K → Command Palette
      if (ctrl && e.key === "k") {
        e.preventDefault();
        onToggleCommandPalette?.();
        return;
      }

      // Ctrl+D → Dashboard
      if (ctrl && e.key === "d") {
        e.preventDefault();
        router.push("/");
        return;
      }

      // Ctrl+L → LeetCode
      if (ctrl && e.key === "l") {
        e.preventDefault();
        router.push("/leetcode");
        return;
      }

      // "/" → Focus search (if command palette available)
      if (e.key === "/" && !ctrl) {
        e.preventDefault();
        onToggleCommandPalette?.();
        return;
      }
    },
    [router, onToggleCommandPalette]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
