// // src/app/page.tsx
// "use client";

// import { useState } from "react";

// export default function Home() {
//   const [showLogin, setShowLogin] = useState(false);
//   const [showRegister, setShowRegister] = useState(false);

//   return (
//     <div style={styles.container}>
//       <div style={styles.hero}>
//         <h1 style={styles.title}>Welcome to Chatify</h1>
//         <p style={styles.subtitle}>
//           Connect with friends instantly. Join now to start your conversations!
//         </p>

//         <div style={styles.buttonContainer}>
//           <button
//             style={styles.loginButton}
//             onClick={() => setShowLogin(true)}
//           >
//             Login
//           </button>
//           <button
//             style={styles.registerButton}
//             onClick={() => setShowRegister(true)}
//           >
//             Register
//           </button>
//         </div>
//       </div>

//       {showLogin && (
//         <div style={styles.modal}>
//           <h2>Login Form Placeholder</h2>
//           <p>Here will be your login form.</p>
//           <button onClick={() => setShowLogin(false)}>Close</button>
//         </div>
//       )}

//       {showRegister && (
//         <div style={styles.modal}>
//           <h2>Register Form Placeholder</h2>
//           <p>Here will be your register form.</p>
//           <button onClick={() => setShowRegister(false)}>Close</button>
//         </div>
//       )}
//     </div>
//   );
// }

// const styles: { [key: string]: React.CSSProperties } = {
//   container: {
//     fontFamily: "Arial, sans-serif",
//     textAlign: "center",
//     minHeight: "100vh",
//     color: "#fff",
//     // background: "linear-gradient(to right, #6a11cb, #2575fc)",
//     background: "linear-gradient(to right, #5000b8ff, #bd197bff)",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: "20px",
//   },
//   hero: {
//     maxWidth: "600px",
//   },
//   title: {
//     fontSize: "48px",
//     marginBottom: "20px",
//     fontWeight: "bold",
//   },
//   subtitle: {
//     fontSize: "20px",
//     marginBottom: "40px",
//   },
//   buttonContainer: {
//     display: "flex",
//     justifyContent: "center",
//     gap: "20px",
//   },
//   loginButton: {
//     padding: "15px 30px",
//     fontSize: "18px",
//     borderRadius: "8px",
//     border: "none",
//     backgroundColor: "#fff",
//     color: "#2575fc",
//     cursor: "pointer",
//     fontWeight: "bold",
//     transition: "transform 0.2s",
//   },
//   registerButton: {
//     padding: "15px 30px",
//     fontSize: "18px",
//     borderRadius: "8px",
//     border: "2px solid #fff",
//     backgroundColor: "transparent",
//     color: "#fff",
//     cursor: "pointer",
//     fontWeight: "bold",
//     transition: "transform 0.2s, background-color 0.2s",
//   },
//   modal: {
//     position: "fixed",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     backgroundColor: "#fff",
//     color: "#000",
//     padding: "30px",
//     borderRadius: "12px",
//     boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
//     zIndex: 1000,
//   },
// };












// src/app/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Welcome to Chatify</h1>
        <p style={styles.subtitle}>
          Connect with friends instantly. Join now to start your conversations!
        </p>

        <div style={styles.buttonContainer}>
          <button
            style={styles.loginButton}
            onClick={() => router.push("/auth/login")}
          >
            Login
          </button>
          <button
            style={styles.registerButton}
            onClick={() => router.push("/auth/register")}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    minHeight: "100vh",
    color: "#fff",
    background: "linear-gradient(to right, #5000b8ff, #bd197bff)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  hero: { maxWidth: "600px" },
  title: { fontSize: "48px", marginBottom: "20px", fontWeight: "bold" },
  subtitle: { fontSize: "20px", marginBottom: "40px" },
  buttonContainer: { display: "flex", justifyContent: "center", gap: "20px" },
  loginButton: {
    padding: "15px 30px",
    fontSize: "18px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#fff",
    color: "#2575fc",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "transform 0.2s",
  },
  registerButton: {
    padding: "15px 30px",
    fontSize: "18px",
    borderRadius: "8px",
    border: "2px solid #fff",
    backgroundColor: "transparent",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "transform 0.2s, background-color 0.2s",
  },
};
