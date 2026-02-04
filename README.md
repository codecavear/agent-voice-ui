# Agent Voice UI

Generic voice chat interface for AI agents. Connect any AI backend via webhook.

## Features

- 🎤 Hold-to-talk interface
- 🗣️ Speech-to-text (OpenAI Whisper)
- 🔊 Text-to-speech (ElevenLabs)
- 🌐 Multilingual support
- 🎨 Customizable branding
- 🌙 Dark mode
- 📱 Mobile-friendly

## Quick Start

```bash
# Clone
git clone https://github.com/codecavear/agent-voice-ui
cd agent-voice-ui

# Install
bun install  # or npm install

# Configure
cp .env.example .env
# Edit .env with your API keys

# Run
bun run dev
```

## Configuration

All configuration via environment variables:

### Required

| Variable | Description |
|----------|-------------|
| `ELEVENLABS_API_KEY` | ElevenLabs API key for TTS |
| `OPENAI_API_KEY` | OpenAI API key for Whisper STT |
| `WEBHOOK_URL` | Your AI backend endpoint |

### Optional

| Variable | Default | Description |
|----------|---------|-------------|
| `WEBHOOK_AUTH_TOKEN` | - | Bearer token for webhook auth |
| `ELEVENLABS_VOICE_ID` | `pNInz6obpgDQGcFmaJgB` | Voice ID (Adam) |
| `WHISPER_LANGUAGE` | `es` | Language code for STT |
| `APP_NAME` | `Voice Assistant` | Display name |
| `APP_DESCRIPTION` | `AI Voice Chat` | Subtitle |
| `PRIMARY_COLOR` | `emerald` | Tailwind color |

## Webhook Format

Your backend receives:
```json
POST /your-endpoint
{
  "message": "transcribed user speech",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Expected response (any of these fields):
```json
{
  "response": "AI response text"
  // or "message", "text", "reply"
}
```

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│   Whisper   │────▶│  Your AI    │
│  (Record)   │     │   (STT)     │     │  Backend    │
└─────────────┘     └─────────────┘     └─────────────┘
       ▲                                       │
       │            ┌─────────────┐            │
       └────────────│ ElevenLabs  │◀───────────┘
                    │   (TTS)     │
                    └─────────────┘
```

## Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/agent-voice-ui)

1. Click deploy button
2. Add environment variables
3. Connect your domain

## Voices

Find voice IDs at [ElevenLabs Voice Library](https://elevenlabs.io/voice-library)

Popular voices:
- `pNInz6obpgDQGcFmaJgB` - Adam (default)
- `EXAVITQu4vr4xnSDxMaL` - Bella
- `ErXwobaYiN019PkySvjV` - Antoni
- `MF3mGyEYCl7XYWbV9V6O` - Elli

## License

MIT - [codeCave](https://codecave.ar)
