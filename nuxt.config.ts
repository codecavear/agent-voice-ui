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
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    openclawWebhook: process.env.OPENCLAW_WEBHOOK || '',
    // Public (client)
    public: {
      appName: 'Docta'
    }
  }
})
