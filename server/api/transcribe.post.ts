import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  if (!config.openaiApiKey) {
    throw createError({ statusCode: 500, message: 'OpenAI API key not configured' })
  }
  
  // Get audio from form data
  const formData = await readMultipartFormData(event)
  const audioFile = formData?.find(f => f.name === 'audio')
  
  if (!audioFile) {
    throw createError({ statusCode: 400, message: 'No audio file provided' })
  }
  
  // Use OpenAI Whisper API
  const whisperFormData = new FormData()
  whisperFormData.append('file', new Blob([audioFile.data], { type: 'audio/webm' }), 'audio.webm')
  whisperFormData.append('model', 'whisper-1')
  
  // Language is configurable
  if (config.whisperLanguage) {
    whisperFormData.append('language', config.whisperLanguage)
  }
  
  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.openaiApiKey}`
    },
    body: whisperFormData
  })
  
  if (!response.ok) {
    const err = await response.text()
    console.error('Whisper error:', err)
    throw createError({ statusCode: 500, message: `Transcription error: ${response.status}` })
  }
  
  const result = await response.json()
  return { text: result.text }
})
