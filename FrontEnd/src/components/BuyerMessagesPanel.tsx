import React, { useEffect, useRef, useState } from "react";
import api from "../api/axiosConfig";
import "../styles/BuyerMessagePanel.css";

interface Message {
  id?: number;
  buyerName: string;
  buyerEmail: string;
  senderRole: "buyer" | "admin";
  message: string;
  imagePath?: string;
  createdAt?: string;
}

interface Props {
  buyerName: string;
  buyerEmail: string;
}

const BuyerMessagePanel: React.FC<Props> = ({ buyerName, buyerEmail }) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages from backend
  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages/buyer/${buyerEmail}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message + image
  const sendMessage = async () => {
    if (!message.trim() && !file) {
      alert("Please enter a message or attach an image");
      return;
    }

    const formData = new FormData();
    formData.append("buyerName", buyerName);
    formData.append("buyerEmail", buyerEmail);
    formData.append("senderRole", "buyer");
    formData.append("message", message);
    if (file) formData.append("image", file); // ✅ match backend param

    try {
      setLoading(true);
      await api.post("/messages/send", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("");
      setFile(null);
      fetchMessages();
    } catch (error) {
      console.error("Failed to send message", error);
      alert("Error sending message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buyer-message-container">
      {/* Header */}
      <div className="buyer-message-header">
        <div>
          <h2>Chat with GreenMart</h2>
          <p>{buyerName}</p>
        </div>
      </div>

      {/* Chat Body */}
      <div className="buyer-message-body">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`chat-bubble ${m.senderRole === "buyer" ? "buyer-bubble" : "admin-bubble"}`}
          >
            {m.message && <div className="message-text">{m.message}</div>}
            {m.imagePath && (
              <img
                src={`http://localhost:8080${m.imagePath}`}
                alt="Attachment"
                className="chat-image"
              />
            )}
            <div className="timestamp">
              {new Date(m.createdAt || "").toLocaleString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer Input */}
      <div className="buyer-message-footer">
        <div className="message-input-section">
          <textarea
            className="message-input"
            placeholder="Type a message..."
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <label className="file-upload">
            📎
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
          <button
            onClick={sendMessage}
            disabled={loading}
            className="send-btn"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyerMessagePanel;
