import { useEffect, useRef, useState } from 'react'
import { AppButton } from '../Common/Button/AppButton'
import { TextInput } from '../Common/Input/Text/Text'
import styles from './LoginPage.module.scss'
import { GetUserIdFromLocalStorage, GetUserPasswordFromLocalStorage, setUserIdInLocalStorage, setUserPasswordInLocalStorage } from '../../services/Storage/LocalStorage'
import { LoginUser } from '../../services/Api/ApiCaller'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATHS } from '../../routesConfig'
import Loader from '../Common/Loader/Loader'
import AlertManager from '../Common/AlertBox/AlertManager'

export const LoginPage = () => {
    const navigate = useNavigate();

    const [enableBtn, setEnableBtn] = useState(false)
    const [userId, setUserId] = useState("")
    const [password, setPassword] = useState("")
    const [isChecked, setIsChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const alertManagerRef = useRef();
    function onUserNameChange(eve) {
        setUserId(eve?.target?.value ?? "")
    }
    function onPasswordChange(eve) {

        setPassword(eve?.target?.value ?? "")
    }
    useEffect(() => {
        let userIdFromLocalStorage = GetUserIdFromLocalStorage() ?? "";
        let passwordFromLocalStorage = GetUserPasswordFromLocalStorage() ?? "";
        setUserId(userIdFromLocalStorage)
        setPassword(passwordFromLocalStorage)
    }, [])

    useEffect(() => {
        const validate = () => {
            if (userId.trim().length !== 0 && password.trim().length !== 0) {
                setEnableBtn(true);
            } else {
                setEnableBtn(false);
            }
        };
        validate();
    }, [userId, password])


    async function loginClicked() {
        if (!enableBtn) {
            return
        }
        if (isChecked) {
            setLoginInfoInLocal()
        }
        setIsLoading(true)
        let loginStatus = await LoginUser(userId, password)
        setIsLoading(false)

        if (loginStatus?.success) {
            navigate(ROUTE_PATHS.LANDING)
        }
        else {
            // Something went wrong
            alertManagerRef.current.showAlert('Error', 'Something went wrong!', 5);
        }
    }

    function setLoginInfoInLocal() {
        setUserIdInLocalStorage(userId)
        setUserPasswordInLocalStorage(password)
    }

    const handleCheckboxChange = (event) => {
        setIsChecked(!isChecked);
    };
    return (
        <div className={styles.loginOuter}>
            <AlertManager ref={alertManagerRef} />
            <Loader isLoading={isLoading} />
            <div className={styles.title}>
                Tumor App
            </div>
            <div className={styles.LoginInp}>
                <TextInput value={userId} placeholder="User Id" onChange={onUserNameChange} />
                <div style={{ height: "10px" }}></div>
                <TextInput value={password} placeholder="Password" onChange={onPasswordChange} />
                <div style={{ height: "10px" }}></div>
                <div className={styles.customCheckbox}>
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        style={{ marginRight: '8px' }}
                    />
                    <span onClick={handleCheckboxChange} className={styles.remember}>
                        Remember me in this device

                    </span>
                </div>

                <div style={{ height: "10px" }}></div>
                <AppButton disable={!enableBtn} buttonStyle={{ width: "93%" }} label="Login" onclick={loginClicked} />
            </div>
        </div>)
}