# Agent Voice UI

Voice chat interface for AI agents. Hold-to-talk UI with speech-to-text and text-to-speech.

## Stack

- **Frontend:** Nuxt 3 + Nuxt UI
- **STT:** OpenAI Whisper API (swappable for local whisper.cpp)
- **TTS:** ElevenLabs API
- **Backend:** Nitro API routes

## Architecture

```
Browser (mic) → /api/transcribe (Whisper) → /api/chat (AI) → /api/speak (ElevenLabs) → Audio
```

## Setup

```bash
# Install
bun install

# Configure
cp .env.example .env
# Add your API keys

# Run
bun run dev
```

## Environment Variables

```env
ELEVENLABS_API_KEY=sk_...
OPENAI_API_KEY=sk-...
OPENCLAW_WEBHOOK=http://localhost:18789/api/webhook
```

## API Endpoints

- `POST /api/transcribe` - Audio → Text (Whisper)
- `POST /api/chat` - Text → Response (AI webhook)
- `POST /api/speak` - Text → Audio (ElevenLabs)

## Features

- 🎤 Hold-to-talk interface
- 🌙 Dark mode
- 🌐 Multilingual (Spanish default)
- ⚡ Real-time processing

## Roadmap

- [ ] Local Whisper (whisper.cpp) for privacy
- [ ] Voice cloning
- [ ] Conversation history
- [ ] WebSocket streaming

## License

MIT
