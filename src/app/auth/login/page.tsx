// app/auth/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setToast("Please fill in all fields");
            return;
        }

        setLoading(true);
        setToast("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (data.token) {
                localStorage.setItem("token", data.token); // 🔑 Save token
                window.location.href = "/chat";           // Redirect to chat page
            }

            if (!res.ok) {
                setToast(data.error || "Invalid credentials");
            } else {
                setToast("Login successful! ");
                setEmail("");
                setPassword("");

                // ⏳ Redirect after 2 sec
                setTimeout(() => {
                    router.push("/chat"); // Apna dashboard route set karo
                }, 2000);
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

                <h1 style={styles.heading}>Welcome Back</h1>
                <p style={styles.subheading}>Login to continue </p>

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
                        type="password"
                        placeholder="Password"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />

                    {/* 🔗 Forgot password link */}
                    <p style={{ textAlign: "right", fontSize: "13px" }}>
                        <span
                            style={{ color: "#f74bddff", cursor: "pointer", fontWeight: "bold" }}
                            onClick={() => router.push("/auth/forgot-password")}
                        >
                            Forgot Password?
                        </span>
                    </p>

                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* 🔗 Register redirect */}
                <p style={{ marginTop: "15px", fontSize: "14px" }}>
                    Don’t have an account?{" "}
                    <span
                        style={{ color: "#4da6ff", cursor: "pointer", fontWeight: "bold" }}
                        onClick={() => router.push("/auth/register")}
                    >
                        Sign Up
                    </span>
                </p>

                {toast && <div style={styles.toast}>{toast}</div>}
            </div>
        </div>
    );
}

//  Styles
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












// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [toast, setToast] = useState("");
//     const router = useRouter();

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!email || !password) {
//             setToast("Please fill in all fields");
//             return;
//         }

//         setLoading(true);
//         setToast("");

//         try {
//             const res = await fetch("/api/auth/login", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email, password }),
//             });

//             const data = await res.json();

//             if (!res.ok) {
//                 setToast(data.error || "Invalid credentials");
//             } else {
//                 //  Save token to localStorage
//                 localStorage.setItem("token", data.token);

//                 setToast("Login successful!");
//                 setEmail("");
//                 setPassword("");

//                 // Redirect to dashboard
//                 setTimeout(() => {
//                     router.push("/dashboard");
//                 }, 1000);
//             }
//         } catch (err: any) {
//             setToast("Network error: " + err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div style={styles.wrapper}>
//             <div style={styles.card}>
//                 <h1 style={styles.heading}>Login</h1>
//                 <form onSubmit={handleSubmit} style={styles.form}>
//                     <input
//                         type="email"
//                         placeholder="Email"
//                         value={email}
//                         required
//                         onChange={(e) => setEmail(e.target.value)}
//                         style={styles.input}
//                     />
//                     <input
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         required
//                         onChange={(e) => setPassword(e.target.value)}
//                         style={styles.input}
//                     />
//                     <button type="submit" style={styles.button}>
//                         {loading ? "Logging in..." : "Login"}
//                     </button>
//                 </form>
//                 {toast && <div style={styles.toast}>{toast}</div>}
//             </div>
//         </div>
//     );
// }

// const styles: { [key: string]: React.CSSProperties } = {
//     wrapper: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" },
//     card: { padding: "30px", borderRadius: "12px", backgroundColor: "#fff", width: "100%", maxWidth: "400px" },
//     heading: { fontSize: "24px", marginBottom: "20px" },
//     form: { display: "flex", flexDirection: "column", gap: "15px" },
//     input: { padding: "10px", borderRadius: "8px", border: "1px solid #ccc" },
//     button: { padding: "12px", borderRadius: "8px", backgroundColor: "#2575fc", color: "#fff", fontWeight: "bold" },
//     toast: { marginTop: "15px", color: "red" },
// };
