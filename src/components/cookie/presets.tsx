"use client";

import { Card } from "@/components/ui/card";
import { COOKIE_PRESETS, type CookiePreset } from "@/data/presets";

export function Presets({
  onSelect,
}: {
  onSelect: (preset: CookiePreset) => void;
}) {
  return (
    <Card title="Presets">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {COOKIE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset)}
            className="flex flex-col gap-1 rounded-md border border-zinc-200 p-3 text-left text-sm hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
          >
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {preset.name}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {preset.description}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}
