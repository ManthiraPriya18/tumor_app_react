import { useEffect, useState } from 'react';
import styles from './Date.module.scss'
export const DateInput = ({ onDateChange, min, max, defaultDate, disabled, width }) => {
    const [date, setDate] = useState(defaultDate || '');
    let isFirstTime = false;
    useEffect(() => {
        console.log("DateInput", defaultDate)

        if (defaultDate) {
            onDateChange(defaultDate);
            setDate(defaultDate);
            isFirstTime = false;
        }
    }, [defaultDate]);

    const handleChange = (event) => {
        let newDate = event.target.value;
        // Enforce min and max date limits
        if (min && newDate < min) {
            newDate = min; // Set to min if under the limit
        } else if (max && newDate > max) {
            newDate = max; // Set to max if over the limit
        }
        onDateChange(newDate); // Call the parent callback with the updated date
        event.target.value = newDate;
        setDate(newDate)
    };
    return (<div>
        <input
            style={{ cursor: disabled ? "not-allowed" : "pointer", width: width ? width : null }}
            type="datetime-local"
            className={styles.customDateTimeInput}
            onChange={handleChange}
            min={min}
            max={max}
            value={date}
            disabled={disabled}
        />
    </div>)
}