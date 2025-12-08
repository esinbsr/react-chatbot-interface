import { useRef, useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import { IoSendSharp } from "react-icons/io5";
import type { MessageType } from "./typescript/MessageType";
import { FaStop } from "react-icons/fa";
import { RiRobot3Fill } from "react-icons/ri";

const SERVER_PORT = 3001;

const ChatInterface = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      role: "assistant",
      content: "Bonjour, comment puis-je vous aider aujourd'hui ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);


  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const newMessages = [...messages, { role: "user", content: input }];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch(
        `http://localhost:${SERVER_PORT}/api/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: newMessages }),
          signal: controller.signal,
        }
      );

      const data = await response.json();
      setMessages([
        ...newMessages,
        { role: "assistant", content: data.message },
      ]);
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Erreur lors de l'appel API :", error);
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  const cancelSendMessage = () => {
    abortRef.current?.abort();
    setLoading(false);
  };

  return (
    <div className="chat-interface">
      <header className="chat-header">
        <div>
          <h2>À vous l'IA</h2>
        </div>
        <p className="subtitle">Identifier des cas d'usage de la GenAI</p>
      </header>

      <div className="chat-body">
        <div className="messages">
    
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.role}`}>
              <span className="message-label">
                {m.role === "user" ? "Vous" : <RiRobot3Fill />}
              </span>
              <p>{m.content}</p>
            </div>
          ))}
        </div>

        {loading && <p className="typing">L'assistant réfléchit...</p>}
      </div>

      <div className="chat-input">
        <button
          type="button"
          className="icon-button"
          aria-label="Importer un fichier"
        >
          <FaFileUpload />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Taper un message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          type="button"
          className="send-button"
          aria-label="Envoyer"
          onClick={loading ? cancelSendMessage : sendMessage}
        >
          {loading ? <FaStop /> : <IoSendSharp />}
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
