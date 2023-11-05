import React, { useEffect, useState } from "react";
import "./sidebar.scss";
import { Link, useLocation } from "react-router-dom";
import { images } from "../../constants";
import sidebarNav from "../../configs/sidebarNav";
import { FIREBASE_AUTH } from "../../configs/firebaseConfig";
import { Modal } from "antd";

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const location = useLocation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const curPath = window.location.pathname.split("/")[1];
    const activeItem = sidebarNav.findIndex((item) => item.section === curPath);

    setActiveIndex(curPath.length === 0 ? 0 : activeItem);
  }, [location]);

  const closeSidebar = () => {
    document.querySelector(".main__content").style.transform =
      "scale(1) translateX(0)";
    setTimeout(() => {
      document.body.classList.remove("sidebar-open");
      document.querySelector(".main__content").style = "";
    }, 500);
  };

  const handleSignOut = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      // Navigate to the "Login" screen
    } catch (error) {
      console.error("Sign-out error: ", error);
    }
  };

  // Function to handle the modal's visibility
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Function to handle the modal's cancel action
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Function to handle the modal's OK action
  const handleOk = () => {
    // Perform the action you want when the user clicks OK
    // For example, display a success message or submit a form
    handleSignOut();
    setIsModalVisible(false);
  };

  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <img src={images.logo} alt="" />
        <div className="sidebar-close" onClick={closeSidebar}>
          <i className="bx bx-x"></i>
        </div>
      </div>
      <div className="sidebar__menu">
        {sidebarNav.map((nav, index) => (
          <Link
            to={nav.link}
            key={`nav-${index}`}
            className={`sidebar__menu__item ${
              activeIndex === index && "active"
            }`}
            onClick={closeSidebar}
          >
            <div className="sidebar__menu__item__icon">{nav.icon}</div>
            <div className="sidebar__menu__item__txt">{nav.text}</div>
          </Link>
        ))}
        <div className="sidebar__menu__item" onClick={() => showModal()}>
          <div className="sidebar__menu__item__icon">
            <i className="bx bx-log-out"></i>
          </div>
          <div className="sidebar__menu__item__txt">Logout</div>
        </div>
      </div>
      <Modal
        title="Are you sure want to log out"
        open={isModalVisible}
        width={300}
        centered
        okButtonProps={{
          style: {
            backgroundColor: "#57708c",
            borderColor: "#57708c",
          },
        }}
        okText="Confirm"
        onOk={handleOk}
        onCancel={handleCancel}
      ></Modal>
    </div>
  );
};

export default Sidebar;
