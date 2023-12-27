import React, { useEffect, useState } from "react";
import {
  Tabs,
  Table,
  Button,
  Modal,
  List,
  message,
  Spin,
  Popconfirm,
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";

import {
  collection,
  query,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { FIREBASE_DB } from "../configs/firebaseConfig";
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  EditOutlined,
} from "@ant-design/icons";

const Loans = () => {
  const [pendingData, setPendingData] = useState([]);
  const [activeData, setActiveData] = useState([]);
  const [completedData, setCompletedData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Set initial state to false
  const [isModalOpenChecklist, setIsModalOpenChecklist] = useState(false); // Set initial state to false
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedRowDataChecklist, setSelectedRowDataChecklist] =
    useState(null);
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
      width: 120,
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
    // {
    //   title: "Term",
    //   dataIndex: "terms",
    //   width: 100,
    // },
    // {
    //   title: "Number of Payments",
    //   dataIndex: "numberOfPayments",
    //   width: 180,
    // },

    {
      title: "Status",
      dataIndex: "status",
      width: 100,
    },

    {
      title: "Action",
      key: "operation",
      width: 200,
      render: (record) => (
        <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
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
          <Button
            type="link"
            onClick={() => handleShowChecklist(record)}
            style={{
              borderColor: "#57708c",
              color: "#57708c",
            }}
          >
            <SearchOutlined style={{ color: "#57708c" }} />
            Checklist
          </Button>
        </div>
      ),
    },
  ];

  const updateChecklists = async (accountID, check) => {
    const borrowerID = accountID;
    const memberIdDocRef = doc(FIREBASE_DB, "memberRegister", accountID);

    try {
      switch (check) {
        case "check1":
          await updateDoc(memberIdDocRef, {
            checkList1: true,
          });
          break;
        case "check2":
          await updateDoc(memberIdDocRef, {
            checkList2: true,
          });
          break;
        case "check3":
          await updateDoc(memberIdDocRef, {
            checkList3: true,
          });
          break;
        case "check4":
          await updateDoc(memberIdDocRef, {
            checkList4: true,
          });
          break;
        case "check5":
          await updateDoc(memberIdDocRef, {
            checkList5: true,
          });
          break;
        case "check6":
          await updateDoc(memberIdDocRef, {
            checkList6: true,
          });
          break;
        case "check7":
          await updateDoc(memberIdDocRef, {
            checkList7: true,
          });
          break;
        case "check8":
          await updateDoc(memberIdDocRef, {
            checkList8: true,
          });
          break;
        default:
          break;
      }

      message.success("Status successfully updated");
    } catch (e) {
      message.error("Failed updating status");
    }
  };

  const handleShow = (rowData) => {
    setSelectedRowData(rowData); // Set the selected row data
    setIsModalOpen(true);
  };

  const handleShowChecklist = (rowData) => {
    setSelectedRowDataChecklist(rowData); // Set the selected row data
    setIsModalOpenChecklist(true);
  };

  const fetchFirestoreData = async () => {
    setIsUpdating(true);
    const borrowersCollection = collection(FIREBASE_DB, "borrowers");
    const memberCollection = collection(FIREBASE_DB, "memberRegister");

    const querySnapshot = await getDocs(borrowersCollection);
    const memberQuerySnapshot = await getDocs(memberCollection);

    const borrowersData = querySnapshot.docs.map((doc) => doc.data());
    const members = memberQuerySnapshot.docs.map((doc) => doc.data());

    const combined = members.map((member) => {
      const matchingBorrower = borrowersData.find(
        (borrow) => borrow.accountID === member.accountID
      );
      return {
        ...member,
        ...matchingBorrower,
      };
    });

    setCombinedData(combined);
    // console.log(combined);

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

      const combinedPending = pending.map((member) => {
        // Find a member with the same accountID in the members array
        const matchingBorrower = members.find(
          (borrow) => borrow.accountID === member.accountID
        );

        // Combine properties from both member and matchingBorrower
        return {
          ...member, // Spread properties from borrowerDataLoan
          checkList1: matchingBorrower?.checkList1 || member.checkList1, // Add specific property from member
          checkList2: matchingBorrower?.checkList2 || member.checkList2,
          checkList3: matchingBorrower?.checkList3 || member.checkList3, // Add specific property from member
          checkList4: matchingBorrower?.checkList4 || member.checkList4,
          checkList5: matchingBorrower?.checkList5 || member.checkList5, // Add specific property from member
          checkList6: matchingBorrower?.checkList6 || member.checkList6,
          checkList7: matchingBorrower?.checkList7 || member.checkList7, // Add specific property from member
          checkList8: matchingBorrower?.checkList8 || member.checkList8,
        };
      });
      console.log("Pending Data", combinedPending);

      const combinedActive = active.map((member) => {
        // Find a member with the same accountID in the members array
        const matchingBorrower = members.find(
          (borrow) => borrow.accountID === member.accountID
        );

        // Combine properties from both member and matchingBorrower
        return {
          ...member, // Spread properties from borrowerDataLoan
          checkList1: matchingBorrower?.checkList1 || member.checkList1, // Add specific property from member
          checkList2: matchingBorrower?.checkList2 || member.checkList2,
          checkList3: matchingBorrower?.checkList3 || member.checkList3, // Add specific property from member
          checkList4: matchingBorrower?.checkList4 || member.checkList4,
          checkList5: matchingBorrower?.checkList5 || member.checkList5, // Add specific property from member
          checkList6: matchingBorrower?.checkList6 || member.checkList6,
          checkList7: matchingBorrower?.checkList7 || member.checkList7, // Add specific property from member
          checkList8: matchingBorrower?.checkList8 || member.checkList8,
        };
      });
      console.log("Active Data", combinedActive);

      const combinedCompleted = completed.map((member) => {
        // Find a member with the same accountID in the members array
        const matchingBorrower = members.find(
          (borrow) => borrow.accountID === member.accountID
        );

        // Combine properties from both member and matchingBorrower
        return {
          ...member, // Spread properties from borrowerDataLoan
          checkList1: matchingBorrower?.checkList1 || member.checkList1, // Add specific property from member
          checkList2: matchingBorrower?.checkList2 || member.checkList2,
          checkList3: matchingBorrower?.checkList3 || member.checkList3, // Add specific property from member
          checkList4: matchingBorrower?.checkList4 || member.checkList4,
          checkList5: matchingBorrower?.checkList5 || member.checkList5, // Add specific property from member
          checkList6: matchingBorrower?.checkList6 || member.checkList6,
          checkList7: matchingBorrower?.checkList7 || member.checkList7, // Add specific property from member
          checkList8: matchingBorrower?.checkList8 || member.checkList8,
        };
      });
      console.log("Completed Data", combinedCompleted);

      const combinedAllData = borrowerDataLoan.map((member) => {
        // Find a member with the same accountID in the members array
        const matchingBorrower = members.find(
          (borrow) => borrow.accountID === member.accountID
        );

        // Combine properties from both member and matchingBorrower
        return {
          ...member, // Spread properties from borrowerDataLoan
          checkList1: matchingBorrower?.checkList1 || member.checkList1, // Add specific property from member
          checkList2: matchingBorrower?.checkList2 || member.checkList2,
          checkList3: matchingBorrower?.checkList3 || member.checkList3, // Add specific property from member
          checkList4: matchingBorrower?.checkList4 || member.checkList4,
          checkList5: matchingBorrower?.checkList5 || member.checkList5, // Add specific property from member
          checkList6: matchingBorrower?.checkList6 || member.checkList6,
          checkList7: matchingBorrower?.checkList7 || member.checkList7, // Add specific property from member
          checkList8: matchingBorrower?.checkList8 || member.checkList8,
        };
      });
      console.log("All data", combinedAllData);

      setPendingData(combinedPending);
      setActiveData(combinedActive);
      setCompletedData(combinedCompleted);
      setAllData(combinedAllData);
      setIsUpdating(false);
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

  const Message = {
    sound: "default",
    title: "Loan Status",
    body: "Your loan has been approved! Check your app to see your schedule.",
  };

  const sendNotif = async (expoToken) => {
    Message.to = expoToken;
    await fetch("https://exp.host/--/api/v2/push/send", {
      mode: "no-cors",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Message),
    });
  };

  // Define a function to update the status to "Active"
  const updateLoanStatusToActive = async (
    borrowerId,
    loanRequestId,
    tokenRequestId
  ) => {
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

    const borrowerShareCapital = borrowerData.shareCapital || 0; // Initialize as 0 if it doesn't exist yet
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
      try {
        await sendNotif(tokenRequestId);
      } catch (error) {
        message.error("Error Acknowledging the Payments");
      }
      fetchFirestoreData();
    } catch (error) {
      console.error("Error updating loan status:", error);
    }
  };

  const handleOk = () => {
    setIsModalOpenChecklist(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpenChecklist(false);
  };
  const items = [
    {
      key: "1",
      label: "Pending",
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
          columns={columns}
          dataSource={pendingData.map((item) => ({
            ...item,
            key: item.loanID,
          }))}
          scroll={{
            y: 340,
          }}
        />
      ),
    },
    {
      key: "2",
      label: "Active",
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
          columns={columns}
          dataSource={activeData.map((item) => ({
            ...item,
            key: item.loanID,
          }))}
          scroll={{
            y: 340,
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
          columns={columns}
          dataSource={completedData.map((item) => ({
            ...item,
            key: item.loanID,
          }))}
          scroll={{
            y: 340,
          }}
        />
      ),
    },
    {
      key: "4",
      label: "All",
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
          columns={columns}
          dataSource={allData.map((item) => ({ ...item, key: item.loanID }))}
          scroll={{
            y: 340,
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
            handleOk(
              selectedRowData.accountID,
              selectedRowData.loanID,
              selectedRowData.tokenID
            )
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
              <Spin size="large">Loading, plese wait.</Spin>
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
      {selectedRowDataChecklist && (
        <Modal
          title="Check Lists"
          open={isModalOpenChecklist}
          onOk={handleOk}
          onCancel={handleCancel}
          cancelText="Done"
          okButtonProps={{
            style: { display: "none" },
          }}
          width={450}
          centered
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ flex: 1, marginRight: 40 }}>
              <List>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <>
                    <div>
                      {selectedRowDataChecklist.checkList1 ? (
                        <List.Item>
                          <CheckCircleOutlined
                            style={{ marginRight: 10, color: "green" }}
                          />
                          Application Form
                        </List.Item>
                      ) : (
                        <List.Item>
                          <CloseOutlined
                            style={{ marginRight: 10, color: "red" }}
                          />
                          Application Form
                        </List.Item>
                      )}
                    </div>
                  </>
                </div>
              </List>

              {/* item2 */}
              <List>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {selectedRowDataChecklist.checkList2 ? (
                      <List.Item>
                        <CheckCircleOutlined
                          style={{ marginRight: 10, color: "green" }}
                        />
                        Barangay Clearance
                      </List.Item>
                    ) : (
                      <List.Item>
                        <CloseOutlined
                          style={{ marginRight: 10, color: "red" }}
                        />
                        Barangay Clearance
                      </List.Item>
                    )}
                  </div>
                </div>
              </List>

              {/* item 3 */}
              <List>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {selectedRowDataChecklist.checkList3 ? (
                      <List.Item>
                        <CheckCircleOutlined
                          style={{ marginRight: 10, color: "green" }}
                        />
                        2x2 ID Picture
                      </List.Item>
                    ) : (
                      <List.Item>
                        <CloseOutlined
                          style={{ marginRight: 10, color: "red" }}
                        />
                        2x2 ID Picture
                      </List.Item>
                    )}
                  </div>
                </div>
              </List>

              {/* item 4 */}
              <List>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {selectedRowDataChecklist.checkList4 ? (
                      <List.Item>
                        <CheckCircleOutlined
                          style={{ marginRight: 10, color: "green" }}
                        />
                        1x1 ID Picture
                      </List.Item>
                    ) : (
                      <List.Item>
                        <CloseOutlined
                          style={{ marginRight: 10, color: "red" }}
                        />
                        1x1 ID Picture
                      </List.Item>
                    )}
                  </div>
                </div>
              </List>
              <List>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {selectedRowDataChecklist.checkList5 ? (
                      <List.Item>
                        <CheckCircleOutlined
                          style={{ marginRight: 10, color: "green" }}
                        />
                        Seminar
                      </List.Item>
                    ) : (
                      <List.Item>
                        <CloseOutlined
                          style={{ marginRight: 10, color: "red" }}
                        />
                        Seminar
                      </List.Item>
                    )}
                  </div>
                </div>
              </List>
              <List>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {selectedRowDataChecklist.checkList6 ? (
                      <List.Item>
                        <CheckCircleOutlined
                          style={{ marginRight: 10, color: "green" }}
                        />
                        Credit Investigation Interview
                      </List.Item>
                    ) : (
                      <List.Item>
                        <CloseOutlined
                          style={{ marginRight: 10, color: "red" }}
                        />
                        Credit Investigation Interview
                      </List.Item>
                    )}
                  </div>
                </div>
              </List>
              <List>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {selectedRowDataChecklist.checkList7 ? (
                      <List.Item>
                        <CheckCircleOutlined
                          style={{ marginRight: 10, color: "green" }}
                        />
                        Copy of Identintification Card
                      </List.Item>
                    ) : (
                      <List.Item>
                        <CloseOutlined
                          style={{ marginRight: 10, color: "red" }}
                        />
                        Copy of Identintification Card
                      </List.Item>
                    )}
                  </div>
                </div>
              </List>
              <List>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {selectedRowDataChecklist.checkList8 ? (
                      <List.Item>
                        <CheckCircleOutlined
                          style={{ marginRight: 10, color: "green" }}
                        />
                        Copy of Scanned Documents
                      </List.Item>
                    ) : (
                      <List.Item>
                        <CloseOutlined
                          style={{ marginRight: 10, color: "red" }}
                        />
                        Copy of Scanned Documents
                      </List.Item>
                    )}
                  </div>
                </div>
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
        }}
      >
        <div className="text">Member Loans</div>
        <Button type="default" onClick={() => fetchFirestoreData()}>
          <ReloadOutlined style={{ marginRight: 10 }} />
          Refresh
        </Button>
      </div>
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
