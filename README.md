## Overview

This project is an integration with Google's Gemini API and programmed to respond like the character Baymax from the movie Big Hero Six.

## Quickstart Setup

### 1. Clone repo

```shell
git clone https://github.com/tjortiz17/baymax-bot
cd baymax-bot
```

### 2. Set your [Gemini API key](https://aistudio.google.com/app/apikey)

```shell
export GEMINI_API_KEY="sk_..."
```

(or in `.env`).

### 3. Install dependencies

```shell
npm install
```

### 4. Run

```shell
npm run dev
```

### 5. Navigate to [http://localhost:3000](http://localhost:3000).

## Deployment

You can deploy this project to Vercel or any other platform that supports Next.js.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fopenai%2Fopenai-assistants-quickstart&env=OPENAI_API_KEY,OPENAI_ASSISTANT_ID&envDescription=API%20Keys%20and%20Instructions&envLink=https%3A%2F%2Fgithub.com%2Fopenai%2Fopenai-assistants-quickstart%2Fblob%2Fmain%2F.env.example)
