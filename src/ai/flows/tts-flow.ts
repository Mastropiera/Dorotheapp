
'use server';
/**
 * @fileOverview A Text-to-Speech (TTS) flow using Genkit.
 *
 * - textToSpeech - A function that converts a string of text into playable audio.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import wav from 'wav';

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: z.string(),
    outputSchema: z.string(), // Output will be a data URI string for the audio
  },
  async (text) => {
    // Return early if the input text is empty to avoid API errors
    if (!text || text.trim() === '') {
      return '';
    }

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' }, // A standard, clear voice
          },
        },
      },
      prompt: text,
    });
    if (!media) {
      throw new Error('No media was returned from the TTS model.');
    }
    // The model returns raw PCM data, we need to wrap it in a WAV header to be playable in browsers.
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavDataUri = 'data:audio/wav;base64,' + (await toWav(audioBuffer));
    return wavDataUri;
  }
);

// Wrapper function to be called from the frontend
export async function textToSpeech(text: string): Promise<string> {
    return textToSpeechFlow(text);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (d: Buffer) => {
      bufs.push(d);
    });
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
