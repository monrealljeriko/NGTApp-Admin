import React, { useEffect, useState } from "react";
import { Tabs, Table, Button, Modal, List, message, Spin } from "antd";
import { collection, query, getDocs, doc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../configs/firebaseConfig";

// const dataCredits = [
//   {
//     loanID: "NIOFHW337",
//     name: "Jeriko",
//     date: "00000",
//     amount: 600,
//     status: "Unpaid",
//   },
// ];

const Duedate = () => {
  const [due, setDue] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [allSchedule, setAllSchedule] = useState([{}]);
  const [allData, setAllData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Set initial state to false
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchFirestoreData();
  }, []);

  const fetchFirestoreData = async () => {
    const borrowersCollection = collection(FIREBASE_DB, "borrowers");

    try {
      const querySnapshot = await getDocs(borrowersCollection);
      const borrowerDataPaymentSchedule = [];
      const borrowerSchedArray = [];
      const borrowerSchedArrayOverdue = [];

      for (const borrowerDoc of querySnapshot.docs) {
        // Get the payment schedules for this borrower
        const paymentSchedulesCollection = collection(
          borrowerDoc.ref,
          "paymentSchedule"
        );
        const paymentScheduleQuerySnapshot = await getDocs(
          paymentSchedulesCollection
        );

        paymentScheduleQuerySnapshot.forEach((paymentScheduleDoc) => {
          const paymentScheduleData = paymentScheduleDoc.data();
          borrowerDataPaymentSchedule.push({
            ...paymentScheduleData, // Include all payment schedule data
          });

          borrowerSchedArray.push({
            ...paymentScheduleData.paymentSchedule, // Include all payment schedule data
          });
        });
      }

      /* const due = borrowerSchedArray.filter((item) => item.status === "Due");
      const overdue = borrowerSchedArray.filter(
        (item) => item.status === "Overdue"
      ); */

      // If you need separate arrays for other statuses like "Pending," "Active," and "Completed," you can filter them similarly.
      console.log("payment onkly array", borrowerSchedArray);

      setDue(due);
      setOverdue(overdue);
      setAllSchedule(borrowerSchedArray);
    } catch (error) {
      console.error("Error querying the borrowers collection: ", error);
    }
  };

  const onChange = (key) => {
    console.log(key);
  };

  //   const dateDues = [
  //     {
  //       loanID: allSchedule.loanID,
  //       name: allSchedule.name,
  //       date: allSchedule.date,
  //       amount: allSchedule.amount,
  //       status: allSchedule.status,
  //     },
  //   ];

  const columnsCredits = [
    {
      title: "ID",
      dataIndex: "loanID",
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 100,
    },
    {
      title: "Date",
      dataIndex: "date",
      width: 100,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: 100,
    },

    {
      title: "Status",
      dataIndex: "status",
      width: 100,
    },
    {
      title: "Action",
      key: "operation",
      width: 150,
      render: (record) => (
        <Button
          type="default"
          onClick={() => handleShow(record)}
          style={{ backgroundColor: "#57708c", color: "white" }}
        >
          Paid
        </Button>
      ),
    },
  ];

  const handleShow = (rowData) => {
    setSelectedRowData(rowData); // Set the selected row data
    setIsModalOpen(true);
  };

  const items = [
    {
      key: "1",
      label: "Due now",
      content: (
        <Table
          columns={columnsCredits}
          dataSource={allSchedule
            .reduce(
              (acc, currentArray) => acc.concat(Object.values(currentArray)),
              []
            )
            .filter((item) => item.due === true && item.status === "incomplete")
            .map((item, index) => ({
              ...item,
              key: item.scheduleID,
            }))}
          scroll={{
            y: 400,
          }}
        />
      ),
    },
    {
      key: "2",
      label: "Over due",
      content: (
        <Table
          columns={columnsCredits}
          dataSource={allSchedule
            .reduce(
              (acc, currentArray) => acc.concat(Object.values(currentArray)),
              []
            )
            .filter(
              (item) => item.overdue === true && item.status === "incomplete"
            )
            .map((item, index) => ({
              ...item,
              key: item.scheduleID,
            }))}
          scroll={{
            y: 400,
          }}
        />
      ),
    },
  ];

  return (
    <>
      <div className="text"> Duedates </div>
      <Tabs defaultActiveKey="1" onChange={onChange}>
        {items.map((item) => (
          <Tabs.TabPane tab={item.label} key={item.key}>
            {item.content}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </>
  );
};
export default Duedate;
