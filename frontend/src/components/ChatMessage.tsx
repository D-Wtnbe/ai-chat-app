import { Message } from "../types";
import { User, Bot } from "lucide-react";

import styles from "./ChatMessage.module.css";

interface ChatMessageProps {
  message: Message;
  isProcessingAudio: boolean;
}

export const ChatMessage = ({
  message,
  isProcessingAudio,
}: ChatMessageProps): JSX.Element => {
  const messageWrapperClass =
    message.sender === "user" ? styles["user-message"] : styles["bot-message"];
  const iconClass =
    message.sender === "user" ? styles["user-icon"] : styles["bot-icon"];
  const processingIndicatorClass = styles["processing-indicator"];

  return (
    <div className={`${styles["message-wrapper"]} ${messageWrapperClass}`}>
      {message.sender === "bot" && <Bot className={`icon ${iconClass}`} />}
      <div className={styles["message"]}>
        {message.text}
        {message.sender === "bot" && isProcessingAudio && (
          <span className={processingIndicatorClass}>音声生成中...</span>
        )}
      </div>
      {message.sender === "user" && <User className={`icon ${iconClass}`} />}
    </div>
  );
};
