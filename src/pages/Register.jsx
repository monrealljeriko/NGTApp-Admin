import React, { useState } from "react";
import { Button, Modal, Form, Input } from "antd";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(true); // Set initial state to false
  const navigate = useNavigate(); // Initialize navigate
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleOk = () => {
    /*  setIsModalOpen(false);
    navigate("/"); */
    // Redirect to the dashboard or any desired route using navigate
  };

  const handleCancel = () => {
    navigate("/"); // Redirect to the dashboard or any desired route using navigate

    setIsModalOpen(false);
  };

  return (
    <Modal
      title="Register Member Account"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Register"
      okButtonProps={{
        style: {
          backgroundColor: "#57708c",
          borderColor: "#57708c",
          marginRight: 25,
        },
      }}
      centered
    >
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{ marginTop: 20 }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Member ID"
          name="text"
          //  rules={[
          //    {
          //      required: true,
          //      message: "Please input your username!",
          //    },
          //  ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email Address"
          name="email"
          //  rules={[
          //    {
          //      required: true,
          //      message: "Please input your username!",
          //    },
          //  ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          //  rules={[
          //    {
          //      required: true,
          //      message: "Please input your password!",
          //    },
          //  ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default App;
