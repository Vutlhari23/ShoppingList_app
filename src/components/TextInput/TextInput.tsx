import React  from 'react'
import styles from  './TextInput.module.css'

type TextInputProps ={

    id? :string,
    type: string,
    value? : string | number,
    onChange ? :React.ChangeEventHandler<HTMLInputElement>,
    className?: string,
    label?: string,
    error?:string,
    name?:string,
    placeholder? :string,

}

export const TextInput : React.FC<TextInputProps> =({value,onChange,label,error,placeholder})=>{
    return(

        <div className={styles['input-container']}>
            <label className={styles['input-label']}>{label}</label>
            <input type='text'  value={value} onChange={onChange} className={styles.input} placeholder={placeholder}></input>
            {error && <span className={styles['input-error']}>{error}</span>}
        </div>
    )



}