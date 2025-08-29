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
            navigate(ROUTE_PATHS.HOME)
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
        <div
  className={styles.loginOuter}
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #000000, #0a0f0d, #001f1a)",
    animation: "bgMove 8s infinite alternate ease-in-out",
    color: "#05fa8a",
    fontSize: "18px",
    fontWeight: "500",
  }}
>
  <AlertManager ref={alertManagerRef} />
  <Loader isLoading={isLoading} />

  {/* Title */}
  <div
    className={styles.title}
    style={{
      fontSize: "36px",
      fontWeight: "700",
      marginBottom: "25px",
      color: "#05fa8a",
      textShadow: "0 0 15px #05fa8a",
    }}
  >
    Tumor App
  </div>

  {/* Login Box */}
  <div
    className={styles.LoginInp}
    style={{
      width: "100%",
      maxWidth: "400px",
      padding: "30px",
      borderRadius: "20px",
      background: "rgba(255,255,255,0.05)",
      boxShadow: "0 0 25px rgba(5,250,138,0.3)",
      display: "flex",
      flexDirection: "column",
    }}
  >
    {/* User ID */}
    <TextInput
      value={userId}
      placeholder="User Id"
      onChange={onUserNameChange}
      style={{
        padding: "15px",
        fontSize: "18px",
        borderRadius: "10px",
        border: "2px solid #05fa8a",
        marginBottom: "15px",
        width: "100%",
        color: "#05fa8a",
        background: "black",
      }}
    />

    {/* Password */}
    <TextInput
      value={password}
      placeholder="Password"
      onChange={onPasswordChange}
      style={{
        padding: "15px",
        fontSize: "18px",
        borderRadius: "10px",
        border: "2px solid #05fa8a",
        marginBottom: "15px",
        width: "100%",
        color: "#05fa8a",
        background: "black",
      }}
    />

    {/* Remember me */}
    <div
      className={styles.customCheckbox}
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "20px",
        fontSize: "16px",
      }}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        style={{
          marginRight: "8px",
          transform: "scale(1.3)",
          accentColor: "#05fa8a",
        }}
      />
      <span
        onClick={handleCheckboxChange}
        className={styles.remember}
        style={{
          cursor: "pointer",
          color: "#05fa8a",
        }}
      >
        Remember me in this device
      </span>
    </div>

    {/* Login Button */}
    <AppButton
      disable={!enableBtn}
      buttonStyle={{
        width: "100%", // 👈 fits exactly into the box
        padding: "15px",
        fontSize: "20px",
        fontWeight: "600",
        borderRadius: "12px",
        backgroundColor: "#05fa8a",
        color: "#000",
        transition: "all 0.3s ease",
        cursor: "pointer",
        boxSizing: "border-box", // ensures no overflow
      }}
      label="Login"
      onclick={loginClicked}
    />
  </div>

  {/* Background animation */}
  <style>
    {`
      @keyframes bgMove {
        0% { background-position: left top; }
        100% { background-position: right bottom; }
      }
    `}
  </style>
</div>
    )
}