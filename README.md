# Emergency Guidance Assistant

A transparent emergency-guidance chatbot that runs **entirely in your browser** —
no server, no API keys, no data leaving your device. It answers emergency
questions by quoting **approved guidance documents word-for-word**, with numbered
citations, confidence, and a visible reasoning trace.

## How to run

**Option 1 — simplest:** double-click `web/index.html`. It works fully offline.

**Option 2 — local server (nicer URLs):** right-click `serve.ps1` → *Run with
PowerShell*, then open http://localhost:8123/web/

**Tests:** open `tests/tests.html` in any browser — 45 automated checks
(retrieval correctness, verbatim-only answers, safety behavior, privacy).

## What's inside

| Folder | Contents |
|---|---|
| `web/` | The chat interface (`index.html`, `styles.css`, `ui.js`) |
| `core/` | The engine: BM25 retriever, agent loop, safety gates, composer, privacy layer |
| `data/guidance/` | 37 approved documents (83 sections) — first aid, hazards, India emergency numbers |
| `tests/` | In-browser test suite (45 checks) |
| `serve.ps1` | Zero-dependency PowerShell static server |

## Safety & privacy by design

- **Zero network calls** after the page loads — verifiable in DevTools → Network
- **Zero storage** — no cookies, no localStorage; the chat lives in tab memory only
- **Emergency-first ordering** — detected emergencies show "call 112 / 100 / 101 / 108 now" before any guidance
- **Crisis pinning** — self-harm wording routes to human crisis lines (Tele-MANAS 14416, KIRAN, 988)
- **Abstention** — below the relevance threshold the bot refuses instead of guessing
- **Verbatim answers** — every guidance line is quoted from a reviewed document with its review date

Understands English and common Hinglish phrasings (e.g. "aag lagi hai", "saanp ne kaata").

> **Disclaimer:** demo system for studying RAG, agent reasoning, and AI safety
> controls. Not a medical device and not a substitute for professional
> emergency response — in a real emergency, call your local emergency number.
