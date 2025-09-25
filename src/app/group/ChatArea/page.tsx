// // // src\app\group\ChatArea\page.tsx

"use client";
import React, { useEffect, useRef, useState } from "react";
import ChatWindow, { Message } from "../ChatWindow/page";
import TypeSend from "../../chat/TypeSend/page";
import socket from "@/app/lib/socket";
import styles from "./ChatArea.module.css";

interface Props {
    selectedGroupId: string;
    currentUserId: string;
    darkMode?: boolean;
}

export default function ChatArea({ selectedGroupId, currentUserId, darkMode }: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [token, setToken] = useState<string | null>(null);

    // Load token
    useEffect(() => {
        const t = localStorage.getItem("token");
        if (t) setToken(t);
    }, []);

    // Fetch messages
    useEffect(() => {
        if (!selectedGroupId || !token) return;
        setMessages([]);
        (async () => {
            try {
                const res = await fetch(`/api/chat/group/messages?chatId=${selectedGroupId}&limit=50`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setMessages(data.messages || []);
                socket.emit("joinRoom", selectedGroupId);
            } catch (err) {
                console.error("Error fetching messages", err);
            }
        })();
    }, [selectedGroupId, token]);

    // Listen for new messages
    useEffect(() => {
        if (!selectedGroupId || !socket) return;

        const handleMessage = (msg: Message) => {
            if (msg.chatId === selectedGroupId) {
                setMessages((prev) => [...prev, msg]);
            }
        };

        socket.on("receiveMessage", handleMessage);
        return () => {
            socket.off("receiveMessage", handleMessage);
        };
    }, [selectedGroupId]);

    // Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
            <div className={styles.messages}>
                <ChatWindow
                    messages={messages}
                    currentUserId={currentUserId}
                    ref={messagesEndRef}
                    darkMode={darkMode} // pass prop down
                />
            </div>

            {token && (
                <div className={styles.inputContainer}>
                    <TypeSend
                        chatId={selectedGroupId}
                        senderId={currentUserId}
                        darkMode={darkMode}
                        onSend={(msg) => setMessages((prev) => [...prev, msg])}
                    />
                </div>
            )}
        </div>

    );
}
