import type { PronunciationScore } from '@/types';

let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];

export async function startRecording(): Promise<void> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'audio/webm;codecs=opus',
  });
  audioChunks = [];

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      audioChunks.push(event.data);
    }
  };

  mediaRecorder.start();
}

export function stopRecording(): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (!mediaRecorder) {
      reject(new Error('No recording in progress'));
      return;
    }

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      // Stop all tracks
      mediaRecorder?.stream.getTracks().forEach((track) => track.stop());
      mediaRecorder = null;
      resolve(audioBlob);
    };

    mediaRecorder.stop();
  });
}

export function playAudioBlob(blob: Blob): Promise<void> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.onended = () => {
      URL.revokeObjectURL(url);
      resolve();
    };
    audio.play();
  });
}

// Mock pronunciation scoring - in production, this would call a real API
export function mockPronounceScore(text: string): PronunciationScore {
  const base = 50 + Math.random() * 40;
  const accuracy = Math.round(base + Math.random() * 10);
  const fluency = Math.round(base + Math.random() * 15 - 5);
  const completeness = Math.round(base + Math.random() * 10);
  const stressPause = Math.round(base + Math.random() * 20 - 10);
  const overall = Math.round((accuracy + fluency + completeness + stressPause) / 4);

  const words = text.split(' ');
  const errorSpans: PronunciationScore['errorSpans'] = [];

  // Randomly flag 0-2 words as having issues
  const errorCount = Math.floor(Math.random() * 3);
  const issues = ['vowel', 'consonant', 'stress', 'final_sound'];
  const hints = ['/ɪ/ not /iː/', 'hold the final sound', 'stress on first syllable', '/θ/ not /s/'];

  for (let i = 0; i < errorCount; i++) {
    const wordIdx = Math.floor(Math.random() * words.length);
    const issueIdx = Math.floor(Math.random() * issues.length);
    errorSpans.push({
      token: words[wordIdx].toLowerCase().replace(/[^a-z]/g, ''),
      issue: issues[issueIdx],
      hint: hints[issueIdx],
    });
  }

  return { accuracy, fluency, completeness, stressPause, overall, errorSpans };
}

// Text-to-speech using Web Speech API
export function speak(text: string, rate: number = 1.0): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    // Chrome bug workaround: cancel any pending speech first
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;

    utterance.onend = () => resolve();
    utterance.onerror = () => reject(new Error('Speech synthesis error'));

    window.speechSynthesis.speak(utterance);
  });
}

// Pre-warm SpeechSynthesis engine to eliminate first-call delay
export function warmUpSpeech(): void {
  if (!window.speechSynthesis) return;
  // Load voices
  window.speechSynthesis.getVoices();
  // Silent utterance to initialize the engine
  const u = new SpeechSynthesisUtterance('');
  u.volume = 0;
  u.lang = 'en-US';
  window.speechSynthesis.speak(u);
}

export function isRecordingSupported(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;
}

// Audio feedback sounds using Web Audio API
let audioCtx: AudioContext | null = null;

async function getAudioContext(): Promise<AudioContext> {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  // Resume suspended context (browser autoplay policy)
  if (audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }
  return audioCtx;
}

export async function playCorrectSound(): Promise<void> {
  try {
    const ctx = await getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523, ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1); // E5
    osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2); // G5
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch {}
}

export async function playIncorrectSound(): Promise<void> {
  try {
    const ctx = await getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch {}
}

export async function playCompleteSound(): Promise<void> {
  try {
    const ctx = await getAudioContext();
    const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.3);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.3);
    });
  } catch {}
}
