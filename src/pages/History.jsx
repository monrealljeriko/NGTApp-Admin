import React, { useEffect, useState } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import { Tabs, Table, Button, List, Modal, Spin } from "antd";
import { collection, query, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../configs/firebaseConfig";
import { SearchOutlined } from "@ant-design/icons";

const History = () => {
  const [completedData, setCompletedData] = useState([]);
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
        <Button
          type="link"
          onClick={() => handleShow(record)}
          style={{
            backgroundColor: "#57708c",
            color: "white",
          }}
        >
          <SearchOutlined style={{ backgroundColor: "#57708c" }} />
          Details
        </Button>
      ),
    },
  ];

  const handleShow = (rowData) => {
    console.log(rowData);
    setSelectedRowData(rowData); // Set the selected row data
    setIsModalOpen(true);
  };

  const handleOk = () => {
    /*  setIsModalOpen(false);
    navigate("/"); */
    // Redirect to the dashboard or any desired route using navigate
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const fetchFirestoreData = async () => {
    setIsUpdating(true);
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

      const completed = borrowerDataLoan.filter(
        (item) => item.status === "Completed"
      );
      console.log("completed", completed);
      setCompletedData(completed);
      setIsUpdating(false);
    } catch (error) {
      console.error("Error querying the borrowers collection: ", error);
    }
  };

  return (
    <>
      {selectedRowData && (
        <Modal
          title="Loan Details"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Approve"
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
                  {selectedRowData.payableCount} {selectedRowData.payableLabel}
                </List.Item>
                <List.Item>{selectedRowData.payment}</List.Item>
                <List.Item>{selectedRowData.status}</List.Item>
              </List>
            </div>
          </div>
        </Modal>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div className="text" style={{ marginBottom: 10 }}>
          History
        </div>
        <Button type="default" onClick={() => fetchFirestoreData()}>
          <ReloadOutlined style={{ marginRight: 10 }} />
          Refresh
        </Button>
      </div>

      {isUpdating ? (
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
          columns={columns}
          dataSource={completedData}
          scroll={{
            y: 400,
          }}
        />
      )}
    </>
  );
};
export default History;
