import { env } from '../config/env';
import {
  AudioConfig,
  SpeechConfig,
  SpeechSynthesisOutputFormat,
  SpeechSynthesizer,
} from 'microsoft-cognitiveservices-speech-sdk';

export const languages = {
  at: {
    code: 'de-AT',
    voice: { male: 'de-AT-JonasNeural', female: 'de-AT-IngridNeural' },
  },
  en_us: {
    code: 'en-US',
    voice: { male: 'en-US-BrandonNeural', female: 'en-US-AmberNeural' },
  },
  en_gb: {
    code: 'en-GB',
    voice: { male: 'en-US-BrandonNeural', female: 'en-US-AmberNeural' },
  },
  hr: {
    code: 'hr-HR',
    voice: { male: 'hr-HR-SreckoNeural', female: 'hr-HR-GabrijelaNeural' },
  },
  hu: {
    code: 'hu-HU',
    voice: { male: 'hu-HU-TamasNeural', female: 'hu-HU-NoemiNeural' },
  },
  sl: {
    code: 'sl-SI',
    voice: { male: 'sl-SI-RokNeural', female: 'sl-SI-PetraNeural' },
  },
  it: {
    code: 'it-IT',
    voice: { male: 'it-IT-BenignoNeural', female: 'it-IT-ElsaNeural' },
  },
  de: {
    code: 'de-DE',
    voice: { male: 'de-DE-BerndNeural', female: 'de-DE-AmalaNeural' },
  },
};

export async function synthesizeSpeech(text: any, options?: any) {
  const speechConfig = SpeechConfig.fromSubscription(
    env.AZURE_API_KEY,
    'westeurope',
  );
  speechConfig.speechSynthesisOutputFormat =
    SpeechSynthesisOutputFormat.Audio48Khz192KBitRateMonoMp3;
  speechConfig.speechSynthesisLanguage = 'sl-SI';
  if (options?.language && !!languages[options?.language]) {
    speechConfig.speechSynthesisLanguage = languages[options.language].code;
  }
  speechConfig.speechSynthesisVoiceName =
    options?.voice === 'female' ? 'sl-SI-PetraNeural' : 'sl-SI-RokNeural';

  const audioConfig = AudioConfig.fromAudioFileOutput(
    'assets/' + options?.filename || 'assets/output.mp3',
  );

  const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);
  return new Promise((resolve, reject) => {
    synthesizer.speakTextAsync(
      text,
      (result) => {
        console.log(JSON.stringify(result));
        synthesizer.close();
        resolve(result);
      },
      (error) => {
        console.log(error);
        synthesizer.close();
        reject(error);
      },
    );
  });
}
