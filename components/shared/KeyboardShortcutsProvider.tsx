"use client";

import { useState, useCallback } from "react";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

export function KeyboardShortcutsProvider() {
  const [commandOpen, setCommandOpen] = useState(false);

  const toggleCommand = useCallback(() => {
    setCommandOpen((prev) => !prev);
  }, []);

  useKeyboardShortcuts(toggleCommand);

  return (
    <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
  );
}
