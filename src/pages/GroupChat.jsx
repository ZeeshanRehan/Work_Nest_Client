import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function GroupChat() {
  const { id } = useParams(); // group id from the route
  const userToken = localStorage.getItem("token");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [group, setGroup] = useState(null);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  }

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/group/${id}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        const data = await res.json();
        setGroup(data);
      } catch (err) {
        console.error("Failed to load group", err);
      }
    };

    fetchGroup();
  }, [id, userToken]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/chat/${id}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };

    fetchMessages();
  }, [id, userToken]);

  useEffect(() => {
    const interval = setInterval(() => {
      const fetchMessages = async () => {
        try {
          const res = await fetch(`${BASE_URL}/api/chat/${id}`, {
            headers: { Authorization: `Bearer ${userToken}` },
          });
          const data = await res.json();
          setMessages(data);
        } catch (err) {
          console.error("Failed to refresh messages", err);
        }
      };
  
      fetchMessages();
    }, 3000); // 🟢 Refresh every 3 seconds
  
    return () => clearInterval(interval); // cleanup when you leave the page
  }, [id, userToken]);
  

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await fetch(`${BASE_URL}/api/chat/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ message: newMessage }),
      });

      if (res.ok) {
        const savedMessage = await res.json();
        setMessages((prev) => [...prev, savedMessage]); // Add the new message to the list
        setNewMessage("");
      } else {
        alert("Failed to send message");
      }
    } catch (err) {
      console.error("Send failed", err);
    }
  };


  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 flex flex-col">
      <h1 className="text-3xl font-bold mb-4">{group?.name} — Chat Room 💬</h1>

      <div className="flex-1 overflow-y-auto bg-gray-800 p-4 rounded mb-4 space-y-2">
        {messages.map((msg) => (
          <div key={msg._id} className="bg-gray-700 p-2 rounded">
            <p className="text-sm text-gray-300">{msg.user?.email || "User"}:</p>
            <p className="text-lg">{msg.message}</p>
            <p className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 rounded bg-gray-800 text-white text-sm"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
        >
          Send
        </button>
      </form>
    </div>
  );
}
