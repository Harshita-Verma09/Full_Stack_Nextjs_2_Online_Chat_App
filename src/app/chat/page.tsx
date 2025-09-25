// // // //src\app\chat\page.tsx

"use client";


import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import io, { Socket } from "socket.io-client";
import UserList from "./UserList/page";
import ChatWindow from "./ChatWindow/page";
import TypeSend from "./TypeSend/page";
import { FiSun, FiMoon, FiTrash2, FiLogOut, FiSearch } from "react-icons/fi";
import SelectUserAnimation from "./SelectUserAnimation/page";

type User = { id: string; email: string };
type Message = { id?: string; chatId: string; senderId: string; text: string; createdAt: string };

let socket: Socket | null = null;

export default function ChatPage() {
    const router = useRouter(); 
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [chatId, setChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [hiddenMessages, setHiddenMessages] = useState<string[]>([]);
    const [searchEmail, setSearchEmail] = useState("");
    const [searchResult, setSearchResult] = useState<User | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // ------------------------
    // Load theme
    // ------------------------
    useEffect(() => {
        const theme = localStorage.getItem("theme");
        setDarkMode(theme === "dark");
    }, []);

    // ------------------------
    // Load hidden messages
    // ------------------------
    useEffect(() => {
        const hidden = localStorage.getItem("hiddenMessages");
        if (hidden) setHiddenMessages(JSON.parse(hidden));
    }, []);

    // ------------------------
    // Decode JWT
    // ------------------------
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/auth/login";
            return;
        }

        try {
            const payload = token.split(".")[1];
            if (!payload) throw new Error("Invalid token");
            const decoded = JSON.parse(atob(payload)) as { userId?: string };
            if (!decoded.userId) throw new Error("User ID not found in token");
            setCurrentUserId(decoded.userId);
        } catch (err) {
            console.error("JWT decode failed", err);
            window.location.href = "/auth/login";
        }
    }, []);

    // ------------------------
    // Init Socket.IO
    // ------------------------
    useEffect(() => {
        if (!currentUserId) return;

        const s = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000", {
            transports: ["websocket"],
            auth: { token: localStorage.getItem("token") },
        });

        s.on("connect", () => console.log(" Socket connected:", s.id));
        s.on("onlineUsers", (list: string[]) => setOnlineUsers(list || []));
        s.on("newMessage", (msg) => {
            if (msg.senderId !== currentUserId) { // Only add messages from others
                setMessages((prev) => [...prev, msg]);
            }
        });

        s.emit("userOnline", currentUserId);
        socket = s;

        return () => {
            console.log("❌ Disconnecting socket...");
            s.disconnect();
        };
    }, [currentUserId]);

    // ------------------------
    // Fetch users
    // ------------------------
    useEffect(() => {
        if (!currentUserId) return;
        (async () => {
            const res = await fetch("/api/chat/private/create");
            const data = await res.json();
            setUsers(data.users.filter((u: User) => u.id !== currentUserId));
        })();
    }, [currentUserId]);

    // ------------------------
    // Handle user click
    // ------------------------
    async function handleUserClick(user: User) {
        if (!currentUserId) return;
        setSelectedUser(user);
        setMessages([]);

        const res = await fetch("/api/chat/private/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userA: currentUserId, userB: user.id }),
        });

        const data = await res.json();
        const newChatId = data.chat?.id || data.id;
        setChatId(newChatId);

        if (newChatId) {
            socket?.emit("joinChat", newChatId);
            const msgsRes = await fetch(`/api/chat/private/messages?chatId=${newChatId}`);
            const msgsData = await msgsRes.json();
            setMessages(msgsData.messages || []);
        }
    }

    // ------------------------
    // Search user by email
    // ------------------------
    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!searchEmail.trim()) return;

        try {
            const res = await fetch(`/api/chat/private/search?email=${encodeURIComponent(searchEmail)}`);
            const data = await res.json();

            if (res.ok && data.user) {
                setSearchResult(data.user);
            } else {
                setSearchResult(null);
                alert(data.message || "User not found");
            }
        } catch {
            setSearchResult(null);
            alert("Something went wrong");
        }
    }

    // ------------------------
    // Toggle theme
    // ------------------------
    const toggleTheme = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem("theme", newMode ? "dark" : "light");
    };

    // ------------------------
    // Logout
    // ------------------------
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
    };

    // ------------------------
    // Delete messages
    // ------------------------
    const handleDeleteMe = () => {
        const allIds = messages.map((msg) => msg.id!).filter(Boolean);
        const newHidden = Array.from(new Set([...hiddenMessages, ...allIds]));
        setHiddenMessages(newHidden);
        localStorage.setItem("hiddenMessages", JSON.stringify(newHidden));
        alert("Are you want to delete all messages!");
    };

    // ------------------------
    // Auto-scroll
    // ------------------------
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ------------------------
    // Redirect to Create Group page
    // ------------------------
    const handleCreateGroup = () => {
        router.push("/group/createGroup"); 
    };

    return (
        <div className={darkMode ? "dark" : ""} style={{ display: "flex", height: "100vh", backgroundColor: darkMode ? "#111" : "#fff", color: darkMode ? "#fff" : "#000" }}>
            {/* LEFT SIDEBAR */}
            <div style={{ width: "300px", borderRight: `1px solid ${darkMode ? "#333" : "#ccc"}`, padding: "10px" }}>
                {/* 🔹 Create Group Button */}
                <div style={{ marginBottom: "10px", textAlign: "center" }}>
                    <button
                        onClick={handleCreateGroup}
                        style={{
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: "none",
                            backgroundColor: darkMode ? "#444" : "#8800ffff",
                            color: "#fff",
                            cursor: "pointer",
                            fontWeight: "bold",
                        }}
                    >
                        Create Group
                    </button>
                </div>

                {/* 🔍 Search Bar */}
                <form onSubmit={handleSearch} style={{ display: "flex", marginBottom: "10px" }}>
                    <input
                        type="text"
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        placeholder="Search by email"
                        style={{
                            flex: 1,
                            padding: "6px",
                            border: `1px solid ${darkMode ? "#252525ff" : "#ccc"}`,
                            borderRadius: "4px 0 0 4px",
                            backgroundColor: darkMode ? "#222" : "#fff",
                            color: darkMode ? "#fff" : "#000",
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: "8px 12px", // thoda bada aur comfortable
                            border: `1px solid ${darkMode ? "#555" : "#9900ffff"}`,
                            borderLeft: "none", // input ke saath seamless join
                            borderRadius: "0 6px 6px 0",
                            background: darkMode ? "#444" : "#eaeaeaff",
                            cursor: "pointer",
                            color: darkMode ? "#fff" : "#333",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease-in-out",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = darkMode
                                ? "#555"
                                : "#ddd";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = darkMode
                                ? "#444"
                                : "#eaeaea";
                        }}
                    >
                        <FiSearch size={18} />
                    </button>

                </form>

                {/* 🔍 Search Result Box */}
                {searchResult && (
                    <div
                        onClick={() => handleUserClick(searchResult)}
                        style={{
                            marginBottom: "12px",
                            padding: "12px 16px", // thoda aur padding
                            borderRadius: "12px",
                            background: darkMode ? "#2b2b2b" : "#ffffff",
                            color: darkMode ? "#f0f0f0" : "#222222",
                            fontSize: "0.95rem",
                            textAlign: "center",
                            cursor: "pointer",
                            border: `1px solid #8800ffff`,
                            boxShadow: darkMode
                                ? "0 2px 6px rgba(0,0,0,0.5)"
                                : "0 2px 6px rgba(0,0,0,0.1)",
                            transition: "all 0.2s ease-in-out",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLDivElement).style.backgroundColor = darkMode
                                ? "#3a3a3a"
                                : "#f0f0f0";
                            (e.currentTarget as HTMLDivElement).style.transform = "scale(1.02)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLDivElement).style.backgroundColor = darkMode
                                ? "#2b2b2b"
                                : "#ffffff";
                            (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                        }}
                    >
                        {searchResult.email}
                        <div style={{ fontSize: "0.8rem", opacity: 0.7, marginTop: "4px" }}>
                            Click to start chat
                        </div>
                    </div>
                )}


                {/* User List */}
                <UserList users={users} selectedUser={selectedUser} onUserClick={handleUserClick} onlineUsers={onlineUsers} darkMode={darkMode} />
            </div>

            {/* RIGHT CHAT SECTION */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: darkMode ? "#111" : "#fff", color: darkMode ? "#fff" : "#000" }}>
                {!selectedUser && <SelectUserAnimation />}

                {selectedUser && chatId && (
                    <>
                        {/* HEADER */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", borderBottom: `1px solid ${darkMode ? "#333" : "#ddd"}` }}>
                            <h2>{selectedUser.email}</h2>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button onClick={toggleTheme} style={{ ...iconButtonStyle, color: darkMode ? "#fff" : "#111" }} title={darkMode ? "Light Mode" : "Dark Mode"}>
                                    {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                                </button>
                                <button onClick={handleDeleteMe} style={{ ...iconButtonStyle, color: darkMode ? "#fff" : "#111" }} title="Delete Me">
                                    <FiTrash2 size={20} />
                                </button>
                                <button onClick={handleLogout} style={{ ...iconButtonStyle, color: darkMode ? "#fff" : "#111" }} title="Logout">
                                    <FiLogOut size={20} />
                                </button>
                            </div>
                        </div>

                        {/* CHAT MESSAGES */}
                        <ChatWindow messages={messages.filter((msg) => !hiddenMessages.includes(msg.id!))} currentUserId={currentUserId!} ref={messagesEndRef} />

                        {/* INPUT BOX */}
                        <TypeSend
                            chatId={chatId}
                            senderId={currentUserId!}
                            darkMode={darkMode}
                            onSend={(msg) => {
                                // socket?.emit("sendMessage", msg);
                                setMessages((prev) => [...prev, msg]);
                            }}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

// ------------------------
// Icon button style
// ------------------------
const iconButtonStyle: React.CSSProperties = {
    padding: "6px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    transition: "background 0.2s, color 0.2s",
};
