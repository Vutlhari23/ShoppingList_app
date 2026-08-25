
type ButtonProp ={
    className?:string,
    label?: React.ReactNode,
    onClick ?: () => void,
}

export const Button = ({className,label,onClick}: ButtonProp) => {
    return(
      <div>
          <button 
            className={className}
            onClick={onClick}
          >
          {label}
          </button>
        
      </div>
    )
}