export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'dark'
  },
  runtimeConfig: {
    // Server-side only
    elevenLabsApiKey: process.env.ELEVENLABS_API_KEY || '',
    elevenLabsVoiceId: process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB', // Default: Adam
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    webhookUrl: process.env.WEBHOOK_URL || '',
    webhookAuthToken: process.env.WEBHOOK_AUTH_TOKEN || '',
    whisperLanguage: process.env.WHISPER_LANGUAGE || 'es',
    // Public (client)
    public: {
      appName: process.env.APP_NAME || 'Voice Assistant',
      appDescription: process.env.APP_DESCRIPTION || 'AI Voice Chat',
      primaryColor: process.env.PRIMARY_COLOR || 'emerald'
    }
  }
})
