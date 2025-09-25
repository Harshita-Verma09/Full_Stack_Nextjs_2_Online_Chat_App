// src/app/chat/UserList/page.tsx
type User = { id: string; email: string };

interface Props {
    users?: User[];
    selectedUser: User | null;
    onUserClick: (user: User) => void;
    onlineUsers?: string[];
    darkMode?: boolean;
}

export default function UserList({ users = [], selectedUser, onUserClick, onlineUsers = [], darkMode = false }: Props) {
    return (
        <div
            style={{
                width: "25%",
                padding: "1rem",
                color: darkMode ? "#ffffffff" : "#000000ff",             // Dark/light text
            }}
        >
            <h2
                style={{
                    marginBottom: "1rem",
                    fontSize: "1.65rem",
                    fontWeight: "bold",
                    color: darkMode ? "#ffffff" : "#000000",
                    borderBottom: darkMode ? "1px solid #333" : "1px solid #ccc",
                    paddingBottom: "0.5rem",
                    paddingLeft: "1.5rem"
                }}
            >
                Users
            </h2>

            {users.map((user) => (
                <div
                    key={user.id}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "0.5rem",
                        cursor: "pointer",
                        borderBottom: selectedUser?.id === user.id ? "2px solid #a141f0" : "2px solid transparent",
                        borderLeft: selectedUser?.id === user.id ? "2px solid #a141f0" : "2px solid transparent",
                        // borderTop: selectedUser?.id === user.id ? "2px solid #a141f0" : "2px solid transparent",
                        borderRight: "2px solid transparent",
                        borderRadius: "6px",
                        marginBottom: "4px",
                        fontSize: "1.2rem",

                    }}
                    onClick={() => onUserClick(user)}
                >
                    <span
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor: onlineUsers.includes(user.id) ? "green" : "transparent",
                            marginRight: 8,
                        }}
                    />
                    {user.email}
                </div>
            ))}
        </div>
    );
}
