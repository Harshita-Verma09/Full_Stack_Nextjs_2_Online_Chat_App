// src\app\chat\ChatWindow\page.tsx

"use client";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Message } from "../TypeSend/page";


interface Props {
    messages: Message[];
    currentUserId: string;
}


const ChatWindow = forwardRef<HTMLDivElement, Props>(({ messages, currentUserId }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const endRef = useRef<HTMLDivElement | null>(null);

    const [showScrollTop, setShowScrollTop] = useState(false);
    const [showScrollBottom, setShowScrollBottom] = useState(false);

    const sortedMessages = [...messages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    //  Scroll listener for showing buttons
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            const scrollBottom = container.scrollHeight - scrollTop - container.clientHeight;

            setShowScrollTop(scrollTop > 50); // show top button if scrolled down 50px
            setShowScrollBottom(scrollBottom > 50); // show bottom button if not at bottom
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    //  Auto scroll to bottom when new message
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const formatDateHeader = (dateStr: string) => {
        const msgDate = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (
            msgDate.getFullYear() === today.getFullYear() &&
            msgDate.getMonth() === today.getMonth() &&
            msgDate.getDate() === today.getDate()
        )
            return "Today";

        if (
            msgDate.getFullYear() === yesterday.getFullYear() &&
            msgDate.getMonth() === yesterday.getMonth() &&
            msgDate.getDate() === yesterday.getDate()
        )
            return "Yesterday";

        return msgDate.toLocaleDateString();
    };

    let lastDate = "";

    return (
        <div
            ref={containerRef}
            style={{
                flex: 1,
                padding: "1rem",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                position: "relative",
            }}
        >
            {sortedMessages.map((msg, index) => {
                const msgDate = formatDateHeader(msg.createdAt);
                const showDateHeader = msgDate !== lastDate;
                lastDate = msgDate;

                return (
                    <React.Fragment key={msg.createdAt + index}>
                        {showDateHeader && (
                            <div
                                style={{
                                    alignSelf: "center",
                                    margin: "10px 0",
                                    padding: "12px 20px",
                                    borderRadius: "10px",
                                    backgroundColor: "#7c3aed",
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    color: "#ffffffff",
                                }}
                            >
                                {msgDate}
                            </div>
                        )}

                        <div
                            style={{
                                alignSelf: msg.senderId === currentUserId ? "flex-end" : "flex-start",
                                backgroundColor: msg.senderId === currentUserId ? "#7c3aed" : "#eee",
                                color: msg.senderId === currentUserId ? "#fff" : "#000",
                                padding: "18px 17px",
                                borderRadius: "12px",
                                marginBottom: "5px",
                                maxWidth: "70%",
                                wordBreak: "break-word",
                                fontSize: "20px",
                            }}
                        >
                            {msg.text}
                            <div
                                style={{
                                    fontSize: "15px",
                                    marginTop: "3px",
                                    textAlign: "right",
                                    opacity: 0.6,
                                }}
                            >
                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </div>
                        </div>
                    </React.Fragment>
                );
            })}

            <div ref={endRef} />

            {/* ⬆️ Top Button */}
            {showScrollTop && (
                <button
                    onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "none",
                        background: "#b892faff",
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    ⬆️ Top
                </button>
            )}

            {/* ⬇️ Bottom Button */}
            {showScrollBottom && (
                <button
                    onClick={() => endRef.current?.scrollIntoView({ behavior: "smooth" })}
                    style={{
                        position: "absolute",
                        bottom: "10px",
                        right: "10px",
                        padding: "6px 10px",
                        borderRadius: "12px",
                        border: "2px solid   #b0b0b0ff",
                        backgroundColor: "#7b00ffff",

                        color: "#ffffffff",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    ⬇️ Bottom
                </button>
            )}
        </div>
    );
});

export default ChatWindow;
