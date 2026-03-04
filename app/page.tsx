"use client";

import { CSSProperties, useEffect, useMemo, useState } from "react";

type Snippet = { name: string; code: string };

const SNIPPETS: Snippet[] = [
  {
    name: "TypeScript",
    code: `type User = { id: string; email: string }\nconst greet = (u: User) => \`hi $\{u.email\}\`;`,
  },
  {
    name: "Python",
    code: `def fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a`,
  },
  {
    name: "Rust",
    code: `fn is_even(n: i32) -> bool {\n    n % 2 == 0\n}`,
  },
  {
    name: "Go",
    code: `func sum(nums []int) int {\n  total := 0\n  for _, n := range nums { total += n }\n  return total\n}`,
  },
  {
    name: "SQL",
    code: `SELECT user_id, COUNT(*) AS sessions\nFROM events\nWHERE created_at >= NOW() - INTERVAL '7 days'\nGROUP BY user_id;`,
  },
  {
    name: "Bash",
    code: `for file in *.log; do\n  echo \"archiving $file\"\n  gzip \"$file\"\ndone`,
  },
];

export default function Home() {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(0);

  const current = SNIPPETS[index];

  useEffect(() => {
    if (!startedAt) return;
    const t = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 200);
    return () => clearInterval(t);
  }, [startedAt]);

  const done = input.length >= current.code.length;

  const { correctChars, accuracy, wpm } = useMemo(() => {
    let correct = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === current.code[i]) correct++;
    }
    const elapsedMinutes = Math.max(seconds / 60, 1 / 60);
    const words = correct / 5;
    return {
      correctChars: correct,
      accuracy: input.length ? Math.round((correct / input.length) * 100) : 100,
      wpm: Math.round(words / elapsedMinutes),
    };
  }, [current.code, input, seconds]);

  function resetSnippet(nextIndex = index) {
    setIndex(nextIndex);
    setInput("");
    setStartedAt(null);
    setSeconds(0);
  }

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 36, marginBottom: 6, color: "#fff" }}>PolyglotType</h1>
      <p style={{ marginBottom: 20, color: "#a1a1aa" }}>
        Practice typing real code snippets across languages.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        {SNIPPETS.map((s, i) => (
          <button
            key={s.name}
            onClick={() => resetSnippet(i)}
            style={{
              border: "1px solid #3f3f46",
              background: i === index ? "#27272a" : "#18181b",
              color: "#fff",
              borderRadius: 999,
              padding: "8px 14px",
              cursor: "pointer",
            }}
          >
            {s.name}
          </button>
        ))}
      </div>

      <section
        style={{
          background: "#09090b",
          border: "1px solid #27272a",
          borderRadius: 14,
          padding: 16,
          marginBottom: 14,
          lineHeight: 1.65,
          whiteSpace: "pre-wrap",
          fontSize: 16,
        }}
      >
        {current.code.split("").map((ch, i) => {
          let color = "#a1a1aa";
          if (i < input.length) color = input[i] === ch ? "#4ade80" : "#f87171";
          return (
            <span key={i} style={{ color }}>
              {ch}
            </span>
          );
        })}
      </section>

      <textarea
        value={input}
        onChange={(e) => {
          if (!startedAt) setStartedAt(Date.now());
          setInput(e.target.value);
        }}
        spellCheck={false}
        placeholder="Type the snippet exactly…"
        style={{
          width: "100%",
          minHeight: 170,
          background: "#0a0a0a",
          color: "#e4e4e7",
          border: "1px solid #3f3f46",
          borderRadius: 12,
          padding: 12,
          outline: "none",
          fontSize: 15,
        }}
      />

      <div style={{ display: "flex", gap: 18, marginTop: 14, flexWrap: "wrap" }}>
        <Stat label="Time" value={`${seconds}s`} />
        <Stat label="WPM" value={String(wpm)} />
        <Stat label="Accuracy" value={`${accuracy}%`} />
        <Stat label="Correct" value={`${correctChars}/${current.code.length}`} />
      </div>

      <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
        <button onClick={() => resetSnippet()} style={btnStyle}>
          Reset
        </button>
        <button onClick={() => resetSnippet((index + 1) % SNIPPETS.length)} style={btnStyle}>
          Next snippet
        </button>
      </div>

      {done && (
        <p style={{ marginTop: 14, color: "#4ade80", fontWeight: 700 }}>
          Nice. Snippet completed.
        </p>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "#18181b",
        border: "1px solid #27272a",
        borderRadius: 10,
        padding: "10px 12px",
      }}
    >
      <div style={{ fontSize: 12, color: "#a1a1aa" }}>{label}</div>
      <div style={{ fontSize: 18, color: "#fff", fontWeight: 700 }}>{value}</div>
    </div>
  );
}

const btnStyle: CSSProperties = {
  border: "1px solid #3f3f46",
  background: "#27272a",
  color: "#fff",
  borderRadius: 10,
  padding: "8px 14px",
  cursor: "pointer",
};
