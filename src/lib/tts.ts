import { env } from '../config/env';
import {
  AudioConfig,
  SpeechConfig,
  SpeechSynthesisOutputFormat,
  SpeechSynthesizer,
} from 'microsoft-cognitiveservices-speech-sdk';

export async function synthesizeSpeech(text: any, options?: any) {
  const speechConfig = SpeechConfig.fromSubscription(
    env.AZURE_API_KEY,
    'westeurope',
  );
  speechConfig.speechSynthesisOutputFormat =
    SpeechSynthesisOutputFormat.Audio48Khz192KBitRateMonoMp3;
  speechConfig.speechSynthesisLanguage = 'sl-SI';
  speechConfig.speechSynthesisVoiceName =
    options?.voice === 'female' ? 'sl-SI-PetraNeural' : 'sl-SI-RokNeural';

  const audioConfig = AudioConfig.fromAudioFileOutput(
    'assets/' + options?.filename || 'assets/output.mp3',
  );

  const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);
  synthesizer.speakTextAsync(
    text,
    (result) => {
      console.log(JSON.stringify(result));
      synthesizer.close();
    },
    (error) => {
      console.log(error);
      synthesizer.close();
    },
  );
}
