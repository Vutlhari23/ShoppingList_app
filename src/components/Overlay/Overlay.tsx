import type React from "react"
import styles from "../Overlay/Overlay.module.css"

type OverlayProps= {
  children : React.ReactNode;
  onClose?: () =>void;
}
export const Overlay = ({children,onClose}: OverlayProps) => {



  return (
    
<div className={styles["overlay"]} onClick={onClose} >
  {children}


</div>
  )
}
