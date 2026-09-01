import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

type ButtonProps = {
  label: string;
  variant?: "default" | "primary" | "danger" | "ghost";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  label,
  variant = "default",
  className,
  ...rest
}: ButtonProps) => {
  const variantClass =
    variant !== "default" ? styles[variant] : "";

  return (
    <button
      className={[styles.button, variantClass, className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {label}
    </button>
  );
};
