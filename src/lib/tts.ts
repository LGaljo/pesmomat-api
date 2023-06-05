import { env } from '../config/env';
import fetch from 'node-fetch';
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

export async function synthesizeSpeechSlo(text: any, options?: any) {
  fetch('http://35.204.0.77:50051/token', {
    method: 'POST',
    headers: {
      'accept': 'application/json'
    },
    body: new URLSearchParams({
      'grant_type': '',
      'username': 'beletrina',
      'password': 'eknjiga',
      'scope': '',
      'client_id': '',
      'client_secret': ''
    })
        
  }).then((res)=>res.json())
    .then((response) => {
      

      avaliableUsers(response.access_token)
        .then((res)=>{
          let users = []
          if(res.voices.includes("ajda")) users.push("ajda");
          if(res.voices.includes("ziga")) users.push("ziga");
          
          //implementiraj health check in tudi generacijo
          generateTTS(users, response.access_token);
          
        })
        
      
    })
    .catch(error => {
        console.log(error)
    })




    async function avaliableUsers(auth){
      try {
        let response = await fetch("http://35.204.0.77:50051/v1/available_voices",{
          method:'GET',
          headers:{
            'accept' : 'application/json',
            'Authorization': 'Bearer ' + auth
          },
        })

        let data = await response.json();
        return data;

      } catch (error) {
        console.log(error);
      }

      return {};
    }

    async function generateTTS(users, auth){
      try {

        let response = await fetch("http://35.204.0.77:50051/v1/speak",{
          method:'POST',
          headers:{
            'accept' : 'application/json',
            'Content-Type':'application/json',
            'Authorization': 'Bearer ' + auth
          },
          body: JSON.stringify({
            "userid": "beletrina",
            "voice": users[0],
            "input_text": text,
            "normalize": false,
            "accentuate": true,
            "simple_accentuation": true,
            "use_cache": true,
            "pace": 1,
            "tokenize": true,
            "pause_for_spelling": 250
          })
        })
        
        let data = await response;
        let audio = await data.buffer();
        require("fs").writeFileSync("assets/slo/" + options?.filenameSlo || 'assets/output.wav', audio);


      } catch (error) {
        console.log(error);
      }
    }
    
}
