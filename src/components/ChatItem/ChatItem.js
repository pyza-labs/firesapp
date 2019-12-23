import React, { useState, useEffect } from "react";
import Styles from "./ChatItem.module.css";
import { Avatar } from "antd";
import moment from "moment";
import { cloud } from "../../services/firebase/firebase";

const ChatArray = props => {
  const [contactData = {}, setContactData] = useState();
  useEffect(() => {
    const docId = props.chatObj.chatMate.filter(phone => {
      return phone !== props.firebaseUser.phoneNumber;
    });

    cloud
      .collection("users")
      .doc(docId.toString())
      .get()
      .then(doc => {
        setContactData(doc.data());
      });
  }, [props.chatObj, props.firebaseUser.phoneNumber]);

  if (
    contactData.title &&
    props.query &&
    props.query.length !== 0 &&
    !contactData.title.toLowerCase().includes(props.query.toLowerCase())
  ) {
    return null;
  }

  return (
    <div className={Styles.chatArray} onClick={props.selectChat}>
      <div className={Styles.avatar}>
        <Avatar src={contactData.pictureUrl} />
        <div className={Styles.nameDiv}>
          <span className={Styles.name}>{contactData.title}</span>
          <span className={Styles.message}>{props.chatObj.lastMessage}</span>
        </div>
      </div>
      <div className={Styles.badgeTime}>
        <span className={Styles.time}>
          {props.chatObj.createdAt
            ? moment(props.chatObj.createdAt.toDate()).format("LT")
            : moment().format("LT")}
        </span>
      </div>
    </div>
  );
};

export default ChatArray;
