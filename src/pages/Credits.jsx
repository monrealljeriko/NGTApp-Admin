import React, { useEffect, useState } from "react";
import { Tabs, Table } from "antd";
import { FIREBASE_DB } from "../configs/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const Members = () => {
  const [combinedData, setCombinedData] = useState([]);
  const columnsCredits = [
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
      render: () => <a>Reset</a>,
    },
  ];

  const columnsShare = [
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
  ];

  const fetchCreditsData = async () => {
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
    } catch (error) {
      console.error("Error fetching credits data:", error);
    }
  };

  useEffect(() => {
    // Fetch the credits data when the component mounts.
    fetchCreditsData();
  }, []);
  const onChange = (key) => {
    console.log(key);
  };

  const items = [
    {
      key: "1",
      label: "Credits",
      content: (
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
      content: (
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
      <div className="text"> Credits and Share Capital</div>
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
