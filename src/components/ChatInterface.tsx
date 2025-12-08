import { useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import { IoSendSharp } from "react-icons/io5";
import type { MessageType } from "./typescript/MessageType";

const SERVER_PORT = 3001;

const ChatInterface = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const response = await fetch(`http://localhost:${SERVER_PORT}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await response.json();
    setMessages([...newMessages, { role: "assistant", content: data.message }]);
    setLoading(false);
  };

  return (
    <div className="chat-interface">
      <header className="chat-header">
        <div>
          {/* <p className="eyebrow">Assistant</p> */}
          <h2>À vous l'IA</h2>
        </div>
        <p className="subtitle">Identifier des cas d'usage de la GenAI</p>
      </header>

      <div className="chat-body">
          <div className="messages">
            {messages.map((m, i) => (
              <div key={i} className={`message ${m.role}`}>
                <span className="message-label">{m.role === "user" ? "Vous" : "Assistant"}</span>
                <p>{m.content}</p>
              </div>
            ))}
          </div>

        {loading && <p className="typing">L'assistant réfléchit...</p>}
      </div>

      <div className="chat-input">
        <button type="button" className="icon-button" aria-label="Importer un fichier">
          <FaFileUpload />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Taper un message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button type="button" className="send-button" onClick={sendMessage} aria-label="Envoyer">
          <IoSendSharp />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
