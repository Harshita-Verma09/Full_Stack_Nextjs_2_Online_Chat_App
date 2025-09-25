// // src\app\group\RemoveMember\page.tsx

// "use client";
// import { useEffect, useState } from "react";

// interface Props {
//     chatId: string;
//     token: string;
//     adminEmail: string; // dynamic admin email
// }

// interface User {
//     id: string;
//     email: string;
// }

// export default function RemoveUser({ chatId, token, adminEmail }: Props) {
//     const [members, setMembers] = useState<User[]>([]);
//     const [selectedEmail, setSelectedEmail] = useState("");

//     // Fetch all group members
//     useEffect(() => {
//         (async () => {
//             if (!chatId || !token) return;
//             try {
//                 const res = await fetch(`/api/chat/group/remove?chatId=${chatId}`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 const data = await res.json();
//                 setMembers(data.members || []);
//             } catch (err) {
//                 console.error(err);
//             }
//         })();
//     }, [chatId, token]);

//     // Remove member
//     // const handleRemove = async () => {
//     //     if (!selectedEmail) return alert("Select a member to remove");

//     //     try {
//     //         const res = await fetch("/api/chat/group/remove", {
//     //             method: "POST",
//     //             headers: {
//     //                 "Content-Type": "application/json",
//     //                 Authorization: `Bearer ${token}`,
//     //             },
//     //             body: JSON.stringify({
//     //                 chatId,             //  send the chatId
//     //                 removeUserEmail: selectedEmail, //  send selected member
//     //                 adminEmail,
//     //                 console.log("📩 Remove API body:", body);
//     //                 console.log("📌 Chat found:", chat);
//     //                 console.log("👑 Admin:", adminUser);
//     //                 console.log("🙍 User to remove:", removeUser);
//     //                 //  send admin email dynamically
//     //             }),
//     //         });

//     //         const data = await res.json();
//     //         if (res.ok) {
//     //             alert("User removed successfully");
//     //             // update members list in UI
//     //             setMembers((prev) => prev.filter((m) => m.email !== selectedEmail));
//     //             setSelectedEmail("");
//     //         } else {
//     //             alert(data.error);
//     //         }
//     //     } catch (err) {
//     //         console.error(err);
//     //     }
//     // };

//     const handleRemove = async () => {
//         if (!selectedEmail) return alert("Select a member to remove");

//         try {
//             const body = {
//                 chatId,                        //  send the chatId
//                 removeUserEmail: selectedEmail, //  send selected member
//                 adminEmail,                     //  send admin email dynamically
//             };

//             console.log("📩 Remove API body (frontend):", body);

//             const res = await fetch("/api/chat/group/remove", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                 },
//                 body: JSON.stringify(body),
//             });

//             const data = await res.json();
//             if (res.ok) {
//                 alert("User removed successfully");
//                 // update members list in UI
//                 setMembers((prev) => prev.filter((m) => m.email !== selectedEmail));
//                 setSelectedEmail("");
//             } else {
//                 alert(data.error);
//             }
//         } catch (err) {
//             console.error("❌ Error removing user:", err);
//         }
//     };

//     return (
//         <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//             <select value={selectedEmail} onChange={(e) => setSelectedEmail(e.target.value)}>
//                 <option value="">Select member</option>
//                 {members.map((m) => (
//                     <option key={m.id} value={m.email}>
//                         {m.email}
//                     </option>
//                 ))}
//             </select>
//             <button
//                 onClick={handleRemove}
//                 style={{ padding: "5px 10px", cursor: "pointer" }}
//             >
//                 Remove
//             </button>
//         </div>
//     );
// }












"use client";
import { useEffect, useState } from "react";
import styles from "./RemoveMember.module.css";

interface Props {
    chatId: string;
    token: string;
    adminEmail: string;
}

interface User {
    id: string;
    email: string;
}

export default function RemoveUser({ chatId, token, adminEmail }: Props) {
    const [members, setMembers] = useState<User[]>([]);
    const [selectedEmail, setSelectedEmail] = useState("");
    const [darkMode, setDarkMode] = useState(false);

    // Fetch members
    useEffect(() => {
        (async () => {
            if (!chatId || !token) return;
            try {
                const res = await fetch(`/api/chat/group/remove?chatId=${chatId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setMembers(data.members || []);
            } catch (err) {
                console.error(err);
            }
        })();
    }, [chatId, token]);

    const handleRemove = async () => {
        if (!selectedEmail) return alert("Select a member to remove");

        try {
            const body = { chatId, removeUserEmail: selectedEmail, adminEmail };
            const res = await fetch("/api/chat/group/remove", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (res.ok) {
                alert("User removed successfully");
                setMembers((prev) => prev.filter((m) => m.email !== selectedEmail));
                setSelectedEmail("");
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error("❌ Error removing user:", err);
        }
    };

    return (
        <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
            <select
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
                className={styles.select}
            >
                <option value="">Select member</option>
                {members.map((m) => (
                    <option key={m.id} value={m.email}>
                        {m.email}
                    </option>
                ))}
            </select>
            <button onClick={handleRemove} className={styles.button}>
                Remove
            </button>
        </div>
    );
}
