import React, { useEffect, useRef, useState } from "react";
import api from "../api/axiosConfig";
import "../styles/FarmerMessagePanel.css";

interface Message {
  id?: number;
  buyerName: string;
  buyerEmail: string;
  senderRole: "buyer" | "admin";
  subject: string;
  message: string;
  filePath?: string;
  createdAt?: string;
}

interface Buyer {
  name: string;
  email: string;
  lastMessage?: string;
}

interface Props {
  farmerName: string
  farmerEmail: string;
}

const FarmerMessagePanel: React.FC<Props> = ({ farmerName }) => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch all buyers with messages
  const fetchBuyers = async () => {
    try {
      const res = await api.get("/messages/admin"); // returns all messages
      const grouped: { [email: string]: Buyer } = {};
      res.data.forEach((m: Message) => {
        if (!grouped[m.buyerEmail]) {
          grouped[m.buyerEmail] = {
            name: m.buyerName,
            email: m.buyerEmail,
            lastMessage: m.message,
          };
        } else {
          grouped[m.buyerEmail].lastMessage = m.message;
        }
      });
      setBuyers(Object.values(grouped));
    } catch (err) {
      console.error("Error fetching buyers", err);
    }
  };

  // Fetch messages for selected buyer
  const fetchMessages = async (buyerEmail: string) => {
    try {
      const res = await api.get(`/messages/buyer/${buyerEmail}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectBuyer = (buyer: Buyer) => {
    setSelectedBuyer(buyer);
    fetchMessages(buyer.email);
    setReplyText("");
  };

  const replyToBuyer = async () => {
    if (!selectedBuyer || !replyText.trim()) return;

    const formData = new FormData();
    formData.append("buyerName", selectedBuyer.name);
    formData.append("buyerEmail", selectedBuyer.email);
    formData.append("senderRole", "admin");
    formData.append("subject", "Reply from GreenMart");
    formData.append("message", replyText);

    try {
      await api.post("/messages/send", formData);
      setReplyText("");
      fetchMessages(selectedBuyer.email);
      fetchBuyers();
    } catch (err) {
      console.error("Failed to send reply", err);
    }
  };

  return (
    <div className="farmer-message-panel">
      <div className="buyer-list">
        <h3>Buyers</h3>
        {buyers.map((b) => (
          <div
            key={b.email}
            className={`buyer-item ${selectedBuyer?.email === b.email ? "active" : ""}`}
            onClick={() => selectBuyer(b)}
          >
            <strong>{b.name}</strong>
            <p className="email">{b.email}</p>
            <p className="preview">{b.lastMessage}</p>
          </div>
        ))}
      </div>

      <div className="chat-section">
        {selectedBuyer ? (
          <>
            <div className="chat-header">
              <h3>{selectedBuyer.name}</h3>
              <p>{selectedBuyer.email}</p>
            </div>
            <div className="chat-body">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`chat-bubble ${m.senderRole === "admin" ? "farmer-bubble" : "buyer-bubble"}`}
                >
                  {m.subject && <div className="subject">{m.subject}</div>}
                  <div className="message-text">{m.message}</div>
                  {m.filePath && (
                    <a
                      href={`http://localhost:8080${m.filePath}`}
                      target="_blank"
                      rel="noreferrer"
                      className="file-link"
                    >
                      📎 View Attachment
                    </a>
                  )}
                  <div className="timestamp">
                    {new Date(m.createdAt || "").toLocaleString()}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="reply-section">
              <textarea
                placeholder="Type your reply..."
                rows={2}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <button onClick={replyToBuyer}>➤</button>
            </div>
          </>
        ) : (
          <div className="no-chat">Select a buyer to open chat</div>
        )}
      </div>
    </div>
  );
};

export default FarmerMessagePanel;
