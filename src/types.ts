export interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export type Mora = {
  text: string;
  consonant: string;
  consonantLength: number;
  vowel: string;
  vowelLength: number;
  pitch: number;
};

export type Query = {
  accentQhrases: {
    moras: Mora[];
    accent: number;
    pauseMora: Mora;
  };
  speedScale: number;
  pitchScale: number;
  intonationScale: number;
  volumeScale: number;
  prePhonemeLength: number;
  postPhonemeLength: number;
  outputSamplingRate: number;
  outputStereo: boolean;
  kana: string;
};
