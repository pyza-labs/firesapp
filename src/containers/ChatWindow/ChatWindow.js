import React, { useState, useEffect } from "react";
import Styles from "./ChatWindow.module.css";
import ChatBox from "../../components/ChatBox/ChatBox";
import MessagePanel from "../../components/MessagePanel/MessagePanel";
import { cloud } from "../../services/firebase/firebase";
import { Drawer, Avatar, Card } from "antd";

const ChatWindow = props => {
  const [chatSelect = false, setChatSelect] = useState();
  const [chatData = [], setChatData] = useState();
  const [visible = false, setVisible] = useState();
  const [userData = {}, setUserData] = useState();

  useEffect(() => {
    cloud
      .collection("users")
      .doc(props.firebaseUser.phoneNumber)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          setUserData({
            title: doc.data().title,
            status: doc.data().status,
            avatarSrc: doc.data().pictureUrl
          });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
  }, [props.firebaseUser.phoneNumber]);

  useEffect(() => {
    const unsubscribe = cloud
      .collection("chats")
      .where("chatMate", "array-contains", props.firebaseUser.phoneNumber)

      .onSnapshot(querySnapshot => {
        const chats = querySnapshot.docs.map(function(doc) {
          // doc.data() is never undefined for query doc snapshots

          return { id: doc.id, data: doc.data() };
        });
        console.log(chats);
        setChatData(chats);
      });
    return unsubscribe;
  }, [props.firebaseUser.phoneNumber]);

  const selectChatHandler = (selectData, index) => {
    setChatSelect(selectData);
  };
  const showDrawerHandler = () => {
    setVisible(true);
  };

  const onCloseHandler = () => {
    setVisible(false);
  };

  return (
    <div className={Styles.chatWindow}>
      {visible ? (
        <Drawer
          title="Profile"
          placement="left"
          closable={false}
          onClose={onCloseHandler}
          visible={visible}
          getContainer={false}
          style={{ position: "absolute", backgroundColor: "#e0e0e0" }}
        >
          <div className={Styles.profileContainer}>
            <div className={Styles.avatarContainer}>
              <Avatar src={userData.avatarSrc} size={128} shape="circle" />
            </div>
            <div className={Styles.nameContainer}>
              <span className={Styles.yourName}>Your Name</span>
              <span>{userData.title}</span>
            </div>
            <div className={Styles.infoText}>
              This is not your username or pin. This name will be visible to
              your WhatsApp contacts.
            </div>
            <div className={Styles.status}>
              <span className={Styles.yourName}>About</span>
              <span>{userData.status}</span>
            </div>
          </div>
        </Drawer>
      ) : (
        <ChatBox
          logout={props.logout}
          chatData={chatData}
          selectChat={selectChatHandler}
          firebaseUser={props.firebaseUser}
          showDrawer={showDrawerHandler}
          userData={userData}
        />
      )}
      {chatSelect ? (
        <MessagePanel firebaseUser={props.firebaseUser} chatData={chatSelect} />
      ) : (
        <div className={Styles.noMessageSelect}>
          <h2>Select a chat to view a conversation</h2>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
