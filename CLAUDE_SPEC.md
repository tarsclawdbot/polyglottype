# PolyglotType — Build Instructions

Build a complete Next.js 14 app from scratch. Use App Router, TypeScript, Tailwind CSS, and Framer Motion. No backend. Everything stores in localStorage.

## Project Init
```bash
cd /home/aravhawk/.openclaw/workspace/projects/polyglottype
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --use-pnpm
pnpm add framer-motion
```

## Files to Create

### app/layout.tsx
```tsx
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrains = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PolyglotType — Type Code Faster",
  description: "Typing speed test for developers in multiple programming languages",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={jetbrains.className}>{children}</body>
    </html>
  );
}
```

### app/globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background: #0a0a0a;
  color: #ccc;
}

* {
  box-sizing: border-box;
}
```

### app/page.tsx
```tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LANGUAGES = {
  code: ["Python", "JavaScript", "TypeScript", "Rust", "Go", "SQL", "Bash"],
  natural: ["English", "Spanish", "French"],
} as const;

const SNIPPETS: Record<string, string[]> = {
  Python: [
    `def fibonacci(n):
    a, b = 0, 1
    while a < n:
        print(a, end=' ')
        a, b = b, a + b`,
    `for i in range(10):
    if i % 2 == 0:
        print(f"{i} is even")`,
    `try:
    with open("file.txt") as f:
        content = f.read()
except FileNotFoundError:
    print("File not found")`,
    `class Stack:
    def __init__(self):
        self.items = []
    def push(self, item):
        self.items.append(item)
    def pop(self):
        return self.items.pop()`,
    `from collections import Counter
words = text.lower().split()
print(Counter(words).most_common(5))`,
  ],
  JavaScript: [
    `const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};`,
    `async function fetchData(url) {
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}`,
    `const deepClone = obj => JSON.parse(JSON.stringify(obj));`,
    `const groupBy = (arr, key) =>
  arr.reduce((acc, item) => {
    (acc[item[key]] = acc[item[key]] || []).push(item);
    return acc;
  }, {});`,
    `const memoize = fn => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    return cache.has(key) ? cache.get(key) : cache.set(key, fn(...args)) && cache.get(key);
  };
};`,
  ],
  TypeScript: [
    `type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};`,
    `interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: Omit<T, 'id'>): Promise<T>;
}`,
    `function pipe<T>(...fns: Array<(arg: T) => T>) {
  return (value: T): T => fns.reduce((acc, fn) => fn(acc), value);
}`,
    `type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;`,
    `const exhaustiveCheck = (x: never): never => {
  throw new Error('Unhandled: ' + x);
};`,
  ],
  Rust: [
    `fn fibonacci(n: u64) -> u64 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}`,
    `let mut scores = std::collections::HashMap::new();
scores.insert("Alice".to_string(), 100);
scores.entry("Bob").or_insert(50);`,
    `fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0];
    for item in list {
        if item > largest { largest = item; }
    }
    largest
}`,
    `struct Stack<T> { elements: Vec<T> }
impl<T> Stack<T> {
    fn push(&mut self, item: T) { self.elements.push(item); }
    fn pop(&mut self) -> Option<T> { self.elements.pop(); }
}`,
    `use std::fs;
fn read_file(path: &str) -> Result<String, std::io::Error> {
    fs::read_to_string(path)
}`,
  ],
  Go: [
    `func fibonacci(n int) int {
	if n <= 1 { return n }
	return fibonacci(n-1) + fibonacci(n-2)
}`,
    `ch := make(chan int, 5)
go func() {
	for i := 0; i < 5; i++ { ch <- i }
	close(ch)
}()
for v := range ch { fmt.Println(v) }`,
    `type Animal interface { Sound() string }
type Dog struct{}
func (d Dog) Sound() string { return "Woof" }`,
    `defer func() {
	if r := recover(); r != nil {
		log.Printf("Recovered: %v", r)
	}
}()`,
    `var wg sync.WaitGroup
for i := 0; i < 5; i++ {
	wg.Add(1)
	go func(n int) { defer wg.Done(); fmt.Println(n) }(i)
}
wg.Wait()`,
  ],
  SQL: [
    `SELECT u.name, COUNT(o.id) as orders
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.name
HAVING COUNT(o.id) > 5`,
    `WITH ranked AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) as rank
  FROM employees
)
SELECT * FROM ranked WHERE rank = 1;`,
    `CREATE INDEX CONCURRENTLY idx_users_email
ON users (email) WHERE deleted_at IS NULL;`,
    `INSERT INTO products (name, price)
VALUES ('Widget', 9.99)
ON CONFLICT (name)
DO UPDATE SET price = EXCLUDED.price;`,
    `EXPLAIN ANALYZE SELECT p.title, COUNT(c.id)
FROM posts p JOIN comments c ON c.post_id = p.id
GROUP BY p.title ORDER BY COUNT(c.id) DESC;`,
  ],
  Bash: [
    `for file in *.log; do
  if [ -f "$file" ]; then
    gzip "$file"
  fi
done`,
    `backup_dir="/backup/$(date +%Y-%m-%d)"
mkdir -p "$backup_dir"
rsync -avz /home/user/ "$backup_dir/"`,
    `find . -name "*.py" -type f | while read f; do
  lines=$(wc -l < "$f")
  [ "$lines" -gt 200 ] && echo "$f: $lines"
done`,
    `#!/bin/bash
URL="$1"
for i in {1..5}; do
  if curl -sf "$URL" > /dev/null; then echo "UP"; exit 0; fi
  sleep 5
done
echo "DOWN"; exit 1`,
    `export PATH="$HOME/.local/bin:$PATH"
alias ll='ls -lah'
alias gs='git status'`,
  ],
  English: [
    `The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.`,
    `To be or not to be, that is the question. Whether tis nobler in the mind to suffer.`,
    `The best way to predict the future is to invent it. Any sufficient technology is magic.`,
    `In the beginning was the Word. The Word was with God. The Word was God.`,
    `It was the best of times, it was the worst of times. It was the age of wisdom, foolishness.`,
  ],
  Spanish: [
    `El veloz murciélago hindú comía feliz cardillo y kiwi. La cigüeña tocaba el saxofón.`,
    `En un lugar de la Mancha, de cuyo nombre no quiero acordarme, vivía un hidalgo.`,
    `La vida es sueño, y los sueños sueños son. No hay mal que por bien no venga.`,
    `Ser o no ser, esa es la cuestión. Si vale más sufrir los golpes de la fortuna.`,
    `El amor es un fuego que arde sin verse. Una llaga que duele y no se siente.`,
  ],
  French: [
    `Portez ce vieux whisky au juge blond qui fume. Le coeur a ses raisons.`,
    `Je pense, donc je suis. L'enfer, c'est les autres. La vie est courte.`,
    `Il faut cultiver notre jardin. Tout est pour le mieux dans le meilleur des mondes.`,
    `La liberté, c'est la liberté de dire que deux plus deux font quatre.`,
    `Rien n'est plus dangereux qu'une idée quand on n'a qu'une idée.`,
  ],
};

