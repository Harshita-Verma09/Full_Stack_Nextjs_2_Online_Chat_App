// src/app/chat/SelectUserAnimation.tsx
"use client";

import React from "react";
import styles from "./SelectUserAnimation.module.css";

export default function SelectUserAnimation() {
  return (
    <div className={styles.container}>
      <div className={styles.monkey}>
        <span className={styles.hand}>✋</span>
      </div>
      <p>Select a user to start chat</p>
    </div>
  );
}



