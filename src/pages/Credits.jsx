import React, { useEffect, useState } from "react";
import {
  Tabs,
  Table,
  Button,
  Form,
  Modal,
  Input,
  message,
  Spin,
  Popconfirm,
} from "antd";
import { Icon } from "@iconify/react";
import { FIREBASE_DB } from "../configs/firebaseConfig";
import { ReloadOutlined } from "@ant-design/icons";
import { CheckCircleOutlined, EditOutlined } from "@ant-design/icons";

import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";

const Members = () => {
  const [combinedData, setCombinedData] = useState([]);
  const [shareAmount, setShareAmount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(true);

  // const updateScheduleStatus = async (accountID, tokenID) => {
  //   const borrowerID = accountID;
  //   const borrowerRef = doc(FIREBASE_DB, "borrowers", borrowerID);
  //   const scheduleRef = collection(borrowerRef, "paymentSchedule");

  //   try {
  //     const borrowerSnapshot = await getDoc(borrowerRef);
  //     const querySchedSnapshot = await getDocs(scheduleRef);
  //     const borrowerData = borrowerSnapshot.data();
  //     const borrowerCreditHistory = borrowerData.creditScoreHistorry || [];
  //   } catch (error) {
  //     console.error("Error updating status from Firestore:", error);
  //   }
  // };

  const resetCreditScore = async (accountID) => {
    const userDocRef = doc(FIREBASE_DB, "borrowers", accountID);

    try {
      await updateDoc(userDocRef, { creditScore: 500 });
      message.success("Share capital added suuccessfully");
      fetchCreditsData();
      setIsModalOpen(false);
    } catch (e) {
      message.error("Error adding share capital");
    }
  };
  const columnsCredits = [
    {
      title: "ID",
      dataIndex: "registerID",
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "fullName",
      width: 100,
    },
    {
      title: "Available",
      dataIndex: "creditScore", // Use "creditScore" as the dataIndex
      width: 100,
    },

    {
      title: "Action",
      key: "operation",
      width: 150,
      render: (record) => (
        <Popconfirm
          title="Confirm"
          description="Are you sure you want reset the credit score?"
          onConfirm={() => resetCreditScore(selectedRowData.accountID)}
          onOpenChange={() => console.log("open change")}
          okButtonProps={{ style: { backgroundColor: "#57708c" } }}
          disabled={record.status === "complete"}
        >
          <Button
            type="default"
            onClick={() => handleResetShow(record)}
            style={{
              backgroundColor:
                record.status === "complete" ? "default-color" : "#57708c",
              color:
                record.status === "complete" ? "default-text-color" : "white",
            }}
          >
            {record.status === "complete" ? (
              <>
                <CheckCircleOutlined
                  style={{ marginRight: 10, color: "green" }}
                />
                Paid
              </>
            ) : (
              <>
                <Icon icon="radix-icons:reset" style={{ marginRight: 10 }} />
                Reset
              </>
            )}
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const columnsShare = [
    {
      title: "ID",
      dataIndex: "registerID",
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "fullName",
      width: 100,
    },
    {
      title: "Available",
      dataIndex: "shareCapital",
      width: 100,
    },
    {
      title: "Action",
      key: "operation",
      width: 150,
      render: (record) => (
        // <Button
        //   type="default"
        //   onClick={() => handleShowCapital()}
        //   style={{ backgroundColor: "#57708c", color: "#fff" }}
        // >
        //   <Icon icon="mi:add" style={{ fontSize: 18 }} />
        //   Add Share Capital
        // </Button>
        <Button
          type="link"
          onClick={() => handleShow(record)}
          style={{ backgroundColor: "#57708c", color: "#fff" }}
        >
          <Icon icon="mi:add" style={{ fontSize: 18 }} />
          Add Capital
        </Button>
      ),
    },
  ];

  const fetchCreditsData = async () => {
    setIsUpdating(true);
    try {
      const borrowersCollection = collection(FIREBASE_DB, "borrowers");
      const memberCollection = collection(FIREBASE_DB, "memberRegister");
      const querySnapshot = await getDocs(borrowersCollection);
      const memberQuerySnapshot = await getDocs(memberCollection);

      const creditsData = querySnapshot.docs.map((doc) => doc.data());
      const members = memberQuerySnapshot.docs.map((doc) => doc.data());

      const combined = members.map((member) => {
        const matchingCredit = creditsData.find(
          (credit) => credit.accountID === member.accountID
        );
        return {
          ...member,
          ...matchingCredit,
        };
      });
      setCombinedData(combined);
      console.log(combined);
    } catch (error) {
      console.error("Error fetching credits data:", error);
    }
    setIsUpdating(false);
  };

  const handleAddCapital = async (accountID, amount) => {
    const shareAmounttoAdd = parseInt(amount);
    const userDocRef = doc(FIREBASE_DB, "borrowers", accountID);
    const shareSnapshot = await getDoc(userDocRef);
    const shareCapitalData = shareSnapshot.data();

    const borrowerShareCapital = shareCapitalData.shareCapital || 0;
    const capital = parseInt(borrowerShareCapital);
    const newShareCapital = shareAmounttoAdd + capital;

    try {
      await updateDoc(userDocRef, { shareCapital: newShareCapital });
      message.success("Share capital added suuccessfully");
      fetchCreditsData();
      setIsModalOpen(false);
    } catch (e) {
      message.error("Error adding share capital");
    }
  };

  useEffect(() => {
    // Fetch the credits data when the component mounts.
    fetchCreditsData();
  }, []);
  const onChange = (key) => {
    console.log(key);
  };

  const handleResetShow = (rowData) => {
    setSelectedRowData(rowData); // Set the selected row data
  };

  const handleShow = (rowData) => {
    setSelectedRowData(rowData); // Set the selected row data
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    selectedRowData(null);
  };
  const items = [
    {
      key: "1",
      label: "Credit Score",
      content: isUpdating ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100px",
          }}
        >
          <Spin size="middle">Loading, plese wait.</Spin>
        </div>
      ) : (
        <Table
          columns={columnsCredits}
          dataSource={combinedData}
          scroll={{
            y: 400,
          }}
        />
      ),
    },
    {
      key: "2",
      label: "Share Capital",
      content: isUpdating ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100px",
          }}
        >
          <Spin size="middle">Loading, plese wait.</Spin>
        </div>
      ) : (
        <Table
          columns={columnsShare}
          dataSource={combinedData}
          scroll={{
            y: 420,
          }}
        />
      ),
    },
  ];

  return (
    <>
      {selectedRowData && (
        <Modal
          title="Add Share Capital"
          open={isModalOpen}
          onOk={() => handleAddCapital(selectedRowData.accountID, shareAmount)}
          onCancel={handleCancel}
          okText="Submit"
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
            autoComplete="off"
          >
            <Form.Item label="Member ID" name="current">
              <Input
                required
                placeholder={selectedRowData.registerID}
                disabled
              />
            </Form.Item>

            <Form.Item label="Amount" name="new">
              <Input
                value={shareAmount}
                required
                placeholder="Enter loan amount"
                onChangeCapture={(e) => setShareAmount(e.target.value)}
              />
            </Form.Item>
          </Form>
        </Modal>
      )}
      {/* <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div className="text" style={{ marginBottom: 10 }}>
          Credit and Share Capital
        </div>
        <Button
          type="default"
          onClick={() => handleShowCapital()}
          style={{ backgroundColor: "#57708c", color: "#fff" }}
        >
          <Icon icon="mi:add" style={{ fontSize: 18 }} />
          Add Share Capital
        </Button>
      </div> */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div className="text" style={{ marginBottom: 10 }}>
          Credit Score and Share Capital
        </div>
        <Button type="default" onClick={() => fetchCreditsData()}>
          <ReloadOutlined style={{ marginRight: 10 }} />
          Refresh
        </Button>
      </div>
      <Tabs defaultActiveKey="2" onChange={onChange}>
        {items.map((item) => (
          <Tabs.TabPane tab={item.label} key={item.key}>
            {item.content}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </>
  );
};
export default Members;
