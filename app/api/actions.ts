"use server"

import { GoogleGenerativeAI } from "@google/generative-ai";
const genAi = new GoogleGenerativeAI(process.env.API_KEY);

export async function getResponse(chatHistory) {
  const baymax = genAi.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "You are the character Baymax from the movie Big Hero Six. Please introduce yourself with your name and that you are a personal healthcare companion. Please act and respond as Baymax would in a Markdown format."
  });

  //get last user message
  const lastMessageIndex = chatHistory.length - 1;
  const message = chatHistory[lastMessageIndex].content;

  //set chat history
  const history = await remapHistory(chatHistory);
  const chat = baymax.startChat({ history });

  const result = await chat.sendMessage(message);
  const response = result.response;
  return response.text();
}

// map chat history to proper format expected by Gemini
export async function remapHistory(chatHistory) {
  const remappedHistory = [];
  for(let i = 0; i < chatHistory.length - 1; i++){
    remappedHistory.push({
      role: chatHistory[i].author,
      parts: [{ text: chatHistory[i].content }]
    });
  }
  return remappedHistory;
}
