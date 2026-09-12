import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  soft?: boolean;
};

export default function Card({
  soft = false,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={`${soft ? "molim-card-soft" : "molim-card"} ${className}`}
    >
      {children}
    </div>
  );
}