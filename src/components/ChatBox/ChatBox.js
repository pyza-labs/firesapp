import React, { useState, useEffect } from "react";
import Styles from "./ChatBox.module.css";
import ChatItem from "../ChatItem/ChatItem";
import { Menu, Dropdown, Icon, Avatar, Input } from "antd";
import { cloud } from "../../services/firebase/firebase";
import moment from "moment";

const ChatBox = props => {
  const [text = "", setText] = useState();
  const menu = (
    <Menu>
      <Menu.Item onClick={props.logout} key="1">
        <Icon type="logout" />
        Logout
      </Menu.Item>
    </Menu>
  );

  const searchHandler = event => {
    setText(event.target.value);
  };

  return (
    <div className={Styles.chatBox}>
      <div className={Styles.nav}>
        <div className={Styles.chatHeader}>
          <Avatar
            className={Styles.avatar}
            src={props.userData.avatarSrc}
            onClick={props.showDrawer}
          />
          <div className={Styles.navSelect}>
            <Icon type="message"></Icon>
            <Dropdown overlay={menu}>
              <Icon type="more" className={Styles.dropdown}></Icon>
            </Dropdown>
          </div>
        </div>
      </div>
      <div className={Styles.search}>
        <Input
          placeholder="Search or Start a new chat"
          className={Styles.input}
          prefix={
            <Icon
              type="search"
              style={{ color: "rgba(0,0,0,.25)", marginLeft: "4px" }}
            />
          }
          onChange={searchHandler}
        />
      </div>
      <div className={Styles.ChatItemContainer}>
        {props.chatData
          .sort((arr1, arr2) => {
            return (
              (arr2.data.createdAt
                ? moment(arr2.data.createdAt.toDate())
                : moment()
              ).unix() -
              (arr1.data.createdAt
                ? moment(arr1.data.createdAt.toDate())
                : moment()
              ).unix()
            );
          })
          .map((arr, index) => {
            return (
              <ChatItem
                query={text}
                selectChat={() => props.selectChat(arr)}
                chatObj={arr.data}
                key={arr.id}
                firebaseUser={props.firebaseUser}
              />
            );
          })}
      </div>
    </div>
  );
};

export default ChatBox;
