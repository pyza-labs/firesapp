import React, { Fragment, useState } from "react";
import Styles from "./Login.module.css";
import { Input, Button } from "antd";
import { Icon } from "antd";
import firebase, { auth } from "../../services/firebase/firebase";

const Login = props => {
  const [phoneNo = 0, setPhoneNo] = useState();
  const [pass = "", setPass] = useState();
  const [showLogin = false, setshowLogin] = useState();

  const phoneHandler = event => {
    setPhoneNo(event.target.value);
  };

  const passHandler = event => {
    setPass(event.target.value);
  };

  const otpHandler = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "normal",
        callback: response => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // ...
        },
        "expired-callback": () => {
          alert("OTP expired");
        }
      }
    );
    var appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNo, appVerifier)
      .then(confirmationResult => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        alert("OTP Sent 😊");
        setshowLogin(true);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const loginHandler = () => {
    window.confirmationResult
      .confirm(pass)
      .then(result => {
        // User signed in successfully.
        // var user = result.user;
        // props.isAccess(true);
      })
      .catch(error => {
        // User couldn't sign in (bad verification code?)
        console.log("Bad Verification Code");
        alert("Wrong OTP 😥");
      });
  };

  return (
    <Fragment>
      <div className={Styles.nav}>
        <div className={Styles.loginNav}>
          <h2>Firesapp</h2>
        </div>
      </div>
      <div className={Styles.welcome}>
        <h1>
          Welcome To Fire <Icon type="wechat" />
        </h1>
      </div>
      <div className={Styles.login}>
        {!showLogin ? (
          <Input
            placeholder="Phone Number with Country Code Please"
            className={Styles.input}
            onChange={phoneHandler}
          />
        ) : (
          <Input.Password
            placeholder="OTP"
            className={Styles.input}
            onChange={passHandler}
          />
        )}
        <div className={Styles.buttonDiv}>
          {!showLogin ? (
            <Button className={Styles.button} onClick={otpHandler}>
              Receive OTP
            </Button>
          ) : (
            <Button className={Styles.button} onClick={loginHandler}>
              Login
            </Button>
          )}
        </div>
        <div id="recaptcha-container"></div>
      </div>
    </Fragment>
  );
};
export default Login;

// story
// statistc
// share
