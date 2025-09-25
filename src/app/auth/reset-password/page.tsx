// app/auth/reset-password/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setToast("");

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await res.json();
            if (!res.ok) {
                setToast(data.error || "Reset failed");
            } else {
                setToast("Password reset successful! You can now log in.");
                setEmail("");
                setOtp("");
                setNewPassword("");

                //  Redirect after 4 sec
                setTimeout(() => {
                    router.push("/auth/login");
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
                <h1 style={styles.heading}>Reset Password 🔒</h1>
                <p style={styles.subheading}>Enter your email, OTP, and new password</p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                    />
                    <input
                        type="text"
                        placeholder="6-digit OTP"
                        value={otp}
                        required
                        maxLength={6}
                        onChange={(e) => setOtp(e.target.value)}
                        style={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        required
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={styles.input}
                    />
                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                {toast && <div style={styles.toast}>{toast}</div>}
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    wrapper: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
   
        padding: "20px",
    },
    card: {
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
    heading: { fontSize: "28px", fontWeight: "bold", marginBottom: "10px" },
    subheading: { fontSize: "14px", marginBottom: "25px", opacity: 0.9 },
    form: { display: "flex", flexDirection: "column", gap: "15px" },
    input: {
        padding: "12px",
        fontSize: "16px",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.3)",
        background: "rgba(255, 255, 255, 0.2)",
        color: "#080808ff",
        outline: "none",
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
    },
    toast: {
        marginTop: "20px",
        padding: "12px",
        backgroundColor: "rgba(0,0,0,0.7)",
        borderRadius: "8px",
        fontSize: "14px",
    },
};
