// // // // //src\app\group\ChatWindow\page.tsx

"use client";
import React, { forwardRef } from "react";
import styles from "./ChatWindow.module.css";

export interface Message {
    id?: string;
    chatId: string;
    senderId: string;
    text: string;
    createdAt: string;
}

interface Props {
    messages: Message[];
    currentUserId: string;
    darkMode?: boolean;
}

const ChatWindow = forwardRef<HTMLDivElement, Props>(
    ({ messages, currentUserId, darkMode }, ref) => {
        const formatDate = (dateStr: string) => {
            const msgDate = new Date(dateStr);
            const now = new Date();
            const diffTime = now.getTime() - msgDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays === 0) return "Today";
            if (diffDays === 1) return "Yesterday";
            return msgDate.toLocaleDateString();
        };

        const groupedMessages: { [date: string]: Message[] } = {};
        messages.forEach((msg) => {
            const key = formatDate(msg.createdAt);
            if (!groupedMessages[key]) groupedMessages[key] = [];
            groupedMessages[key].push(msg);
        });

        return (
            <div
                className={`${styles.container} ${darkMode ? styles.dark : ""}`}
            >
                {Object.keys(groupedMessages).map((dateKey) => (
                    <div key={dateKey}>
                        <div className={styles.dateSeparator}>{dateKey}</div>

                        {groupedMessages[dateKey].map((msg) => {
                            const isOwn = msg.senderId === currentUserId;
                            return (
                                <div
                                    key={msg.id}
                                    className={`${styles.messageRow} ${isOwn ? styles.own : ""
                                        }`}
                                >
                                    <div
                                        className={`${styles.messageBubble} ${isOwn ? styles.ownBubble : styles.otherBubble
                                            }`}
                                    >
                                        {msg.text}
                                        <div className={styles.timestamp}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
                <div ref={ref} />
            </div>
        );
    }
);

export default ChatWindow;
