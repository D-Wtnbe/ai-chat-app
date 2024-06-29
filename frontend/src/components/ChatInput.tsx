import { ChangeEvent, KeyboardEvent } from "react";
import { Send, Trash2, Mic, MicOff } from "lucide-react";

import styles from "./ChatInput.module.css";

interface ChatInputProps {
  inputMessage: string;
  isListening: boolean;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: KeyboardEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
  onToggleListening: () => void;
  onClearChat: () => void;
}

export const ChatInput = ({
  inputMessage,
  isListening,
  onInputChange,
  onKeyPress,
  onSendMessage,
  onToggleListening,
  onClearChat,
}: ChatInputProps): JSX.Element => {
  return (
    <div className={styles["input-container"]}>
      <input
        type="text"
        value={inputMessage}
        onChange={onInputChange}
        onKeyPress={onKeyPress}
        className={styles["message-input"]}
        placeholder={
          isListening ? "音声入力中.." : "メッセージを入力してください"
        }
      />
      <button
        onClick={onToggleListening}
        className={`${styles["mic-button"]} ${isListening ? styles["listening"] : ""}`}
      >
        {isListening ? (
          <Mic className={styles["icon"]} />
        ) : (
          <MicOff className={styles["icon"]} />
        )}
      </button>
      <button onClick={onSendMessage} className={styles["send-button"]}>
        <Send className={styles["icon"]} />
      </button>
      <button onClick={onClearChat} className={styles["clear-button"]}>
        <Trash2 className={styles["icon"]} />
      </button>
    </div>
  );
};
