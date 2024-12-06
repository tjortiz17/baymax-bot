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
  console.log(chat);

  const result = await chat.sendMessage(message);
  const response = result.response;
  return response.text();
}

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

// export async function getResponse(text) {
//   console.log(chat);
//   let result = await chat.sendMessage(text);
//   let response = result.response.text();
//   return response;
// };

/*
  in an async function here, I'll need to have a function that takes in the user text and chat history
  and either start a new chat every time a message is sent or just get a response based on the history
  and then return that back to the client chat component
*/