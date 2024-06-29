import "regenerator-runtime";
import { useState, useCallback, useRef } from "react";
import superagent from "superagent";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Message, Query } from "./types";

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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
      "それは面白い質問だね！もっと詳しく教えてくれる？",
      "すごいね！そのことについてどう思う？",
      "なるほど。他に何か知りたいことはある？",
      "よく考えたね。他の例も思いつく？",
      "その考え方はとてもクリエイティブだよ！",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }, []);

  const createQuery = useCallback(
    async (text: string): Promise<Query | null> => {
      try {
        const res = await superagent
          .post("http://localhost:50021/audio_query")
          .query({ speaker: 1, text: text });

        return res.body as Query;
      } catch (error) {
        console.error("Error creating query:", error);
        return null;
      }
    },
    []
  );

  const createVoice = useCallback(
    async (query: Query): Promise<Blob | null> => {
      try {
        const res = await superagent
          .post("http://localhost:50021/synthesis")
          .query({ speaker: 1 })
          .send(query)
          .responseType("blob");

        return res.body as Blob;
      } catch (error) {
        console.error("Error creating voice:", error);
        return null;
      }
    },
    []
  );

  const speakBotResponse = useCallback(
    async (text: string) => {
      setIsProcessingAudio(true);
      const query = await createQuery(text);
      if (query) {
        const audioData = await createVoice(query);
        if (audioData && audioRef.current) {
          const audioUrl = window.URL.createObjectURL(audioData);
          audioRef.current.src = audioUrl;
          audioRef.current.play();
        }
      }
      setIsProcessingAudio(false);
    },
    [createQuery, createVoice]
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
