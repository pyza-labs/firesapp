import React, { useState, useEffect } from "react";
import "./App.css";
import Layout from "../../components/Layout/Layout";
import ChatWindow from "../ChatWindow/ChatWindow";
import Login from "../Login/Login";
import firebase from "../../services/firebase/firebase";

function App() {
  // const [isAccess = false, setIsAccess] = useState();
  const [user = "", setUser] = useState();

  const logoutHandler = () => {
    firebase
      .auth()
      .signOut()
      .then(function() {
        // Sign-out successful.
      })
      .catch(function(error) {
        // An error happened.
      });
    setUser("");
  };

  // Use Unsubscribe here :)
  useEffect(() => {
    const Unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser("");
      }
    });
    return Unsubscribe;
  }, []);

  return (
    <div className="App">
      <Layout>
        {user ? (
          <ChatWindow logout={logoutHandler} firebaseUser={user}></ChatWindow>
        ) : (
          <Login></Login>
        )}
      </Layout>
    </div>
  );
}

export default App;

// https://firebase.google.com/docs/auth/web/phone-auth