function getRandomSnippet(lang: string): string {
  const list = SNIPPETS[lang] || SNIPPETS["English"];
  return list[Math.floor(Math.random() * list.length)];
}

export default function Home() {
  const [mode, setMode] = useState<"code" | "natural">("code");
  const [language, setLanguage] = useState(LANGUAGES.code[0]);
  const [snippet, setSnippet] = useState(() => getRandomSnippet(LANGUAGES.code[0]));
  const [typed, setTyped] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const wpm = isActive || isComplete
    ? Math.round((typed.length / 5) / ((60 - timeLeft) / 60) || 0)
    : 0;
  const accuracy = typed.length > 0
    ? Math.round(((typed.length - errors) / typed.length) * 100)
    : 100;

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (isComplete || timeLeft === 0) return;
    
    if (!isActive) {
      setIsActive(true);
      setStartTime(Date.now());
    }

    if (e.key === "Tab") {
      e.preventDefault();
      restart();
      return;
    }

    if (e.key === "Backspace") {
      setTyped(t => t.slice(0, -1));
      return;
    }

    if (e.key.length === 1) {
      const expectedChar = snippet[typed.length];
      if (e.key !== expectedChar) {
        setErrors(c => c + 1);
      }
      setTyped(t => t + e.key);
      
      if (typed.length + 1 >= snippet.length) {
        setIsComplete(true);
        setShowResults(true);
      }
    }
  }, [isActive, isComplete, timeLeft, snippet, typed.length]);

  const restart = () => {
    setTyped("");
    setIsActive(false);
    setIsComplete(false);
    setTimeLeft(60);
    setStartTime(null);
    setErrors(0);
    setShowResults(false);
    setSnippet(getRandomSnippet(language));
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (!isActive || isComplete) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setIsComplete(true);
          setShowResults(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isActive, isComplete]);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    setSnippet(getRandomSnippet(lang));
    restart();
  };

  const changeMode = (newMode: "code" | "natural") => {
    setMode(newMode);
    changeLanguage(LANGUAGES[newMode][0]);
  };

  return (
    <main 
      className="min-h-screen flex flex-col items-center p-8"
      onClick={() => inputRef.current?.focus()}
    >
      <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        PolyglotType
      </h1>
      <p className="text-gray-500 mb-8">Type code. Type fast.</p>

      <div className="flex gap-2 mb-6">
        {(["code", "natural"] as const).map(m => (
          <button
            key={m}
            onClick={() => changeMode(m)}
            className={`px-4 py-2 rounded-full text-sm transition ${
              mode === m 
                ? "bg-purple-600 text-white" 
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {LANGUAGES[mode].map(lang => (
          <button
            key={lang}
            onClick={() => changeLanguage(lang)}
            className={`px-3 py-1 rounded text-sm transition ${
              language === lang
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      <div className="flex gap-8 mb-6 text-xl font-mono">
        <div className="text-center">
          <div className="text-3xl font-bold text-white">{timeLeft}</div>
          <div className="text-gray-500 text-xs">seconds</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-[#00ff88]">{wpm}</div>
          <div className="text-gray-500 text-xs">wpm</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-400">{accuracy}%</div>
          <div className="text-gray-500 text-xs">accuracy</div>
        </div>
      </div>

      <div className="w-full max-w-3xl bg-[#111] rounded-xl p-6 mb-6 font-mono text-lg leading-relaxed tracking-wide">
        {snippet.split("").map((char, i) => {
          let color = "#555";
          if (i < typed.length) {
            color = typed[i] === char ? "#00ff88" : "#ff4444";
          } else if (i === typed.length) {
            color = "#fff";
          }
          return (
            <span key={i} style={{ 
              color, 
              backgroundColor: i === typed.length ? "rgba(255,255,255,0.2)" : i < typed.length && typed[i] !== char ? "rgba(255,68,68,0.2)" : "transparent"
            }}>
              {char === "\n" ? <br /> : char}
            </span>
          );
        })}
      </div>

      <textarea
        ref={inputRef}
        className="opacity-0 absolute -z10"
        autoFocus
        onKeyDown={handleKeyDown}
        value=""
        onChange={() => {}}
      />

      <p className="text-gray-600 text-sm">Press Tab to restart</p>

      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
          >
            <div className="bg-[#111] rounded-2xl p-8 max-w-md w-full text-center">
              <h2 className="text-2xl font-bold text-white mb-6">Results</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#0a0a0a] rounded-xl p-4">
                  <div className="text-4xl font-bold text-[#00ff88]">{wpm}</div>
                  <div className="text-gray-500 text-sm">WPM</div>
                </div>
                <div className="bg-[#0a0a0a] rounded-xl p-4">
                  <div className="text-4xl font-bold text-purple-400">{accuracy}%</div>
                  <div className="text-gray-500 text-sm">Accuracy</div>
                </div>
                <div className="bg-[#0a0a0a] rounded-xl p-4">
                  <div className="text-2xl font-bold text-white">{errors}</div>
                  <div className="text-gray-500 text-sm">Errors</div>
                </div>
                <div className="bg-[#0a0a0a] rounded-xl p-4">
                  <div className="text-2xl font-bold text-white">{language}</div>
                  <div className="text-gray-500 text-sm">Language</div>
                </div>
              </div>
              <button
                onClick={restart}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
```

### tailwind.config.ts
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
```

## Build Commands
```bash
pnpm install
pnpm run build
```

## Deploy to Vercel
```bash
pnpm exec vercel --prod --yes
```

This is the complete app. Build it and deploy.
