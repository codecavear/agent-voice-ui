import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  
  if (!body.message) {
    throw createError({ statusCode: 400, message: 'No message provided' })
  }
  
  const webhookUrl = config.webhookUrl
  
  if (!webhookUrl) {
    // No webhook configured - return helpful message
    return { 
      response: `Webhook not configured. Set WEBHOOK_URL environment variable to connect your AI backend.`
    }
  }
  
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    
    // Add auth token if configured
    if (config.webhookAuthToken) {
      headers['Authorization'] = `Bearer ${config.webhookAuthToken}`
    }
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        message: body.message,
        timestamp: new Date().toISOString()
      })
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Webhook error:', errorText)
      return { 
        response: `Error connecting to backend. Status: ${response.status}`
      }
    }
    
    const result = await response.json()
    
    // Support multiple response formats
    const responseText = result.response || result.message || result.text || result.reply || JSON.stringify(result)
    
    return { response: responseText }
  } catch (e: any) {
    console.error('Webhook fetch error:', e.message)
    return { 
      response: `Could not reach backend: ${e.message}`
    }
  }
})
