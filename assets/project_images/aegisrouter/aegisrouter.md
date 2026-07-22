Aegis Router — A high-performance Go reverse proxy that intelligently routes AI inference requests across multiple upstream providers to maximize cost efficiency and reliability. It features a Redis-backed context cache that detects when conversation history is already cached, allowing requests to be routed to a zero-prefill-cost provider instead of paying full token rates. On cache misses or upstream failures, requests automatically fall back to alternative providers. The proxy enforces per-request budgets, detects token loops in real-time via SSE stream inspection, and logs every request for billing and analytics. Built with Go's httputil.ReverseProxy, it exposes a standard OpenAI-compatible API endpoint so downstream AI agents and IDEs can integrate with zero code changes.


Key highlights you could call out as bullet points:
- Dynamic multi-provider routing — Routes between NeuralWatt (cached), OpenRouter, and DeepSeek based on cache state and availability
- Redis-backed Context Cache Shield — Hashes conversation context to detect cache hits, eliminating expensive prefill costs
- Real-time circuit breaker — SSE stream sniffer that detects token loops and enforces per-request token budgets
- OpenAI-compatible API — Drop-in replacement for any OpenAI SDK or agent framework
- Full billing layer — PAYG credits, Stripe subscriptions, exact microdollar accounting with Supabase