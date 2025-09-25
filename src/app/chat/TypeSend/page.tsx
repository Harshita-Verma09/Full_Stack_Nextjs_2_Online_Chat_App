// // src\app\chat\TypeSend\page.tsx

"use client";
import { useState, useEffect } from "react";
import socket from "@/app/lib/socket";

interface Props {
    chatId: string;
    senderId: string;
    onSend: (msg: Message) => void;
    darkMode?: boolean;
}

export interface Message {
    id?: string;
    chatId: string;
    senderId: string;
    text: string;
    createdAt: string;
}
export default function TypeSend({ chatId, senderId, onSend, darkMode }: Props) {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [listening, setListening] = useState(false);
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

    useEffect(() => {
        if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return;

        const Rec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recog = new Rec();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = "en-US";

        recog.onresult = (event: SpeechRecognitionEvent) => {
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    setText((prev) => prev + transcript + " ");
                }
            }
        };


        recog.onend = () => setListening(false);
        setRecognition(recog);
    }, []);

    const toggleListening = () => {
        if (!recognition) return;

        if (listening) {
            recognition.stop();
            setListening(false);
        } else {
            recognition.start();
            setListening(true);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await fetch("/api/chat/group/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ chatId, text }),
            });

            const data = await res.json();
            const savedMsg: Message = data.message;

            socket.emit("sendMessage", savedMsg);
            onSend(savedMsg);
            setText("");
        } catch (err) {
            console.error("❌ Error sending message:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                borderTop: `1px solid ${darkMode ? "#3a0ca3" : "#a855f7"}`,
                padding: "0.5rem",
            }}
        >
            {/* Mic Button */}
            <button
                type="button"
                onClick={toggleListening}
                style={{
                    padding: "16px",
                    borderRadius: "50%",
                    border: "none",
                    background: listening
                        ? "#ef4444"
                        : darkMode
                            ? "#8604ffff"
                            : "#caa2feff",
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "35px", // " make the mic bigger
                    width: "50px",     // optional: make the button round and bigger
                    height: "50px",
                }}
                title={listening ? "Stop Recording" : "Start Recording"}
            >
                🎙️
            </button>


            {/* Input */}
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                style={{
                    flex: 1,
                    padding: "18px",
                    borderRadius: "6px",
                    border: `1px solid ${darkMode ? "#9333ea" : "#a855f7"}`,
                    background: darkMode ? "#242424ff" : "#faf5ff",
                    color: darkMode ? "#e0e0e0" : "#222",
                    fontSize: "18px",
                }}
            />

            {/* Send Button */}
            <button
                type="submit"
                disabled={!text.trim() || loading}
                style={{
                    padding: "18px",
                    border: "none",
                    borderRadius: "6px",
                    background: !text.trim()
                        ? "#9ca3af"
                        : darkMode
                            ? "#9333ea"
                            : "#7c3aed",
                    color: "#fff",
                    cursor: !text.trim() ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                }}
            >
                {loading ? "..." : "➤ Send"}
            </button>
        </form>
    );
}
