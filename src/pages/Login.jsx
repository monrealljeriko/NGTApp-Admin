import React, { useEffect, useState } from "react";
import { Button, Image, Form, Input, message, Modal } from "antd";
import { FIREBASE_AUTH } from "../configs/firebaseConfig";
import { Spin } from "antd";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailuser, setEmailUser] = useState(email || "");
  const auth = FIREBASE_AUTH;
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Check if a user is already authenticated
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       // User is authenticated, you can navigate to the main application page
  //       // or set a state in your component to indicate the user is logged in.
  //       navigate("/main");
  //       console.log("User is already authenticated:", user);
  //     } else {
  //       // User is not authenticated, you can keep the login form displayed.
  //       setLoading(false); // Set loading to false to show the login form.
  //     }
  //   });

  //   // Cleanup the subscription when the component unmounts
  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    // Check if login details are stored in localStorage
    const storedEmail = localStorage.getItem("email");
    // const storedPassword = localStorage.getItem("password");
    // const storedCheck = localStorage.getItem("isChecked");

    if (storedEmail) {
      setEmail(storedEmail);
      /*    setPassword(storedPassword);
      setIsChecked(Boolean(storedCheck)); // Convert the string to a boolean
      console.log(
        "Retrieved email and password from localStorage:",
        storedEmail,
        storedPassword,
        storedCheck
      ); */
    }
  }, []);

  useEffect(() => {
    if (email && !email.includes("@")) {
      setEmailUser(email + "@gmail.com");
    }
  }, [email]);

  const forgetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, emailuser);
      message.success("Password reset email has been sent");
      setIsModalOpen(false);
    } catch (error) {
      message.error("User with this email does not exist.");
    }
  };

  const handleSubmit = async (values) => {
    values.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);

      // if (isChecked) {
      // Save the email and password to localStorage
      localStorage.setItem("email", email);
      // localStorage.setItem("password", password);
      // localStorage.setItem("isChecked", isChecked);
      // console.log("Saved email and password");
      // localStorage.removeItem("password");
      // } else {
      // If not checked, remove any saved login details
      // localStorage.removeItem("email");
      // localStorage.removeItem("password");
      // localStorage.removeItem("isChecked");
      // console.log("Saved email and removed");
      // }
      message.success(`Successfully Login.`);
    } catch (error) {
      alert("Sign in failed: invalid email or password, try again.");
    } finally {
      setLoading(false);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const handleCancel = () => {
    navigate("/");

    setIsModalOpen(false);
  };
  const handleShow = () => {
    setIsModalOpen(true);
  };
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Modal
        title="Forgot Password"
        open={isModalOpen}
        okText={"Send"}
        onOk={() => forgetPassword()}
        okButtonProps={{
          style: {
            backgroundColor: !emailuser ? "" : "#57708c",
            borderColor: !emailuser ? "" : "#57708c",
          },
          disabled: !emailuser,
        }}
        onCancel={handleCancel}
        width={400}
        centered
      >
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          style={{ marginTop: 20 }}
          autoComplete="off"
        >
          <div style={{ marginBottom: 20, marginLeft: 22, color: "gray" }}>
            Send a password reset email
          </div>
          <Form.Item label="Email address" name="confirm">
            <Input
              value={emailuser}
              required
              placeholder="Enter email address"
              onChangeCapture={(e) => setEmailUser(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
      <div
        style={{
          border: 1,
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          backgroundColor: "white",
          // boxShadow: "1px 1px 20px #57708c",
        }}
      >
        <div className="hide-md">
          <Image
            height={452}
            src={require("../assets/images/login-bg.png")}
            preview={false}
            style={{ opacity: "90%" }}
          />
        </div>
      </div>
      <div
        style={{
          paddingLeft: 40,
          paddingRight: 40,
          border: 1,
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          backgroundColor: "white",
          borderTop: "10px solid #57708c",
          borderBottom: "10px solid #57708c",
          // boxShadow: "1px 1px 20px #57708c",
        }}
      >
        <div className="title" style={{ marginBottom: 40 }}>
          Login
        </div>
        <div>
          <Form
            name="basic"
            style={{
              width: 300,
            }}
            onSubmitCapture={(e) => handleSubmit(e)}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <div
              style={{
                display: "flex",
                gap: 20,
                flexDirection: "column",
                fontFamily: "Roboto",
              }}
            >
              <div style={{ display: "flex", gap: 5, flexDirection: "column" }}>
                <label>Email or username</label>
                <Input
                  value={email}
                  required
                  placeholder="Enter email or username "
                  onChangeCapture={(e) => setEmail(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", gap: 5, flexDirection: "column" }}>
                <label>Password</label>
                <Input.Password
                  value={password}
                  required
                  placeholder="Enter password "
                  onChangeCapture={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <Spin size="middle" />
              </div>
            ) : (
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  width: "100%",
                  backgroundColor: "#57708c",
                  marginTop: 20,
                }}
              >
                Login
              </Button>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <Button type="link" onClick={() => handleShow()}>
                Forget password ?
              </Button>
              ,
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
