import React from "react";

export const Switch = ({ value = false, onChange, disabled = false }) => {
  return (
    <div
      onClick={() => {
        if (!disabled && typeof onChange === "function") {
          onChange(!value);
        }
      }}
      style={{
        width: "52px",
        height: "28px",
        backgroundColor: value ? "#0388B4" : "#ced4da",
        borderRadius: "20px",
        padding: "3px",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: value ? "flex-end" : "flex-start",
        transition: "all 0.25s ease",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <div
        style={{
          width: "22px",
          height: "22px",
          background: "white",
          borderRadius: "50%",
          boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
          transition: "transform 0.25s ease",
        }}
      />
    </div>
  );
};
