import styles from './TextInput.module.css'

type InputTextProps = {
    type?: string,
    id?: string,
    placeholder?: string,
    value?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    style?: React.CSSProperties,
    className?: string,
    label?: string,
    error?: string,
    name?: string,
    disabled?: boolean
    
}

export const TextInput = ({ id, placeholder, onChange, value, style, className, label, error, name, type = "text", disabled = false }: InputTextProps) => {

    const inputClass = `${styles.input} ${className || ''}`.trim();

    return (
        <div className={styles.inputGroup}>
            {label && <label className={styles.label} htmlFor={id}>{label}</label>}
            <input
                type={type}
                id={id}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                style={style}
                className={inputClass}
                disabled={disabled}
            />
            {error && <span className={styles['input-error']}>{error}</span>}
        </div>
    )
}