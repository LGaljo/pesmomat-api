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

var token = "";

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
  let users = ["ajda","ziga"];

  if(token == "") {
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
        
        token = response.access_token;
        /*avaliableUsers(response.access_token)
          .then((res)=>{
            let users = []
            if(res.voices.includes("ajda")) users.push("ajda");
            if(res.voices.includes("ziga")) users.push("ziga");
            
            //implementiraj health check in tudi generacijo
            iterateText(users[0], response.access_token)
              .then((res)=>{
                iterateText(users[1], response.access_token)
              })
          })*/

          //implementiraj health check in tudi generacijo
          iterateText(users[1], token)
          .then((res)=>{
            
          })
          
        
      })
      .catch(error => {
          console.log(error)
      })
  } else {
    iterateText(users[1], token)
      .then((res)=>{
      
    })
  }




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

    async function generateTTS(users, auth, stavek){
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
            "voice": users,
            "input_text": stavek,
            "normalize": true,
            "accentuate": true,
            "simple_accentuation": false,
            "use_cache": true,
            "pace": 1,
            "tokenize": true,
            "pause_for_spelling": 250
          })
        })
      
        let data = await response;
        let audio = await data.buffer();
        return audio;


      } catch (error) {
        console.log(error);
      }
    }

    async function iterateText(users, auth){

      let audio = Buffer.alloc(0);

      for (let i = 0; i < text.length; i++){
        await new Promise(resolve => setTimeout(resolve, 1000));
          await generateTTS(users, auth, text[i])
          .then((res)=>{
            if(i == 0 || audio.length < 44) audio = res
            else if( res.length >= 44) audio = combineWavBuffers(audio, res);
          })
        
      }
      require("fs").writeFileSync("assets/slo/"+ users + "/" + options?.filenameSlo || 'assets/output.wav', audio);

      return ;
    }

    function combineWavBuffers(buffer1: Buffer, buffer2: Buffer): Buffer {
    
    
      //const headerSizes = buffer1.readUInt32LE(16);
      const headerSize = 44

      const audioData1 = buffer1.subarray(44);
    
      const audioData2 = buffer2.subarray(44);
    
      const totalLen = audioData1.length + audioData2.length;

      const combinedBuffer = Buffer.alloc(headerSize + totalLen);
  
      buffer1.copy(combinedBuffer, 0, 0, headerSize);
    
      combinedBuffer.writeUInt32LE(totalLen, 40);
    
        // Copy the combined audio data to the combined buffer
      audioData1.copy(combinedBuffer, 44);

      combinedBuffer.fill(0, 44 + audioData1.length, 44 + audioData1.length);

      // Copy the audio data from the second buffer
      audioData2.copy(combinedBuffer, 44 + audioData1.length);


     // audioData2.copy(combinedBuffer, 44 + audioData1.length);

    
      return combinedBuffer;
    }
    
}
