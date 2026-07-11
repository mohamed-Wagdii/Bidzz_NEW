import React from "react";

export default function FormInput({
  label,
  icon,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  wrapStyle,
  inputStyle,
  iconStyle,
  showToggle,
  onToggle,
  eyeBtnStyle,
  inputProps = {},
}) {
  return (
    <div>
      {label}
      <div style={wrapStyle}>
        {icon && <span style={iconStyle}>{icon}</span>}
        <input
          style={inputStyle}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...inputProps}
        />
        {showToggle && (
          <button type="button" style={eyeBtnStyle} onClick={onToggle}>
            {inputProps && inputProps.type === "text" ? "🙈" : "👁"}
          </button>
        )}
      </div>
    </div>
  );
}
