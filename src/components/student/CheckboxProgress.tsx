"use client";

import React, { useTransition, useState } from "react";
import { updateLessonProgressFlags, type ProgressFlags } from "@/lib/actions/progress";

interface Props {
  lessonId: string;
  studentId: string;
  initial: ProgressFlags;
}

const items: { key: keyof ProgressFlags; label: string; weight: number }[] = [
  { key: "video_done", label: "Watch Video", weight: 15 },
  { key: "slides_done", label: "Review Slides", weight: 15 },
  { key: "listen_repeat_done", label: "Listen & Repeat", weight: 15 },
  { key: "exercises_done", label: "Complete Exercises", weight: 15 },
  { key: "live_class_done", label: "Attend Live Class", weight: 15 },
  { key: "task_done", label: "Complete Task", weight: 15 },
  { key: "mission_submitted", label: "Submit Mission", weight: 10 },
];

export default function CheckboxProgress({ lessonId, studentId, initial }: Props) {
  const [flags, setFlags] = useState<ProgressFlags>(initial);
  const [isPending, startTransition] = useTransition();

  function toggle(key: keyof ProgressFlags) {
    const next = { ...flags, [key]: !flags[key] };
    setFlags(next);
    startTransition(async () => {
      await updateLessonProgressFlags(studentId, lessonId, { [key]: next[key] });
    });
  }

  let pct = 0;
  for (const item of items) {
    if (flags[item.key]) pct += item.weight;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 700,
            fontSize: 16,
            color: "#F0F6FF",
          }}
        >
          Lesson Progress
        </span>
        <span
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 600,
            fontSize: 14,
            color: "#00D4FF",
          }}
        >
          {pct}%
        </span>
      </div>

      <div
        style={{
          width: "100%",
          height: 8,
          backgroundColor: "#1a2436",
          borderRadius: 4,
          overflow: "hidden",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            backgroundColor: pct >= 100 ? "#22c55e" : pct > 50 ? "#f59e0b" : "#ef4444",
            borderRadius: 4,
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {items.map((item) => (
        <label
          key={item.key}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: isPending ? "wait" : "pointer",
            opacity: isPending ? 0.7 : 1,
            padding: "8px 12px",
            borderRadius: 12,
            background: flags[item.key]
              ? "rgba(34,197,94,0.08)"
              : "rgba(255,255,255,0.02)",
            border: "1px solid",
            borderColor: flags[item.key]
              ? "rgba(34,197,94,0.2)"
              : "rgba(255,255,255,0.06)",
            transition: "all 0.2s ease",
          }}
        >
          <input
            type="checkbox"
            checked={flags[item.key]}
            onChange={() => toggle(item.key)}
            disabled={isPending}
            style={{
              width: 18,
              height: 18,
              accentColor: "#22c55e",
              cursor: "inherit",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 14,
              color: flags[item.key] ? "#22c55e" : "#8BA0BF",
              fontWeight: flags[item.key] ? 600 : 400,
            }}
          >
            {item.label}
          </span>
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--font-dm-sans)",
              fontSize: 12,
              color: "#4A6080",
            }}
          >
            {item.weight}%
          </span>
        </label>
      ))}
    </div>
  );
}
