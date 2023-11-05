import React, { useEffect, useState } from "react";
import { Tabs, Table, Button, Modal, List, message, Spin } from "antd";
import {
  collection,
  query,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { FIREBASE_DB } from "../configs/firebaseConfig";

const Loans = () => {
  const [pendingData, setPendingData] = useState([]);
  const [activeData, setActiveData] = useState([]);
  const [completedData, setCompletedData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Set initial state to false
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchFirestoreData();
  }, []);

  const columns = [
    {
      title: "ID",
      width: 100,
      dataIndex: "loanID",
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 150,
    },
    {
      title: "Amount",
      dataIndex: "loanAmount",
      width: 100,
    },
    {
      title: "Interest",
      dataIndex: "interestRate",
      width: 100,
    },
    {
      title: "Term",
      dataIndex: "terms",
      width: 100,
    },
    {
      title: "Number of Payments",
      dataIndex: "numberOfPayments",
      width: 180,
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
        <Button type="link" onClick={() => handleShow(record)}>
          View Details
        </Button>
      ),
    },
  ];

  const handleShow = (rowData) => {
    setSelectedRowData(rowData); // Set the selected row data
    setIsModalOpen(true);
  };

  const fetchFirestoreData = async () => {
    const borrowersCollection = collection(FIREBASE_DB, "borrowers");

    try {
      const querySnapshot = await getDocs(borrowersCollection);
      const borrowerDataLoan = [];

      for (const borrowerDoc of querySnapshot.docs) {
        // Get the loan requests for this borrower
        const loanRequestsCollection = collection(
          borrowerDoc.ref,
          "loanRequests"
        );
        const loanQuery = query(loanRequestsCollection);

        const loanQuerySnapshot = await getDocs(loanQuery);
        loanQuerySnapshot.forEach((loanDoc) => {
          const loanData = loanDoc.data();
          borrowerDataLoan.push({
            ...loanData,
          });
        });
      }

      const pending = borrowerDataLoan.filter(
        (item) => item.status === "Pending"
      );
      const active = borrowerDataLoan.filter(
        (item) => item.status === "Active"
      );
      const completed = borrowerDataLoan.filter(
        (item) => item.status === "Completed"
      );
      setPendingData(pending);
      setActiveData(active);
      setCompletedData(completed);
      setAllData(borrowerDataLoan);
    } catch (error) {
      console.error("Error querying the borrowers collection: ", error);
    }
  };

  const now = new Date();
  const getCurrentDate = () => {
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Months are zero-based (0 = January, 11 = December)
    const day = now.getDate();
    return `${month}/${day}/${year}`;
  };

  // Define a function to update the status to "Active"
  const updateLoanStatusToActive = async (borrowerId, loanRequestId) => {
    setIsUpdating(true);
    const db = FIREBASE_DB; // Use your Firestore database instance
    const loanRequestRef = doc(
      db,
      `borrowers/${borrowerId}/loanRequests/${loanRequestId}`
    );
    const userDocRef = doc(FIREBASE_DB, "borrowers", borrowerId);

    const borrowerSnapshot = await getDoc(userDocRef);
    const shareSnapshot = await getDoc(loanRequestRef);
    const borrowerData = borrowerSnapshot.data();
    const shareCapitalData = shareSnapshot.data();

    const borrowerShareCapital = shareCapitalData.shareCapital || 0; // Initialize as 0 if it doesn't exist yet
    const newShareCapital =
      borrowerShareCapital + shareCapitalData.shareCapitalAmount;

    const borrowerShareCapitalHistory = borrowerData.shareCapitalHistory || [];
    const shareCapitalDate = getCurrentDate();

    const newShareCapitalHistoryItem = {
      amount: shareCapitalData.shareCapitalAmount,
      date: shareCapitalDate,
    };

    const updatedShareCapitalHistory = [
      ...borrowerShareCapitalHistory,
      newShareCapitalHistoryItem,
    ];

    try {
      await updateDoc(userDocRef, {
        shareCapital: newShareCapital,
        shareCapitalHistory: updatedShareCapitalHistory,
      });
      await updateDoc(userDocRef, { shareCapital: newShareCapital });

      await updateDoc(loanRequestRef, { status: "Active" });
      setIsUpdating(false);
      message.success(
        `Loan with ID ${loanRequestId} has been successfully approved.`
      );
      setIsModalOpen(false);
      fetchFirestoreData();
    } catch (error) {
      console.error("Error updating loan status:", error);
    }
  };

  const handleOk = (accID, loanID) => {
    const borrowerId = accID;
    const loanRequestId = loanID;
    updateLoanStatusToActive(borrowerId, loanRequestId);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const items = [
    {
      key: "1",
      label: "Pending",
      content: (
        <Table
          columns={columns}
          dataSource={pendingData.map((item) => ({
            ...item,
            key: item.loanID,
          }))}
          scroll={{
            y: 350,
          }}
        />
      ),
    },
    {
      key: "2",
      label: "Active",
      content: (
        <Table
          columns={columns}
          dataSource={activeData.map((item) => ({
            ...item,
            key: item.loanID,
          }))}
          scroll={{
            y: 350,
          }}
        />
      ),
    },
    {
      key: "3",
      label: "Completed",
      content: (
        <Table
          columns={columns}
          dataSource={completedData.map((item) => ({
            ...item,
            key: item.loanID,
          }))}
          scroll={{
            y: 350,
          }}
        />
      ),
    },
    {
      key: "4",
      label: "All",
      content: (
        <Table
          columns={columns}
          dataSource={allData.map((item) => ({ ...item, key: item.loanID }))}
          scroll={{
            y: 350,
          }}
        />
      ),
    },
  ];
  return (
    <>
      {selectedRowData && (
        <Modal
          title="Loan Details"
          open={isModalOpen}
          onOk={() =>
            handleOk(selectedRowData.accountID, selectedRowData.loanID)
          }
          onCancel={handleCancel}
          okText={
            selectedRowData.status === "Active"
              ? "Active"
              : selectedRowData.status === "Completed"
              ? "Completed"
              : "Approve"
          }
          okButtonProps={{
            style: {
              backgroundColor:
                selectedRowData.status === "Pending" ? "#57708c" : "",
              borderColor:
                selectedRowData.status === "Pending" ? "#57708c" : "",
            },
            disabled:
              selectedRowData &&
              (selectedRowData.status === "Completed" ||
                selectedRowData.status === "Active"),
          }}
          width={800}
          centered
        >
          {isUpdating ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
              }}
            >
              <Spin size="large" />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ flex: 1 }}>
                <List>
                  <List.Item>ID :</List.Item>
                  <List.Item>Loan Amount :</List.Item>
                  <List.Item>Interest :</List.Item>
                  <List.Item>Service Handling Charge :</List.Item>
                  <List.Item>Net Proceeds from Loan : </List.Item>
                  <List.Item>Number of Payments :</List.Item>
                  <List.Item>Finance Charge : </List.Item>
                </List>
              </div>
              <div style={{ flex: 1, marginRight: 40 }}>
                <List>
                  <List.Item>{selectedRowData.loanID}</List.Item>
                  <List.Item>{selectedRowData.loanAmount}</List.Item>
                  <List.Item>{selectedRowData.interestRate}</List.Item>
                  <List.Item>{selectedRowData.serviceHandlingCharge}</List.Item>
                  <List.Item>{selectedRowData.netProceedsFromLoan}</List.Item>
                  <List.Item>{selectedRowData.numberOfPayments}</List.Item>
                  <List.Item>{selectedRowData.financeCharge}</List.Item>
                </List>
              </div>
              <div style={{ flex: 1 }}>
                <List>
                  <List.Item>Name :</List.Item>
                  <List.Item>Date Requested :</List.Item>
                  <List.Item>Date Granted :</List.Item>
                  <List.Item>Date Due :</List.Item>
                  <List.Item>Payable In :</List.Item>
                  <List.Item>
                    {selectedRowData.numberOfPayments} Payment :
                  </List.Item>
                  <List.Item>Status : </List.Item>
                </List>
              </div>
              <div style={{ flex: 1 }}>
                <List>
                  <List.Item>{selectedRowData.name}</List.Item>
                  <List.Item>{selectedRowData.dateRequested}</List.Item>
                  <List.Item>{selectedRowData.dateGranted}</List.Item>
                  <List.Item>{selectedRowData.dateDue}</List.Item>
                  <List.Item>
                    {selectedRowData.payableCount}{" "}
                    {selectedRowData.payableLabel}
                  </List.Item>
                  <List.Item>{selectedRowData.payment}</List.Item>
                  <List.Item>{selectedRowData.status}</List.Item>
                </List>
              </div>
            </div>
          )}
        </Modal>
      )}
      <div className="text">Member Loans</div>
      <Tabs defaultActiveKey="2">
        {items.map((item) => (
          <Tabs.TabPane tab={item.label} key={item.key}>
            {item.content}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </>
  );
};
export default Loans;
