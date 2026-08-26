import React from 'react'


type TextProps ={
 
    variant ?: string,
    children : React.ReactNode,
    style?: React.CSSProperties,
    className?:string

}

export const Text = ({variant,children,style,className}: TextProps) =>{
    if(variant==='h1')   return <h1  style={style} className={className}>{children}</h1>
    if(variant==='h2') return <h2 style={style} className={className}>{children}</h2>
    if(variant==='h3') return <h3 style={style} className={className}>{children}</h3>
    if(variant==='h4')  return <h4 style={ style} className={className}>{children}</h4>
    if(variant==='h6') return <h6 style={style} className={className}>{children}</h6>
    if(variant==='h5')  return <h5 style={ style} className={className}>{children}</h5>
    if(variant==='p') return <p style={style} className={className}>{children}</p>
    if(variant==='span')  return <span style={ style} className={className}>{children}</span>


    return (

        <div style={style} className={className} >
            {children}
        </div>
    )
}
