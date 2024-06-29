import { ChangeEvent, KeyboardEvent } from "react";
import { useChat } from "./hooks";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import styles from "./App.module.css";

const App = (): JSX.Element => {
  const {
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
  } = useChat();

  if (!browserSupportsSpeechRecognition) {
    return (
      <span>
        申し訳ありません。お使いのブラウザは音声認識に対応していません。
      </span>
    );
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className={styles["chat-app"]}>
      <h1 className={styles["app-title"]}>AIチャット</h1>
      <div className={styles["chat-container"]}>
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isProcessingAudio={isProcessingAudio}
          />
        ))}
      </div>
      <ChatInput
        inputMessage={inputMessage}
        isListening={isListening}
        onInputChange={handleInputChange}
        onKeyPress={handleKeyPress}
        onSendMessage={sendMessage}
        onToggleListening={toggleListening}
        onClearChat={clearChat}
      />
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
};

export default App;
