import styles from './Text.module.scss'
export const TextInput = ({ type, placeholder, value, defaultValue, onChange, disabled }) => {
    return (<div>
        <input
            defaultValue={defaultValue}
            type={type}
            className={styles.textBox}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
        />
    </div>)
}