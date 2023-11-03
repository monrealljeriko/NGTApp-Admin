import React, { useState } from "react";
import "./user-info.scss";
import { Dropdown, Button, Menu, Modal } from "antd";

const UserInfo = ({ user }) => {
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(false);

  const items = [
    {
      label: (
        <p
          style={{ margin: 0 }}
          onClick={() => handleNotifClick("Notification")}
        >
          Notifications
        </p>
      ),
    },
    {
      label: (
        <p
          style={{ margin: 0 }}
          onClick={() => handleAnnounceClick("Announcement")}
        >
          Announcement
        </p>
      ),
    },
  ];

  /*   const menu = (
    <Menu>
      <Menu.Item
        key="Notification"
        onClick={() => handleNotifClick("Notification")}
      >
        Notifications
      </Menu.Item>
      <Menu.Item
        key="Announcement"
        onClick={() => handleAnnounceClick("Announcement")}
      >
        Announcement
      </Menu.Item>
    </Menu>
  ); */

  const handleNotifClick = (menuItem) => {
    if (menuItem === "Notification") {
      setNotificationVisible(true);
    }
  };
  const handleAnnounceClick = (menuItem) => {
    if (menuItem === "Announcement") {
    }
    setAnnouncementVisible(true);
  };

  const handleModalClose = () => {
    setNotificationVisible(false);
    setAnnouncementVisible(false);
  };

  return (
    <div className="user-info">
      <div className="user-info__img">
        <img src={user.img} alt="" />
      </div>
      <div className="user-info__name">
        <span>{user.name}</span>
      </div>
      <div className="user-info__name">
        <Dropdown menu={{ items }} trigger={["click"]}>
          <span>{user.icon}</span>
        </Dropdown>
      </div>

      <Modal
        title="Notifications"
        open={notificationVisible}
        onCancel={handleModalClose}
      >
        {/* You can put the content of your modal here */}
        <p>This is the content of the modal triggered by Notification.</p>
      </Modal>
      <Modal
        title="Announcements"
        open={announcementVisible}
        onCancel={handleModalClose}
      >
        {/* You can put the content of your modal here */}
        <p>This is the content of the modal triggered by Announcement</p>
      </Modal>
    </div>
  );
};

export default UserInfo;
