# PolyglotType — SPEC.md

## Overview
A typing speed test app for developers. Practice typing in programming languages (Python, JS, TS, Rust, Go, SQL, Bash) and natural languages (English, Spanish, French). Track WPM and accuracy per language. Monkeytype-style UX but code-focused.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- localStorage (no backend)
- Deployed to Vercel

## Core Features
1. Language selector tabs (code vs natural language)
2. Typing test area with character-by-character highlighting
3. Live WPM/accuracy counter
4. Results modal with personal best comparison
5. Dark terminal aesthetic
6. 60-second timed mode

## Design Tokens
- Background: #0a0a0a
- Correct: #00ff88
- Wrong: #ff4444
- Cursor: white block
- Untyped: #555
- Font: JetBrains Mono (Google Fonts)
- Accent: #7c3aed (purple)
