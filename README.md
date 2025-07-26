# 📚✨ BookWand – A Magical Reading Assistant

**BookWand** is a Harry Potter–inspired magical reading assistant that helps users summarize documents, convert text to speech using character voices, and understand complex words in a whimsical and educational manner. It integrates OpenAI for AI features and ElevenLabs for lifelike voice generation.
Additionally, BookWand offers supportive features for users with dyslexia and ADHD, such as distraction-free reading modes, word-by-word highlighting, and periodic breathing breaks to maintain focus and reduce overwhelm.

---

## ✨ Features

* 📄 Upload PDF, TXT, or EPUB files
* 🧙 Summarize documents with a magical GPT assistant
* 🔊 Text-to-Speech with voices like Hermione, Snape, Dumbledore, etc.
* 📖 Explain words in a fun and memorable way
* 🌌 Magical UI theme inspired by the Wizarding World

---

## ⚙️ Tech Stack

* **Frontend**: Vite + React + TypeScript
* **Styling**: Tailwind CSS
* **AI Services**: OpenAI GPT
* **Voice Synthesis**: ElevenLabs API

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/priyamish58/bookwand.git
cd bookwand
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Environment Variables

Create a `.env` file in the root directory and add your API keys:

```env
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

> ⚠️ Do **not** share or commit your `.env` file.

### 4. Run the Development Server

```bash
npm run dev
```

## 📁 Project Structure

```
bookwand/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   │   ├── openai.ts         # OpenAI GPT logic
│   │   └── elevenlabs.ts     # ElevenLabs TTS logic
├── .env                      # Environment variables
├── tailwind.config.ts
├── vite.config.ts
└── README.md



## 👩‍💼 Contributing

Pull requests and stars are welcome!


## 📜 License

MIT © Priya(https://github.com/priyamish58)


## 🌟 Acknowledgements

* [OpenAI](https://openai.com/)
* [ElevenLabs](https://www.elevenlabs.io/)
* [Tailwind CSS](https://tailwindcss.com/)

