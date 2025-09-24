import axios from 'axios';

import { env } from '../config/env';

interface GenerateSpeechParams {
  text: string;
  voiceProfileId: string;
  emotion: Record<string, number>;
  speakingRate?: number;
}

export async function requestTts({ text, voiceProfileId, emotion, speakingRate }: GenerateSpeechParams) {
  const response = await axios.post(
    `${env.chatterboxBaseUrl}/v1/generate`,
    {
      text,
      voice_profile_id: voiceProfileId,
      emotion,
      speaking_rate: speakingRate ?? 1
    },
    {
      responseType: 'arraybuffer'
    }
  );

  return response.data as ArrayBuffer;
}

export async function createVoiceClone(organisationId: string, fileBuffer: Buffer, metadata: Record<string, unknown>) {
  const response = await axios.post(
    `${env.chatterboxBaseUrl}/v1/clone`,
    {
      organisation_id: organisationId,
      metadata,
      audio_base64: fileBuffer.toString('base64')
    }
  );

  return response.data;
}
