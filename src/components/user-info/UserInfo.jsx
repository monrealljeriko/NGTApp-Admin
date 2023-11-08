import React, { useState } from "react";
import "./user-info.scss";
import { Input, Form } from "antd";
import { Dropdown, Modal } from "antd";

const UserInfo = ({ user }) => {
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(false);

  const items = [
    // {
    //   label: (
    //     <p
    //       style={{ margin: 0 }}
    //       onClick={() => handleNotifClick("Notification")}
    //     >
    //       Notifications
    //     </p>
    //   ),
    // },
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

  // const handleNotifClick = (menuItem) => {
  //   if (menuItem === "Notification") {
  //     setNotificationVisible(true);
  //   }
  // };
  const handleAnnounceClick = (menuItem) => {
    if (menuItem === "Announcement") {
    }
    setAnnouncementVisible(true);
  };

  const handleModalClose = () => {
    // setNotificationVisible(false);
    setAnnouncementVisible(false);
  };
  const handleSubmitAnnouncement = () => {
    <div>This is </div>;
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

      {/* <Modal
        title="Notifications"
        open={notificationVisible}
        onCancel={handleModalClose}
      > */}
      {/* You can put the content of your modal here */}
      {/* </Modal> */}
      <Modal
        title="Announcements"
        open={announcementVisible}
        onOk={() => handleSubmitAnnouncement()}
        onCancel={handleModalClose}
        okText="Add"
        okButtonProps={{
          style: {
            backgroundColor: "#57708c",
            borderColor: "#57708c",
          },
        }}
      >
        {/* You can put the content of your modal here */}
        <Form.Item name={["user", "website"]} label="Title">
          <Input />
        </Form.Item>
        <Form.Item name={["user", "introduction"]} label="Description">
          <Input.TextArea />
        </Form.Item>
      </Modal>
    </div>
  );
};

export default UserInfo;
