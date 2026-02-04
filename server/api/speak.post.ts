import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  
  if (!body.text) {
    throw createError({ statusCode: 400, message: 'No text provided' })
  }
  
  // ElevenLabs TTS
  const voiceId = 'pNInz6obpgDQGcFmaJgB' // Adam voice (default)
  
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': config.elevenLabsApiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: body.text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75
      }
    })
  })
  
  if (!response.ok) {
    const err = await response.text()
    throw createError({ statusCode: 500, message: `ElevenLabs error: ${err}` })
  }
  
  // Return audio as base64 data URL
  const audioBuffer = await response.arrayBuffer()
  const base64 = Buffer.from(audioBuffer).toString('base64')
  const audioUrl = `data:audio/mpeg;base64,${base64}`
  
  return { audioUrl }
})
