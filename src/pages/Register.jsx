import React, { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import { FIREBASE_AUTH, FIREBASE_DB } from "../configs/firebaseConfig";
import { Spin } from "antd";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  query,
  getDocs,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [memberId, setMemberId] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const memberQuery = query(
        collection(db, "memberRegister"),
        where("registerID", "==", memberId)
      );
      const querySnapshot = await getDocs(memberQuery);

      if (!querySnapshot.empty) {
        await createUserWithEmailAndPassword(auth, email, password);

        const user = auth.currentUser;
        if (user) {
          const memberIdDocRef = doc(db, "memberRegister", memberId); // Create a reference to the specific document
          await updateDoc(memberIdDocRef, {
            accountID: user.uid,
          });

          message.success(
            "Account created successfully for member with ID: " + memberId
          );
          setIsModalOpen(false);
          navigate("/members");
        } else {
          message.error("User not signed in.");
        }
      } else {
        message.error("Member ID does not exist.");
        setMemberId("");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      message.error("Failed creating user account");
      setMemberId("");
      setEmail("");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/members");

    setIsModalOpen(false);
  };

  return (
    <Modal
      title="Register Member Account"
      open={isModalOpen}
      onOk={() => handleSubmit()}
      onCancel={handleCancel}
      okText="Register"
      okButtonProps={{
        style: {
          backgroundColor: !email || !password || !memberId ? "" : "#57708c",
          borderColor: !email || !password || !memberId ? "" : "#57708c",
          marginRight: 25,
        },
        disabled: !email || !password || !memberId,
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
          <Form.Item label="Member ID" name="text">
            <Input
              value={memberId}
              required
              placeholder="Enter member registration ID"
              onChangeCapture={(e) => setMemberId(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Email Address" name="email">
            <Input
              value={email}
              required
              placeholder="Enter Email or username"
              onChangeCapture={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Password" name="password">
            <Input.Password
              value={password}
              required
              placeholder="Enter password "
              onChangeCapture={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default App;
