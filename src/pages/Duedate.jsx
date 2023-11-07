import React, { useEffect, useState } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import { CheckCircleOutlined, EditOutlined } from "@ant-design/icons";
import { Tabs, Table, Button, Popconfirm, List, message, Spin } from "antd";
import {
  collection,
  getDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
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
    setIsUpdating(true);
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
      setIsUpdating(false);
    } catch (error) {
      console.error("Error querying the borrowers collection: ", error);
    }
  };

  // mark as paid the daily payment schedule for testing purposes
  const updateScheduleStatus = async (accountID) => {
    const borrowerID = accountID;
    const borrowerRef = doc(FIREBASE_DB, "borrowers", borrowerID);
    const scheduleRef = collection(borrowerRef, "paymentSchedule");

    try {
      const borrowerSnapshot = await getDoc(borrowerRef);
      const querySchedSnapshot = await getDocs(scheduleRef);

      if (borrowerSnapshot.exists()) {
        const loanRef = collection(borrowerRef, "loanRequests");
        const queryLoanSnapshot = await getDocs(loanRef);
        const borrowCreditScore = borrowerSnapshot.data();
        let updateCreditScore = borrowCreditScore.creditScore;

        queryLoanSnapshot.forEach((loanDoc) => {
          const loan = loanDoc.data();

          if (loan.status === "Active") {
            if (updateCreditScore < 5000) {
              switch (loan.numberOfPayments) {
                case "Daily":
                  updateCreditScore += 1;
                  break;
                case "Weekly":
                  updateCreditScore += 3;
                  break;
                case "Monthly":
                  updateCreditScore += 5;
                  break;
                default:
                  break;
              }
            }
          }

          querySchedSnapshot.forEach(async (schedDoc) => {
            const sched = schedDoc.data();
            const schedIdRef = doc(scheduleRef, schedDoc.id); // Use schedDoc.id to get the document ID
            const paymentScheduleArray = sched.paymentSchedule;

            // Check if paymentScheduleArray is defined and is an array
            if (Array.isArray(paymentScheduleArray)) {
              for (let i = 0; i < paymentScheduleArray.length; i++) {
                const paymentItem = paymentScheduleArray[i];
                if (paymentItem && paymentItem.status === "incomplete") {
                  // Update the payment item within the array
                  paymentScheduleArray[i] = {
                    ...paymentItem,
                    status: "complete",
                  };
                  // Update the entire payment schedule document with the modified array
                  await updateDoc(schedIdRef, {
                    paymentSchedule: paymentScheduleArray,
                  });
                  await updateDoc(borrowerRef, {
                    creditScore: updateCreditScore,
                  });
                  break;
                }
              }
            }
          });
        });
      }
      message.success("Successfully changed status.");
      fetchFirestoreData();

      /* const dateToday = new Date();
            const dateCreditHistory = format(dateToday, "MM/dd/yyyy");
            const addCreditHistory = {
               status: "increase",
               date: dateCreditHistory,
               summary: borrowerSnapshot.creditHistory + 1,
            };

            await addDoc(borrowerRef,{ creditScoreHistory: addCreditHistory}); */
    } catch (error) {
      console.error("Error updating status from Firestore:", error);
    }
  };

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
        <Popconfirm
          title="Confirm"
          description="Are you sure you want to mark this as paid?"
          onConfirm={() => updateScheduleStatus(selectedRowData.accountID)}
          onOpenChange={() => console.log("open change")}
          okButtonProps={{ style: { backgroundColor: "#57708c" } }}
          disabled={record.status === "complete"}
        >
          <Button
            type="default"
            onClick={() => handleShow(record)}
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
                <EditOutlined style={{ marginRight: 10 }} />
                Mark as paid
              </>
            )}
          </Button>
        </Popconfirm>
        /*    <Button
          type="default"
          onClick={() => handleShow(record)}
          style={{ backgroundColor: "#57708c", color: "white" }}
        >
          Paid
        </Button> */
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
    {
      key: "3",
      label: "Completed",
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
          dataSource={allSchedule
            .reduce(
              (acc, currentArray) => acc.concat(Object.values(currentArray)),
              []
            )
            .filter((item) => item.status === "complete")
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div className="text"> Duedates </div>
        <Button type="default" onClick={() => fetchFirestoreData()}>
          <ReloadOutlined style={{ marginRight: 10 }} />
          Refresh
        </Button>
      </div>
      <Tabs defaultActiveKey="1">
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
