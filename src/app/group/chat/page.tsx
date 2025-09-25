// // // src\app\group\chat\page.tsx

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GroupList from "../GroupList/page";
import ChatArea from "../ChatArea/page";
import AddUser from "../AddMember/page";
import RemoveUser from "../RemoveMember/page";
import { FiSun, FiMoon } from "react-icons/fi";
import styles from "./GroupChatPage.module.css";

type Group = {
  id: string;
  groupName: string;
  adminId?: string;
};

export default function GroupChatPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Toggle Dark/Light mode
  const toggleTheme = () => setDarkMode((prev) => !prev);

  // Decode JWT + fetch current user email
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) return router.push("/auth/login");
    setToken(t);

    try {
      const payload = JSON.parse(atob(t.split(".")[1]));
      setCurrentUserId(payload.userId);

      (async () => {
        const res = await fetch(`/api/user/${payload.userId}`);
        const data = await res.json();
        if (data?.email) setCurrentUserEmail(data.email);
      })();
    } catch {
      router.push("/auth/login");
    }
  }, [router]);

  // Fetch all groups for current user
  useEffect(() => {
    (async () => {
      if (!token) return;
      try {
        const res = await fetch("/api/chat/group/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setGroups(data.groups || []);
      } catch (err) {
        console.error("Error fetching groups:", err);
      }
    })();
  }, [token]);

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
      {/* Left Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/chat">
            <button className={styles.headerButton}>Back</button>
          </Link>
          <button onClick={toggleTheme} className={styles.headerButton}>
            {darkMode ? <FiMoon size={14} /> : <FiSun size={14} />}
          </button>
        </div>

        <GroupList
          groups={groups}
          selectedGroupId={selectedGroup?.id || null}
          onSelect={(grp) => setSelectedGroup(grp)}
          darkMode={darkMode}
        />
      </div>

      {/* Right Side */}
      {selectedGroup && currentUserId && token ? (
        <div className={styles.chatContainer}>
          {/* Admin Controls */}
          {selectedGroup.adminId === currentUserId && currentUserEmail && (
            <div className={styles.adminControls}>
              <AddUser
                chatId={selectedGroup.id}
                token={token}
                adminEmail={currentUserEmail}

              />
              <RemoveUser
                chatId={selectedGroup.id}
                token={token}
                adminEmail={currentUserEmail}

              />
            </div>
          )}

          {/* Chat Window */}
          <div className={styles.chatWindow}>
            <ChatArea
              selectedGroupId={selectedGroup.id}
              currentUserId={currentUserId}
              darkMode={darkMode}
            />
          </div>
        </div>
      ) : (
        <p style={{ textAlign: "center", marginTop: "50px" }}>
          Select a group to chat
        </p>
      )}
    </div>
  );
}
