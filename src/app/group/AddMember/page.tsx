// // src\app\group\AddMember\page.tsx

// "use client";
// import { useEffect, useState } from "react";

// interface Props {
//   chatId: string;
//   token: string;
//   adminEmail: string;
// }

// interface User {
//   id: string;
//   email: string;
// }

// export default function AddUser({ chatId, token, adminEmail }: Props) {
//   const [availableUsers, setAvailableUsers] = useState<User[]>([]);
//   const [selectedEmail, setSelectedEmail] = useState("");

//   // Fetch all users and filter out those already in the group
//   useEffect(() => {
//     (async () => {
//       if (!chatId || !token) return;

//       try {
//         // Fetch all users
//         const resAll = await fetch("/api/user/all", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const dataAll = await resAll.json();
//         const allUsers: User[] = dataAll.users || [];

//         // Fetch current group participants
//         const resGroup = await fetch(`/api/chat/group/remove?chatId=${chatId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const dataGroup = await resGroup.json();
//         const groupMembers: User[] = dataGroup.members || [];

//         // Filter out users who are already in the group
//         const filteredUsers = allUsers.filter(
//           (u) => !groupMembers.find((m) => m.id === u.id)
//         );

//         setAvailableUsers(filteredUsers);
//       } catch (err) {
//         console.error("❌ Error fetching users:", err);
//       }
//     })();
//   }, [chatId, token]);

//   // Add selected user to group
//   const handleAdd = async () => {
//     if (!selectedEmail) return alert("Select a user to add");

//     try {
//       const body = { chatId, newUserEmail: selectedEmail, adminEmail };
//       console.log("📩 Add API body (frontend):", body);

//       const res = await fetch("/api/chat/group/add", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(body),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         alert("User added successfully!");
//         // Remove added user from dropdown
//         setAvailableUsers((prev) => prev.filter((u) => u.email !== selectedEmail));
//         setSelectedEmail("");
//       } else {
//         alert(data.error || "Failed to add user");
//       }
//     } catch (err) {
//       console.error("❌ Error adding user:", err);
//     }
//   };

//   return (
//     <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//       <select value={selectedEmail} onChange={(e) => setSelectedEmail(e.target.value)}>
//         <option value="">Select user</option>
//         {availableUsers.map((u) => (
//           <option key={u.id} value={u.email}>
//             {u.email}
//           </option>
//         ))}
//       </select>
//       <button onClick={handleAdd} style={{ padding: "5px 10px", cursor: "pointer" }}>
//         Add
//       </button>
//     </div>
//   );
// }














"use client";
import { useEffect, useState } from "react";
import styles from "./AddMember.module.css";

interface Props {
  chatId: string;
  token: string;
  adminEmail: string;
}

interface User {
  id: string;
  email: string;
}

export default function AddUser({ chatId, token, adminEmail }: Props) {
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    (async () => {
      if (!chatId || !token) return;

      try {
        const resAll = await fetch("/api/user/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataAll = await resAll.json();
        const allUsers: User[] = dataAll.users || [];

        const resGroup = await fetch(`/api/chat/group/remove?chatId=${chatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataGroup = await resGroup.json();
        const groupMembers: User[] = dataGroup.members || [];

        const filteredUsers = allUsers.filter(
          (u) => !groupMembers.find((m) => m.id === u.id)
        );

        setAvailableUsers(filteredUsers);
      } catch (err) {
        console.error("❌ Error fetching users:", err);
      }
    })();
  }, [chatId, token]);

  const handleAdd = async () => {
    if (!selectedEmail) return alert("Select a user to add");

    try {
      const body = { chatId, newUserEmail: selectedEmail, adminEmail };
      const res = await fetch("/api/chat/group/add", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        alert("User added successfully!");
        setAvailableUsers((prev) => prev.filter((u) => u.email !== selectedEmail));
        setSelectedEmail("");
      } else {
        alert(data.error || "Failed to add user");
      }
    } catch (err) {
      console.error("❌ Error adding user:", err);
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
        {availableUsers.map((u) => (
          <option key={u.id} value={u.email}>
            {u.email}
          </option>
        ))}
      </select>
      <button onClick={handleAdd} className={styles.button}>
        Add
      </button>
    </div>
  );
}
