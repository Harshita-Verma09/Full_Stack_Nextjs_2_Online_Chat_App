// src\app\group\GroupList\page.tsx

"use client";
import React from "react";
import styles from "./GroupList.module.css";

type Group = {
    id: string;
    groupName: string;
};

interface Props {
    groups: Group[];
    selectedGroupId: string | null;
    onSelect: (group: Group) => void;
    darkMode?: boolean; //  add darkMode prop
}

export default function GroupList({ groups, selectedGroupId, onSelect, darkMode }: Props) {
    return (
        <div className={`${styles.container} ${darkMode ? styles.dark : ""}`}>
            <h3 className={styles.title}>Your Groups</h3>
            {groups.length === 0 && <p className={styles.noGroups}>No groups found</p>}
            {groups.map((grp) => (
                <div
                    key={grp.id}
                    onClick={() => onSelect(grp)}
                    className={`${styles.groupItem} ${selectedGroupId === grp.id ? styles.selected : ""}`}
                >
                    {grp.groupName}
                </div>
            ))}
        </div>
    );
}
