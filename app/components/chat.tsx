"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./chat.module.css";
import Markdown from "react-markdown";
// @ts-expect-error - no types for this yet
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

// const CodeMessage = ({ text }: { text: string }) => {
//   return (
//     <div className={styles.codeMessage}>
//       {text.split("\n").map((line, index) => (
//         <div key={index}>
//           <span>{`${index + 1}. `}</span>
//           {line}
//         </div>
//       ))}
//     </div>
//   );
// };

const Message = ({ role, text }: MessageProps) => {
  switch (role) {
    case "user":
      return <UserMessage text={text} />;
    case "baymax":
      return <BaymaxMessage text={text} />;
    // case "code":
    //   return <CodeMessage text={text} />;
    default:
      return null;
  }
};

// type ChatProps = {
//   functionCallHandler?: (
//     toolCall: RequiredActionFunctionToolCall
//   ) => Promise<string>;
// };

const Chat = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  //const [threadId, setThreadId] = useState("");

  // automatically scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // create a new threadID when chat component created
  // useEffect(() => {
  //   const createThread = async () => {
  //     const res = await fetch(`/api/assistants/threads`, {
  //       method: "POST",
  //     });
  //     const data = await res.json();
  //     setThreadId(data.threadId);
  //   };
  //   createThread();
  // }, []);

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

  // const submitActionResult = async (runId, toolCallOutputs) => {
  //   const response = await fetch(
  //     `/api/assistants/threads/${threadId}/actions`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         runId: runId,
  //         toolCallOutputs: toolCallOutputs,
  //       }),
  //     }
  //   );
  //   const stream = AssistantStream.fromReadableStream(response.body);
  //   handleReadableStream(stream);
  // };

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

  /* Stream Event Handlers */

  // textCreated - create new assistant message
  // const handleTextCreated = () => {
  //   appendMessage("assistant", "");
  // };

  // textDelta - append text to last assistant message
  // const handleTextDelta = (delta) => {
  //   if (delta.value != null) {
  //     appendToLastMessage(delta.value);
  //   };
  //   if (delta.annotations != null) {
  //     annotateLastMessage(delta.annotations);
  //   }
  // };

  // imageFileDone - show image in chat
  // const handleImageFileDone = (image) => {
  //   appendToLastMessage(`\n![${image.file_id}](/api/files/${image.file_id})\n`);
  // }

  // toolCallCreated - log new tool call
  // const toolCallCreated = (toolCall) => {
  //   if (toolCall.type != "code_interpreter") return;
  //   appendMessage("code", "");
  // };

  // toolCallDelta - log delta and snapshot for the tool call
  // const toolCallDelta = (delta, snapshot) => {
  //   if (delta.type != "code_interpreter") return;
  //   if (!delta.code_interpreter.input) return;
  //   appendToLastMessage(delta.code_interpreter.input);
  // };

  // handleRequiresAction - handle function call
  // const handleRequiresAction = async (
  //   event: AssistantStreamEvent.ThreadRunRequiresAction
  // ) => {
  //   const runId = event.data.id;
  //   const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;
  //   // loop over tool calls and call function handler
  //   const toolCallOutputs = await Promise.all(
  //     toolCalls.map(async (toolCall) => {
  //       const result = await functionCallHandler(toolCall);
  //       return { output: result, tool_call_id: toolCall.id };
  //     })
  //   );
  //   setInputDisabled(true);
  //   submitActionResult(runId, toolCallOutputs);
  // };

  // handleRunCompleted - re-enable the input form
  // const handleRunCompleted = () => {
  //   setInputDisabled(false);
  // };

  // const handleReadableStream = (stream: AssistantStream) => {
  //   // messages
  //   stream.on("textCreated", handleTextCreated);
  //   stream.on("textDelta", handleTextDelta);

  //   // image
  //   stream.on("imageFileDone", handleImageFileDone);

  //   // code interpreter
  //   stream.on("toolCallCreated", toolCallCreated);
  //   stream.on("toolCallDelta", toolCallDelta);

  //   // events without helpers yet (e.g. requires_action and run.done)
  //   stream.on("event", (event) => {
  //     if (event.event === "thread.run.requires_action")
  //       handleRequiresAction(event);
  //     if (event.event === "thread.run.completed") handleRunCompleted();
  //   });
  // };

  /*
    =======================
    === Utility Helpers ===
    =======================
  */

  // const appendToLastMessage = (text) => {
  //   setMessages((prevMessages) => {
  //     const lastMessage = prevMessages[prevMessages.length - 1];
  //     const updatedLastMessage = {
  //       ...lastMessage,
  //       text: lastMessage.text + text,
  //     };
  //     return [...prevMessages.slice(0, -1), updatedLastMessage];
  //   });
  // };

  // const appendMessage = (role, text) => {
  //   setMessages((prevMessages) => [...prevMessages, { role, text }]);
  // };

  // const annotateLastMessage = (annotations) => {
  //   setMessages((prevMessages) => {
  //     const lastMessage = prevMessages[prevMessages.length - 1];
  //     const updatedLastMessage = {
  //       ...lastMessage,
  //     };
  //     annotations.forEach((annotation) => {
  //       if (annotation.type === 'file_path') {
  //         updatedLastMessage.text = updatedLastMessage.text.replaceAll(
  //           annotation.text,
  //           `/api/files/${annotation.file_path.file_id}`
  //         );
  //       }
  //     })
  //     return [...prevMessages.slice(0, -1), updatedLastMessage];
  //   });
    
  // }

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
