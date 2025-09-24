import axios from 'axios';

import { env } from '../config/env';
import { requestTts } from './chatterboxService';

interface PipelineParams {
  audioBase64: string;
  prompt: string;
  voiceProfileId: string;
  organisationId: string;
  emotion: Record<string, number>;
}

export async function runVoicePipeline({ audioBase64, prompt, voiceProfileId, organisationId, emotion }: PipelineParams) {
  const transcription = await transcribeAudio(audioBase64);
  const response = await callGpt(prompt, transcription.transcript, organisationId);
  const audio = await requestTts({ text: response.reply, voiceProfileId, emotion, speakingRate: response.meta.speakingRate });

  return {
    transcript: transcription.transcript,
    llm: response,
    audio
  };
}

async function transcribeAudio(audioBase64: string) {
  const response = await axios.post(
    'https://speech.googleapis.com/v1/speech:recognize',
    {
      config: { enableAutomaticPunctuation: true, languageCode: 'en-US' },
      audio: { content: audioBase64 }
    },
    {
      headers: { Authorization: `Bearer ${env.googleSpeechApiKey}` }
    }
  );

  const alternatives = response.data.results?.[0]?.alternatives ?? [];
  return {
    transcript: alternatives[0]?.transcript ?? '',
    confidence: alternatives[0]?.confidence ?? 0
  };
}

async function callGpt(prompt: string, transcript: string, organisationId: string) {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: transcript }
      ],
      temperature: 0.8
    },
    {
      headers: { Authorization: `Bearer ${env.openAiApiKey}` }
    }
  );

  const message = response.data.choices?.[0]?.message?.content ?? '';
  return {
    reply: message,
    meta: {
      speakingRate: 1,
      tokens: response.data.usage?.total_tokens,
      organisationId
    }
  };
}
