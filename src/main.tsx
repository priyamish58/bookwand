import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
console.log(import.meta.env.VITE_TEST); // Should log 'magic123'
console.log(import.meta.env.VITE_OPENAI_API_KEY); // should log your key

