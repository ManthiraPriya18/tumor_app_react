import { useEffect, useState } from "react";
import styles from './LandingPage.module.scss'
import { AppButton } from "../Common/Button/AppButton";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../routesConfig";
import { GetUserDetails } from "../../services/Storage/LocalStorage";
export const LandingPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.addEventListener('error', e => {
      if (e.message.startsWith('ResizeObserver loop')) {
        // console.warn('ResizeObserver error occured, and supressed by error listener')
        const resizeObserverErrDiv = document.getElementById(
          'webpack-dev-server-client-overlay-div'
        );
        const resizeObserverErr = document.getElementById(
          'webpack-dev-server-client-overlay'
        );
        if (resizeObserverErr) {
          resizeObserverErr.setAttribute('style', 'display: none');
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.setAttribute('style', 'display: none');
        }
      }
    });
  }, []);

  let expenseTrackerTile = {
    title: "Expense Tracker",
    desc: "The Expense Tracker app helps you easily manage and track your daily spending. With a simple interface, you can add expenses, categorize them, and monitor your budget to gain a clear view of your financial habits. Set spending limits, view summaries, and make better financial decisions by staying organized. Perfect for anyone looking to keep their finances on track!",
    route: ROUTE_PATHS.EXPENSE_TRACKER
  }
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  useEffect(() => {
    let userDetails = GetUserDetails();
    if (userDetails == null) {
      setIsUserLoggedIn(false)
      setUserName("")
    }
    else {
      setIsUserLoggedIn(true)
      setUserName("Welcome "+userDetails?.userName)
    }
  },[])
  return (
    <div>Manthra</div>)
}

export const AppTile = ({ tileConfig }) => {
  const navigate = useNavigate();
  return (
    <div onClick={() => { navigate(tileConfig.route) }} className={styles.tileOuter}>
      <div className={styles.tileTitle} >
        {tileConfig?.title || ""}
      </div>
      <div className={styles.tileDesc}>
        {tileConfig?.desc || ""}

      </div>

    </div>)
}