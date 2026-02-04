<script setup lang="ts">
const isRecording = ref(false)
const isProcessing = ref(false)
const isPlaying = ref(false)
const transcript = ref('')
const response = ref('')
const error = ref('')

let mediaRecorder: MediaRecorder | null = null
let audioChunks: Blob[] = []

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
    audioChunks = []
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunks.push(e.data)
    }
    
    mediaRecorder.onstop = async () => {
      stream.getTracks().forEach(t => t.stop())
      await processAudio()
    }
    
    mediaRecorder.start()
    isRecording.value = true
    error.value = ''
  } catch (e: any) {
    error.value = 'Microphone access denied'
  }
}

function stopRecording() {
  if (mediaRecorder && isRecording.value) {
    mediaRecorder.stop()
    isRecording.value = false
  }
}

async function processAudio() {
  isProcessing.value = true
  try {
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
    
    // 1. Transcribe with Whisper
    const formData = new FormData()
    formData.append('audio', audioBlob, 'recording.webm')
    
    const transcribeRes = await $fetch('/api/transcribe', {
      method: 'POST',
      body: formData
    })
    transcript.value = transcribeRes.text
    
    // 2. Get response from Docta (OpenClaw)
    const chatRes = await $fetch('/api/chat', {
      method: 'POST',
      body: { message: transcript.value }
    })
    response.value = chatRes.response
    
    // 3. Speak response with ElevenLabs
    isPlaying.value = true
    const audioRes = await $fetch('/api/speak', {
      method: 'POST',
      body: { text: response.value }
    })
    
    // Play audio
    const audio = new Audio(audioRes.audioUrl)
    audio.onended = () => { isPlaying.value = false }
    await audio.play()
    
  } catch (e: any) {
    error.value = e.message || 'Something went wrong'
  } finally {
    isProcessing.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-4xl font-bold text-primary-400">Docta</h1>
        <p class="text-gray-400 mt-2">Voice Assistant</p>
      </div>
      
      <!-- Voice Button -->
      <div class="flex justify-center">
        <button
          @mousedown="startRecording"
          @mouseup="stopRecording"
          @mouseleave="stopRecording"
          @touchstart.prevent="startRecording"
          @touchend.prevent="stopRecording"
          :disabled="isProcessing || isPlaying"
          class="relative w-32 h-32 rounded-full transition-all duration-300"
          :class="{
            'bg-red-500 scale-110 animate-pulse': isRecording,
            'bg-primary-500 hover:bg-primary-400': !isRecording && !isProcessing,
            'bg-gray-600 cursor-wait': isProcessing || isPlaying
          }"
        >
          <UIcon 
            :name="isRecording ? 'i-lucide-mic' : isProcessing ? 'i-lucide-loader-2' : isPlaying ? 'i-lucide-volume-2' : 'i-lucide-mic'"
            class="w-12 h-12 text-white"
            :class="{ 'animate-spin': isProcessing }"
          />
        </button>
      </div>
      
      <p class="text-center text-gray-500 text-sm">
        {{ isRecording ? 'Listening...' : isProcessing ? 'Processing...' : isPlaying ? 'Speaking...' : 'Hold to talk' }}
      </p>
      
      <!-- Transcript -->
      <div v-if="transcript" class="bg-gray-900 rounded-lg p-4">
        <p class="text-xs text-gray-500 mb-1">You said:</p>
        <p class="text-gray-300">{{ transcript }}</p>
      </div>
      
      <!-- Response -->
      <div v-if="response" class="bg-primary-900/30 rounded-lg p-4 border border-primary-500/30">
        <p class="text-xs text-primary-400 mb-1">Docta:</p>
        <p class="text-gray-200">{{ response }}</p>
      </div>
      
      <!-- Error -->
      <UAlert v-if="error" color="red" :title="error" />
    </div>
  </div>
</template>
