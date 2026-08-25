import React from 'react'

type ContainerProp= {
    className?: string;
    style?: React.CSSProperties;
    children:React.ReactNode
}

export const ContentContainer = ({className,style,children}: ContainerProp) => {
  return (
    <div  className={className} style={style}>
        {children}
    </div>
  )
}

