"use client";

import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline";
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "molim-button-primary",
    secondary: "molim-button-secondary",
    outline: "molim-button-outline",
  };

  return (
    <button
      {...props}
      className={`${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}