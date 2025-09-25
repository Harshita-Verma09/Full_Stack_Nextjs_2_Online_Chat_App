// "use client";


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./CreateGroup.module.css";

export default function CreateGroupPage() {
    const router = useRouter();
    const [groupName, setGroupName] = useState("");
    const [memberEmails, setMemberEmails] = useState("");
    const [adminEmail, setAdminEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [modeIndex, setModeIndex] = useState(0);

    const bgColors = [
        "rgba(250, 145, 217, 1)", // soft pink/lavender
        "rgba(135, 59, 170, 1)",  // deep purple
        "rgba(113, 191, 237, 1)", // light sky blue
        "rgba(7, 7, 70, 0.56)",      // rich navy
        "rgba(163, 235, 244, 1)"  // pale cyan
    ];


    const handleModeClick = () => setModeIndex(prev => (prev + 1) % bgColors.length);

    const handleCreateGroup = async () => {
        if (!groupName.trim()) return alert("Group name is required");
        if (!memberEmails.trim()) return alert("Add at least one member email");
        if (!adminEmail.trim()) return alert("Admin email is required");

        const emails = memberEmails.split(",").map(e => e.trim()).filter(Boolean);
        setLoading(true);
        try {
            const res = await fetch("/api/chat/group/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ groupName: groupName.trim(), memberEmails: emails, adminEmail: adminEmail.trim() }),
            });
            const data = await res.json();
            if (res.ok) {
                alert(`Group "${groupName}" created successfully!`);
                setGroupName("");
                setMemberEmails("");
            } else {
                alert(data.error || "Failed to create group");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => router.push("/chat");
    const handleChatWithGroup = () => router.push("/group/chat");

    return (
        <div
            style={{
                minHeight: "100vh",
                position: "relative",
                padding: "50px 0",
                background: darkMode ? "#111" : "#f3f3f3",
                transition: "background 0.5s",
                overflow: "hidden",
            }}
        >
            {/* Snow effect */}
            <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0, bottom: 0,
                pointerEvents: "none",
                zIndex: 1,
            }}>
                {Array.from({ length: 60 }).map((_, i) => (
                    <div key={i} className={styles.snow}></div>
                ))}
            </div>

            {/* Form container with glass + blur + color animation */}
            <div
                className={styles.container}
                style={{
                    position: "relative",
                    zIndex: 2,
                    background: bgColors[modeIndex],
                    backdropFilter: "blur(18px) saturate(180%)",
                    borderRadius: "25px",
                    padding: "35px",
                    maxWidth: "480px",
                    margin: "0 auto",
                    boxShadow: darkMode
                        ? "0 12px 36px rgba(0,0,0,0.6)"
                        : "0 12px 36px rgba(0,0,0,0.2)",
                    color: darkMode ? "#fff" : "#000",
                    border: darkMode ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.1)",
                    transition: "all 0.8s ease",
                }}
            >
                <h2 className={styles.title}>Create New Group</h2>

                {/* Top buttons */}
                <div className={styles.topButtons}>
                    <button
                        onClick={handleBack}
                        className={styles.button}
                        style={{
                            backgroundColor: darkMode ? "#333" : "#6c757d",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
                        }}
                    >
                        Back
                    </button>
                    <button
                        onClick={handleModeClick}
                        className={styles.button}
                        style={{
                            backgroundColor: darkMode ? "#555" : "#007bff",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
                        }}
                    >
                        Mode
                    </button>
                    <button
                        onClick={() => setDarkMode(prev => !prev)}
                        className={styles.button}
                        style={{
                            backgroundColor: darkMode ? "#222" : "#17a2b8",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
                        }}
                    >
                        Toggle Dark
                    </button>
                </div>

                {/* Input fields */}
                <label className={styles.label}>Group Name</label>
                <input type="text" value={groupName} onChange={e => setGroupName(e.target.value)} className={styles.input} />

                <label className={styles.label}>Member Emails (comma separated)</label>
                <input type="text" value={memberEmails} onChange={e => setMemberEmails(e.target.value)} className={styles.input} />

                <label className={styles.label}>Your Email (Admin)</label>
                <input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className={styles.input} />

                {/* Action buttons */}
                <button
                    onClick={handleCreateGroup}
                    disabled={loading}
                    className={`${styles.button} ${loading ? styles.buttonDisabled : ""}`}
                    style={{
                        backgroundColor: "#28a745",
                        boxShadow: "0 6px 12px rgba(0,0,0,0.3)"
                    }}
                >
                    {loading ? "Creating..." : "Create Group"}
                </button>

                <button
                    onClick={handleChatWithGroup}
                    className={styles.button}
                    style={{
                        backgroundColor: "#17a2b8",
                        boxShadow: "0 6px 12px rgba(0,0,0,0.3)"
                    }}
                >
                    Chat with Group
                </button>
            </div>
        </div>
    );
}
