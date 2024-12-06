import React from "react";
import styles from "./page.module.css"; // use simple styles for demonstration purposes
import Chat from "./components/chat";

export default async function Home() {
  // const genAi = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  // //console.log(genAi)
  // const baymax = genAi.getGenerativeModel({
  //   model: "gemini-1.5-flash",
  //   systemInstruction: "You are the character Baymax from the movie Big Hero Six. Please introduce yourself with your name and that you are a personal healthcare companion. Please act and respond as Baymax would in a Markdown format."
  // });
  // console.log(baymax)
  //const genAi = await getGenAi();
  //console.log(JSON.parse(JSON.stringify(genAi)));
  // const baymax = genAI.getGenerativeModel({
  //   model: "gemini-1.5-flash",
  //   systemInstruction: "You are the character Baymax from the movie Big Hero Six. Please introduce yourself with your name and that you are a personal healthcare companion. Please act and respond as Baymax would in a Markdown format."
  // });
  // const chat = baymax.startChat();
  // const model = await getBaymax();
  // console.log(model);
  // const baymax = {model};
  // console.log(baymax);
  const key = process.env.GEMINI_API_KEY;
  //console.log(key);
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Chat key={key} />
      </div>
    </main>
  );
};

//export default Home;
