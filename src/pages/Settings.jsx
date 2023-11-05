import React, { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import { Spin } from "antd";
import {
  getAuth,
  updatePassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Settings = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  const navigate = useNavigate();

  const updatePasswordAsync = async (currentPassword, newPassword) => {
    try {
      const user = auth.currentUser;
      // Sign in the user with their current password before updating the password
      await signInWithEmailAndPassword(auth, user.email, currentPassword);
      // Update the password
      await updatePassword(user, newPassword);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handlePasswordUpdate = async () => {
    setLoading(true);

    if (!currentPassword || !newPassword || !confirmPassword) {
      message.error("Please fill in all the required fields.");
    } else if (newPassword !== confirmPassword) {
      message.error("New passwords do not match.");
    } else if (confirmPassword.length < 6 || newPassword.length < 6) {
      message.error("Password must be at least 6 characters long.");
    } else if (
      confirmPassword === currentPassword ||
      newPassword === currentPassword
    ) {
      message.error("Password already in use.");
    } else {
      const result = await updatePasswordAsync(currentPassword, newPassword);

      if (result.success) {
        // Password update was successful
        message.success("Password updated successfully.");
        setIsModalOpen(false);
        navigate("/members");
      } else {
        // Password update failed
        message.error("Current password does not match.");
      }
    }

    setLoading(false); // Set loading to false
  };
  const handleCancel = () => {
    navigate("/");

    setIsModalOpen(false);
  };

  return (
    <Modal
      title="Update Admin Account"
      open={isModalOpen}
      onOk={() => handlePasswordUpdate()}
      onCancel={handleCancel}
      okText="Update"
      okButtonProps={{
        style: {
          backgroundColor:
            !currentPassword || !newPassword || !confirmPassword
              ? ""
              : "#57708c",
          borderColor:
            !currentPassword || !newPassword || !confirmPassword
              ? ""
              : "#57708c",
          marginRight: 25,
        },
        disabled: !currentPassword || !newPassword || !confirmPassword,
      }}
      centered
    >
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin size="middle" />
        </div>
      ) : (
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{ marginTop: 20 }}
          autoComplete="off"
        >
          <Form.Item label="Current Password" name="current">
            <Input.Password
              value={currentPassword}
              required
              placeholder="Enter current password"
              onChangeCapture={(e) => setCurrentPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="New Password" name="new">
            <Input.Password
              value={newPassword}
              required
              placeholder="Enter Email or username"
              onChangeCapture={(e) => setNewPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Password" name="confirm">
            <Input.Password
              value={confirmPassword}
              required
              placeholder="Enter password "
              onChangeCapture={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default Settings;
