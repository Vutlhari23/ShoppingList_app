import type { InputHTMLAttributes } from "react";
import styles from "./TextInput.module.css";

export const TextInput = ({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) => (
  <input className={`${styles.input} ${className ?? ""}`} {...rest} />
);