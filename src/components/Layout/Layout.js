import React from "react";
import Styles from "./Layout.module.css";

const Layout = props => {
  return (
    <div className={Styles.layout}>
      <nav className={Styles.nav}></nav>
      <div className={Styles.box}>{props.children}</div>
    </div>
  );
};

export default Layout;
