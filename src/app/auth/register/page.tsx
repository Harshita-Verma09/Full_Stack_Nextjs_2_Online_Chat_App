// app/auth/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (username.length < 3) {
            setToast("Username must be at least 3 characters long");
            return;
        }
        if (password.length < 6) {
            setToast("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);
        setToast("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (Array.isArray(data) && data[0]?.message) {
                    setToast(data[0].message);
                } else if (data.error) {
                    setToast(data.error);
                } else {
                    setToast("Something went wrong");
                }
            } else {
                setToast("Registration successful! Please verify your email.");
                setUsername("");
                setEmail("");
                setPassword("");

                // ⏳ Redirect after 4 sec
                setTimeout(() => {
                    router.push("/auth/verify-otp");
                }, 4000);
            }
        } catch (err: any) {
            setToast("Network error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                {/* ❌ Cross button */}
                <button
                    onClick={() => router.push("/")}
                    style={styles.closeButton}
                >
                    ✖
                </button>

                <h1 style={styles.heading}>Create Account</h1>
                <p style={styles.subheading}>Join Chatify and start connecting 🚀</p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="text"
                        placeholder="Username (min 3 chars)"
                        value={username}
                        required
                        minLength={3}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Password (min 6 chars)"
                        value={password}
                        required
                        minLength={6}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />
                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? "Registering..." : "Sign Up"}
                    </button>
                </form>

                {/* 🔑 Login button */}
                <p style={{ marginTop: "15px", fontSize: "14px" }}>
                    Already have an account?{" "}
                    <span
                        style={{ color: "#4da6ff", cursor: "pointer", fontWeight: "bold" }}
                        onClick={() => router.push("/auth/login")}
                    >
                        Login
                    </span>
                </p>

                {toast && <div style={styles.toast}>{toast}</div>}
            </div>
        </div>
    );
}

// 🎨 Styles
const styles: { [key: string]: React.CSSProperties } = {
    wrapper: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        padding: "20px",
    },
    card: {
        position: "relative",
        width: "100%",
        maxWidth: "400px",
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(12px)",
        borderRadius: "16px",
        padding: "30px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        color: "#000000ff",
        textAlign: "center",
    },
    closeButton: {
        position: "absolute",
        top: "10px",
        right: "10px",
        background: "transparent",
        border: "none",
        color: "#000000ff",
        fontSize: "18px",
        cursor: "pointer",
    },
    heading: {
        fontSize: "28px",
        fontWeight: "bold",
        marginBottom: "10px",
    },
    subheading: {
        fontSize: "14px",
        marginBottom: "25px",
        opacity: 0.9,
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    input: {
        padding: "12px",
        fontSize: "16px",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.3)",
        background: "rgba(250, 247, 247, 0.2)",
        color: "#000000ff",
        outline: "none",
        transition: "all 0.3s",
    },
    button: {
        padding: "12px",
        fontSize: "16px",
        borderRadius: "8px",
        border: "none",
        background: "linear-gradient(to right, #6a11cb, #2575fc)",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "bold",
        transition: "transform 0.2s, box-shadow 0.2s",
    },
    toast: {
        marginTop: "20px",
        padding: "12px",
        backgroundColor: "rgba(0,0,0,0.7)",
        borderRadius: "8px",
        fontSize: "14px",
    },
};
