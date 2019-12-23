import React, { useState, useEffect, useRef } from "react";
import Styles from "./MessagePanel.module.css";
import { Avatar, Icon, Tooltip, Input, Drawer } from "antd";
import moment from "moment";
import firebase, { cloud } from "../../services/firebase/firebase";

const MessagePanel = props => {
  const scrollRef = useRef(null);

  const [text = " ", setText] = useState();
  const [contactData = {}, setContactData] = useState();
  const [messages = [], setMessages] = useState();
  const [visible = false, setVisible] = useState();

  useEffect(() => {
    if (!props.chatData.id) {
      return;
    }
    const unsubscribe = cloud
      .collection("chats")
      .doc(props.chatData.id)
      .collection("messages")
      //For realTime listening we use onSnapshot in place of .get().then(fxn)
      .onSnapshot(querySnapshot => {
        const message = querySnapshot.docs.map(doc => {
          // doc.data() is never undefined for query doc snapshots
          return doc.data();
        });
        setMessages(message);
      });

    return unsubscribe;
  }, [props.chatData.id]);

  useEffect(() => {
    if (!props.chatData.data) {
      return;
    } else {
      const docId = props.chatData.data.chatMate.filter(phone => {
        return phone !== props.firebaseUser.phoneNumber;
      });
      cloud
        .collection("users")
        .doc(docId.toString())
        .get()
        .then(doc => {
          setContactData(doc.data());
        });
    }
  }, [props.user, props.firebaseUser.phoneNumber, props.chatData]);

  useEffect(() => scrollRef.current.scrollIntoView());

  const textMessageHandler = event => {
    setText(event.target.value);
  };

  const showDrawerHandler = () => {
    setVisible(true);
  };

  const onCloseHandler = () => {
    setVisible(false);
  };

  const sendMessageHandler = () => {
    if (text) {
      cloud
        .collection("chats")
        .doc(props.chatData.id)
        .collection("messages")
        .add({
          message: text,
          sentBy: props.firebaseUser.phoneNumber,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });

      cloud
        .collection("chats")
        .doc(props.chatData.id)
        .update({
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          lastMessage: text
        });

      setText("");
    }
  };

  const sections = messages
    .filter(message => !!message.createdAt)
    .reduce((accumulator, currentVal) => {
      let key = moment(currentVal.createdAt.toDate()).format("LL");
      console.log(key);
      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      accumulator[key].push(currentVal);
      return accumulator;
    }, {});

  const messageArray =
    sections &&
    Object.entries(sections)
      .sort(([a], [b]) => {
        return moment(a).unix() - moment(b).unix();
      })
      .map(([sectionName, messages]) => {
        return (
          <div className={Styles.messages}>
            <div className={Styles.sectionName}>{sectionName}</div>
            {messages
              .sort(
                (a, b) =>
                  moment(a.createdAt.toDate()).unix() -
                  moment(b.createdAt.toDate()).unix()
              )
              .map((message, index) => {
                return (
                  <div
                    className={
                      message.sentBy === props.firebaseUser.phoneNumber
                        ? Styles.sendMessage
                        : Styles.receiveMessage
                    }
                    key={index.toString()}
                  >
                    <span>{message.message}</span>
                    <span className={Styles.time}>
                      {message.createdAt &&
                        moment(message.createdAt.toDate()).format("LT")}
                    </span>
                  </div>
                );
              })}
          </div>
        );
      });

  return (
    <div className={Styles.messagePanel}>
      {visible && (
        <Drawer
          title="Profile"
          placement="right"
          closable={false}
          onClose={onCloseHandler}
          visible={visible}
          getContainer={false}
          style={{ position: "absolute", backgroundColor: "#e0e0e0" }}
        >
          <div className={Styles.profileContainer}>
            <div className={Styles.avatarContainer}>
              <Avatar src={contactData.pictureUrl} size={128} shape="circle" />
            </div>
            <div className={Styles.nameContainer}>
              <span>{contactData.title}</span>
            </div>
            <div className={Styles.status}>
              <span className={Styles.yourName}>About & Phone Number</span>
              <span className={Styles.about}>{contactData.status}</span>
              <span className={Styles.about}>{contactData.phoneNo}</span>
            </div>
          </div>
        </Drawer>
      )}
      <div className={Styles.nav} onClick={showDrawerHandler}>
        <div className={Styles.messageHeader}>
          <Avatar className={Styles.avatar} src={contactData.pictureUrl} />
          <span>{contactData.title}</span>
        </div>
      </div>
      <div className={Styles.background}>
        {messageArray}
        <div ref={scrollRef}></div>
      </div>
      <div className={Styles.input}>
        <Input
          placeholder="Type a message"
          suffix={
            <Tooltip title="Extra information">
              <Icon
                type="right-circle"
                theme="filled"
                onClick={sendMessageHandler}
              />
            </Tooltip>
          }
          value={text}
          onChange={textMessageHandler}
          onPressEnter={sendMessageHandler}
        />
      </div>
    </div>
  );
};

export default MessagePanel;
