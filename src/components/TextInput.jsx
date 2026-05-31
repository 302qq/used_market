import React from "react";

export default function TextInput({ label, help, error, className = "", ...props }) {
  return (
    <label className={`field ${className}`.trim()}>
      <span>{label}</span>
      <input {...props} />
      {help && !error ? <small>{help}</small> : null}
      {error ? <strong className="fieldError">{error}</strong> : null}
    </label>
  );
}
