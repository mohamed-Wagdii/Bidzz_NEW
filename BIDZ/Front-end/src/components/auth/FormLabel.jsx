import React from "react";

export default function FormLabel({ children, style, ...rest }) {
  return (
    <label style={style} {...rest}>
      {children}
    </label>
  );
}
