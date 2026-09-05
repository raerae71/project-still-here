"use client";

import { useEffect, useState } from "react";

export default function Wall() {
  const [messages, setMessages] = useState([]);
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  async function loadMessages() {
    const response = await fetch("/api/messages");
    const data = await response.json();

    setMessages(data.messages || []);
    setCount(data.count || 0);
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function submitMessage(event) {
    event.preventDefault();

    if (!text.trim()) return;

    setStatus("Sending...");

    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text,
        name: name || "anonymous"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error || "Something went wrong.");
      return;
    }

    setText("");
    setName("");

    if (data.status === "approved") {
      setStatus("Your message is now on the wall.");
    } else {
      setStatus("Thank you. Your message has been submitted for review.");
    }

    loadMessages();
  }

  return (
    <main>
      <header className="wall-header">
        <a href="/" className="logo">
          PROJECT STILL HERE
        </a>

        <div className="wall-count">
          {count.toLocaleString()} messages
        </div>
      </header>

      <section className="wall">
        <div className="wall-intro">
          <p className="eyebrow">THE WALL</p>

          <h1>Messages from people who care.</h1>

          <p>
            You don't have to know someone personally to remind them that
            they're not alone.
          </p>
        </div>

        <div className="messages">
          {messages.map((message) => (
            <article className="wall-message" key={message.id}>
              <p>“{message.text}”</p>

              <span>
                — {message.name || "anonymous"}
              </span>
            </article>
          ))}
        </div>

        <section className="leave" id="leave">
          <p className="eyebrow">LEAVE SOMETHING BEHIND</p>

          <h2>Write a message.</h2>

          <form onSubmit={submitMessage}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write something kind..."
              maxLength={500}
              required
            />

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name (optional)"
              maxLength={50}
            />

            <button type="submit" className="button primary">
              LEAVE MESSAGE
            </button>

            {status && <p className="form-status">{status}</p>}
          </form>
        </section>
      </section>
    </main>
  );
}
