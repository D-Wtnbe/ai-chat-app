import "regenerator-runtime";
import { useState, useCallback, useRef, useMemo } from "react";
import Client from "voicevox-client";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const client = useMemo(() => new Client(`http://${ import.meta.env.VITE_VOICEVOX_URL}:50021`), []);


  const { resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition({
      transcribing: true,
      clearTranscriptOnListen: true,
      commands: [
        {
          command: "*",
          callback: (command: string) => {
            setInputMessage((prev) => (prev + " " + command).trim());
          },
        },
      ],
    });

  const generateBotResponse = useCallback((): string => {
    const responses: string[] = [
      "わあ、おもしろい質問だね！もっと教えてくれるかな？",
      "すごいね！君はどう思う？",
      "なるほど。他に知りたいことある？",
      "よく考えたね。他の例も思いつく？",
      "そのアイデア、とってもクリエイティブだよ！",
      "わくわくする話だね！もっと聞かせて！",
      "君の考えは本当に面白いね。どうしてそう思ったの？",
      "素晴らしい質問だよ！一緒に考えてみよう！",
      "へぇ、そうなんだ！他にも知ってることはある？",
      "君の想像力はすごいね！もっと詳しく教えて！",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }, []);

  const speakBotResponse = useCallback(
    async (text: string) => {
      setIsProcessingAudio(true);
      try {
        if (client) {
          const speakerId = 1; // ずんだもんボイス
          const audioQuery = await client.createAudioQuery(text, speakerId);
          const audio = audioQuery.synthesis(speakerId);
          if (audioRef.current) {
            const audioArrayBuffer = await audio;
            const blob = new Blob([audioArrayBuffer], { type: "audio/wav" });
            audioRef.current.src = URL.createObjectURL(blob);
            await audioRef.current.play();
          }
        }
      } catch (error) {
        console.error("Error speaking bot response:", error);
      }
      setIsProcessingAudio(false);
    },
    [client]
  );

  const sendMessage = useCallback(async (): Promise<void> => {
    if (inputMessage.trim() === "") return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputMessage.trim(),
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage("");
    resetTranscript();

    const botResponse = generateBotResponse();
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse,
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      speakBotResponse(botResponse);
    }, 1000);
  }, [inputMessage, resetTranscript, generateBotResponse, speakBotResponse]);

  const clearChat = useCallback((): void => {
    setMessages([]);
  }, []);

  const toggleListening = useCallback((): void => {
    if (isListening) {
      SpeechRecognition.stopListening();
      resetTranscript();
    } else {
      SpeechRecognition.startListening({ language: "ja-JP", continuous: true });
    }
    setIsListening(!isListening);
  }, [isListening, resetTranscript]);

  return {
    messages,
    inputMessage,
    setInputMessage,
    isListening,
    isProcessingAudio,
    audioRef,
    browserSupportsSpeechRecognition,
    sendMessage,
    clearChat,
    toggleListening,
  };
};