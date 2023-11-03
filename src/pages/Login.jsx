import React, { useEffect, useState } from "react";
import { Button, Image, Checkbox, Flex, Form, Input } from "antd";
import { FIREBASE_AUTH } from "../configs/firebaseConfig";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const auth = FIREBASE_AUTH;

  useEffect(() => {
    // Check if login details are stored in localStorage
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");
    const storedCheck = localStorage.getItem("isChecked");

    if (storedEmail && storedPassword) {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setIsChecked(Boolean(storedCheck)); // Convert the string to a boolean
      console.log(
        "Retrieved email and password from localStorage:",
        storedEmail,
        storedPassword,
        storedCheck
      );
    }
  }, []);

  const onFinish = async (values) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Check if the "Remember Me" checkbox is checked
      //  if (isChecked) {
      //     // Save the email and password to AsyncStorage
      //     await AsyncStorage.setItem("email", email);
      //     await AsyncStorage.setItem("password", password);
      //  } else {
      //     // If not checked, remove any saved login details
      //     await AsyncStorage.removeItem("email");
      //     await AsyncStorage.removeItem("password");
      //  }

      if (isChecked) {
        // Save the email and password to localStorage
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        localStorage.setItem("isChecked", isChecked);
        console.log("Saved email and password");
      } else {
        // If not checked, remove any saved login details
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        localStorage.removeItem("isChecked");
        console.log("Saved email and removed");
      }

      console.log("Success:", values);
    } catch (error) {
      alert("Sign in failed: invalid email or password, try again.");
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
      <div
        style={{
          border: 1,
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          backgroundColor: "white",
        }}
      >
        <div className="hide-md">
          <Image
            height={450}
            src={require("../assets/images/login-bg.png")}
            preview={false}
            style={{ opacity: "80%" }}
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
            initialValues={{
              remember: isChecked,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              name="username"
              style={{ fontFamily: "Roboto" }}
              // rules={[
              //   {
              //     required: true,
              //     message: "Please input your username!",
              //   },
              // ]}
            >
              <div
                style={{
                  display: "flex",
                  gap: 15,
                  flexDirection: "column",
                  fontFamily: "Roboto",
                }}
              >
                <div
                  style={{ display: "flex", gap: 5, flexDirection: "column" }}
                >
                  <label>Email or username</label>
                  <Input
                    value={email}
                    required
                    placeholder="Enter email or username "
                    onChangeCapture={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div
                  style={{ display: "flex", gap: 5, flexDirection: "column" }}
                >
                  <label>Password</label>
                  <Input.Password
                    value={password}
                    required
                    placeholder="Enter password "
                    onChangeCapture={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </Form.Item>

            {/*    <Form.Item
              name="password"
              // rules={[
              //   {
              //     required: true,
              //     message: "Please input your password!",
              //   },
              // ]}
            ></Form.Item> */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Form.Item
                name="remember"
                valuePropName="checked"
                // wrapperCol={{
                //   offset: 8,
                //   span: 16,
                // }}
              >
                <Checkbox
                  checked={isChecked}
                  onChange={() => setIsChecked(!isChecked)}
                  style={{ color: "#57708c" }}
                  color={isChecked ? "#57708c" : undefined}
                >
                  Remember me
                </Checkbox>
              </Form.Item>
              <Form.Item
                name="forget"
                // wrapperCol={{
                //   offset: 8,
                //   span: 16,
                // }}
              >
                <a>Forget password</a>
              </Form.Item>
            </div>
            <Form.Item
            // wrapperCol={{
            //   offset: 8,
            //   span: 16,
            // }}
            >
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%", backgroundColor: "#57708c" }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
