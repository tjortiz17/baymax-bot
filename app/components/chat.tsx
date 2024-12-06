"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./chat.module.css";
import Markdown from "react-markdown";
import { getResponse } from "../api/actions";

type MessageProps = {
  author: "user" | "model";
  content: string;
};

const UserMessage = ({ text }: { text: string }) => {
  return <div className={styles.userMessage}>{text}</div>;
};

const BaymaxMessage = ({ text }: { text: string }) => {
  return (
    <div className={styles.baymaxMessage}>
      <Markdown>{text}</Markdown>
    </div>
  );
};

const Message = ({ author, content }: MessageProps) => {
  switch (author) {
    case "user":
      return <UserMessage text={content} />;
    case "model":
      return <BaymaxMessage text={content} />;
    default:
      return null;
  }
};

const Chat = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);

  // automatically scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (userText) => {
    const chatHistory = [
      ...messages,
      { author: "user", content: userText },
    ];
    let response = await getResponse(chatHistory);
    setMessages((prevMessages) => [
      ...prevMessages,
      { author: "model", content: response },
    ]);
    setInputDisabled(false);
    scrollToBottom();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    setMessages((prevMessages) => [
      ...prevMessages,
      { author: "user", content: userInput },
    ]);
    sendMessage(userInput);
    setUserInput("");
    setInputDisabled(true);
    scrollToBottom();
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <Message key={index} author={msg.author} content={msg.content} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className={`${styles.inputForm} ${styles.clearfix}`}
      >
        <input
          type="text"
          className={styles.input}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter your question"
        />
        <button
          type="submit"
          className={styles.button}
          disabled={inputDisabled}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
