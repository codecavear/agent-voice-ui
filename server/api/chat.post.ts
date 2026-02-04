import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  
  if (!body.message) {
    throw createError({ statusCode: 400, message: 'No message provided' })
  }
  
  // Call OpenClaw gateway webhook
  // For now, simple echo - will connect to actual gateway
  const webhookUrl = config.openclawWebhook || 'http://localhost:18789/api/chat'
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: body.message,
        sessionKey: 'voice-chat'
      })
    })
    
    if (!response.ok) {
      // Fallback response if webhook not configured
      return { 
        response: `Recibí tu mensaje: "${body.message}". El webhook de OpenClaw no está configurado aún.`
      }
    }
    
    const result = await response.json()
    return { response: result.response || result.message || 'Sin respuesta' }
  } catch (e) {
    // Fallback for dev
    return { 
      response: `Hola! Escuché: "${body.message}". Estoy en modo desarrollo.`
    }
  }
})
