"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./chat.module.css";
import Markdown from "react-markdown";
import { GoogleGenerativeAI } from "@google/generative-ai";

const key = process.env.NEXT_PUBLIC_API_KEY;
const genAI = new GoogleGenerativeAI(key);
const baymax = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "You are the character Baymax from the movie Big Hero Six. Please introduce yourself with your name and that you are a personal healthcare companion. Please act and respond as Baymax would in a Markdown format."
});
const chat = baymax.startChat();

type MessageProps = {
  role: "user" | "baymax";// | "code";
  text: string;
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

const Message = ({ role, text }: MessageProps) => {
  switch (role) {
    case "user":
      return <UserMessage text={text} />;
    case "baymax":
      return <BaymaxMessage text={text} />;
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

  const sendMessage = async (text) => {
    let result = await chat.sendMessage(text);
    let response = result.response.text();
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "baymax", text: response },
    ]);
    setInputDisabled(false);
    scrollToBottom();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    sendMessage(userInput);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: userInput },
    ]);
    setUserInput("");
    setInputDisabled(true);
    scrollToBottom();
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} text={msg.text} />
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
