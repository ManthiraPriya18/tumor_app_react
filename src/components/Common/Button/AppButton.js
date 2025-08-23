import styles from './AppButton.module.scss'
export const AppButton = ({ label, onclick, buttonStyle, disable }) => {
    return (
        <div
            style={{
                ...buttonStyle,
                cursor: disable ? 'not-allowed' : 'pointer',
                opacity: disable ? 0.6 : 1
            }}
            onClick={!disable ? onclick : null}
            className={styles.appBtnOuter}
        >
            {label}
        </div>
    );
};
