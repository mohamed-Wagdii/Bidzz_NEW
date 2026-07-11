import React from "react";

export default function SubmitButton({ children, disabled, style, type = "submit" }) {
  return (
    <button type={type} style={style} disabled={disabled}>
      {children}
    </button>
  );
}
