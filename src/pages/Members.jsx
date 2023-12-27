import React, { useEffect, useState } from "react";
import { Tabs, Table, Button, Modal, List, message, Spin } from "antd";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { ReloadOutlined } from "@ant-design/icons";
import { FIREBASE_DB } from "../configs/firebaseConfig";
import { SearchOutlined } from "@ant-design/icons";

const Members = () => {
  const [pendingData, setPendingData] = useState([]);
  const [membersData, setMembersData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Set initial state to false
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const columns = [
    {
      key: "1",
      title: "ID",
      dataIndex: "registerID",
      width: 120,
    },

    {
      key: "2",
      title: "Name",
      dataIndex: "fullName",
      width: 160,
    },
    {
      key: "3",
      title: "Address",
      dataIndex: "presentAddress",
      width: 160,
    },
    {
      key: "4",
      title: "Email ",
      dataIndex: "emailAddress",
      width: 170,
    },
    {
      key: "5",
      title: "Contact",
      dataIndex: "contactNumber",
      width: 120,
    },
    {
      key: "6",
      title: "Status",
      dataIndex: "memberStatus",
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

  useEffect(() => {
    fetchFirestoreData();
  }, []);

  const fetchFirestoreData = async () => {
    setIsUpdating(true);
    const memberRegisterCollection = collection(FIREBASE_DB, "memberRegister");
    try {
      const querySnapshot = await getDocs(memberRegisterCollection);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });

      // Filter data into pending, members, and all categories
      const pending = data.filter((item) => item.memberStatus === "Pending");
      const members = data.filter((item) => item.memberStatus === "Member");

      setPendingData(pending);
      setMembersData(members);
      setAllData(data);
    } catch (error) {
      console.error("Error querying the memberRegister collection: ", error);
    }
    setIsUpdating(false);
  };
  const handleShow = (rowData) => {
    setSelectedRowData(rowData); // Set the selected row data
    setIsModalOpen(true);
  };

  const Message = {
    sound: "default",
    title: "Membership Status",
    body: "Your application has been approved! Your account will be provided by admin.",
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
  const updateMembershipStatus = async (memberId, tokenID) => {
    setIsUpdating(true);
    const db = FIREBASE_DB;
    const memberRef = doc(db, `memberRegister/${memberId}`);

    try {
      await updateDoc(memberRef, { memberStatus: "Member" });
      setIsUpdating(false);
      message.success(
        `Member with ID ${memberId} has been successfully approved.`
      );
      setIsModalOpen(false);
      try {
        await sendNotif(tokenID);
      } catch (error) {
        message.error("Error Acknowledging the Payments");
      }
      fetchFirestoreData();
    } catch (error) {
      console.error("Error updating member status:", error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
            key: item.registerID,
          }))}
          scroll={{
            y: 340,
          }}
        />
      ),
    },
    {
      key: "2",
      label: "Members",
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
          dataSource={membersData.map((item) => ({
            ...item,
            key: item.registerID,
          }))}
          scroll={{
            y: 340,
          }}
        />
      ),
    },
    {
      key: "3",
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
          <Spin size="middle" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={allData.map((item) => ({
            ...item,
            key: item.registerID,
          }))}
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
          title="Member Details"
          open={isModalOpen}
          onOk={() =>
            updateMembershipStatus(
              selectedRowData.registerID,
              selectedRowData.tokenID
            )
          }
          onCancel={handleCancel}
          okText={
            selectedRowData.memberStatus === "Member" ? "Member" : "Approve"
          }
          okButtonProps={{
            style: {
              backgroundColor:
                selectedRowData.memberStatus === "Pending" ? "#57708c" : "",
              borderColor:
                selectedRowData.memberStatus === "Pending" ? "#57708c" : "",
            },
            disabled:
              selectedRowData && selectedRowData.memberStatus === "Member",
          }}
          width={1300}
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
                  <List.Item>Name :</List.Item>
                  <List.Item>Palce of Birth :</List.Item>
                  <List.Item>Date of Birth :</List.Item>
                  <List.Item>Height :</List.Item>
                  <List.Item>Wight : </List.Item>
                  <List.Item>Highest Education :</List.Item>
                  <List.Item>Tax ID number : </List.Item>
                  <List.Item>SSS ID number : </List.Item>
                  <List.Item>Other ID Name: </List.Item>
                  <List.Item>Other ID Number : </List.Item>
                  <List.Item>Present Address : </List.Item>
                  <List.Item>Owner Type : </List.Item>
                </List>
              </div>
              <div style={{ flex: 1, marginRight: 40 }}>
                <List>
                  <List.Item>{selectedRowData.registerID}</List.Item>
                  <List.Item>
                    {selectedRowData.firstName + " " + selectedRowData.lastName}
                  </List.Item>

                  <List.Item>{selectedRowData.placeOfBirth}</List.Item>
                  <List.Item>{selectedRowData.dateOfBirth}</List.Item>
                  <List.Item>{selectedRowData.height}</List.Item>
                  <List.Item>{selectedRowData.weight}</List.Item>
                  <List.Item>{selectedRowData.completedEducation}</List.Item>
                  <List.Item>{selectedRowData.taxIDnumber}</List.Item>
                  <List.Item>{selectedRowData.sssIDnumber}</List.Item>
                  <List.Item>
                    {selectedRowData.otherIDname
                      ? selectedRowData.otherIDname
                      : "N/A"}
                  </List.Item>
                  <List.Item>
                    {selectedRowData.otherIDnumber
                      ? selectedRowData.otherIDnumber
                      : "N/A"}
                  </List.Item>
                  <List.Item>{selectedRowData.presentAddress}</List.Item>
                  <List.Item>{selectedRowData.addressType}</List.Item>
                </List>
              </div>
              <div style={{ flex: 1 }}>
                <List>
                  <List.Item>Provincial Address : </List.Item>
                  <List.Item>Email Address : </List.Item>
                  <List.Item>Contact Number : </List.Item>
                  <List.Item>Owned Vehicle : </List.Item>
                  <List.Item>Vehicle Type : </List.Item>
                  <List.Item>Plate Number : </List.Item>
                  <List.Item>Occupation : </List.Item>
                  <List.Item>Lenght of Service : </List.Item>
                  <List.Item>Business Address : </List.Item>
                  <List.Item>Business Name : </List.Item>
                  <List.Item>Business Contact Number : </List.Item>
                  <List.Item>Monthly Income : </List.Item>
                  <List.Item>Employment Status : </List.Item>
                </List>
              </div>
              <div style={{ flex: 1 }}>
                <List>
                  <List.Item>{selectedRowData.provincialAddress}</List.Item>
                  <List.Item>{selectedRowData.emailAddress}</List.Item>
                  <List.Item>{selectedRowData.contactNumber}</List.Item>
                  <List.Item>{selectedRowData.vehicleSelect}</List.Item>
                  <List.Item>
                    {selectedRowData.vehicleType
                      ? selectedRowData.vehicleType
                      : "N/A"}
                  </List.Item>
                  <List.Item>
                    {selectedRowData.vehiclePlateNumber
                      ? selectedRowData.vehiclePlateNumber
                      : "N/A"}
                  </List.Item>
                  <List.Item>
                    {selectedRowData.occupation
                      ? selectedRowData.occupation
                      : "N/A"}
                  </List.Item>
                  <List.Item>
                    {selectedRowData.lengthOfService
                      ? selectedRowData.lengthOfService
                      : "N/A"}
                  </List.Item>
                  <List.Item>{selectedRowData.businessAddress}</List.Item>
                  <List.Item>{selectedRowData.bussinessName}</List.Item>
                  <List.Item>{selectedRowData.businessContactNumber}</List.Item>
                  <List.Item>{selectedRowData.monthltIncome}</List.Item>
                  <List.Item>{selectedRowData.employmentStatus}</List.Item>
                </List>
              </div>
              <div style={{ flex: 1 }}>
                <List>
                  <List.Item>Spouse Name :</List.Item>
                  <List.Item>Date of Birth :</List.Item>
                  <List.Item>Contact Numbber :</List.Item>
                  <List.Item>Occupation :</List.Item>
                  <List.Item>Employer or Business :</List.Item>
                  <List.Item>Business Address : </List.Item>
                  <List.Item>Monhtly Income :</List.Item>
                  <List.Item>Employment Status : </List.Item>
                  <List.Item>Lenght of Service : </List.Item>
                  <List.Item>Reference Name: </List.Item>
                  <List.Item>Reference Address : </List.Item>
                  <List.Item>Relation : </List.Item>
                  <List.Item>Contact Number : </List.Item>
                </List>
              </div>
              <div style={{ flex: 1, marginRight: 40 }}>
                <List>
                  <List.Item>
                    {selectedRowData.spouseFirstName +
                      " " +
                      selectedRowData.spouseLastName}
                  </List.Item>

                  <List.Item>{selectedRowData.spouseDateOfBirth}</List.Item>
                  <List.Item>{selectedRowData.spouseContactNumber}</List.Item>
                  <List.Item>{selectedRowData.spouseOccupation}</List.Item>
                  <List.Item>{selectedRowData.spouseBusiness}</List.Item>
                  <List.Item>{selectedRowData.spouseBusinessAddress}</List.Item>
                  <List.Item>{selectedRowData.spouseMonthlyIncome}</List.Item>
                  <List.Item>{selectedRowData.spouseLenghtService}</List.Item>
                  <List.Item>{selectedRowData.referenceNameP1}</List.Item>
                  <List.Item>{selectedRowData.referenceAddressP1}</List.Item>
                  <List.Item>{selectedRowData.referenceRelationP1}</List.Item>
                  <List.Item>
                    {selectedRowData.referenceContactNumberP1}
                  </List.Item>
                  <List.Item>
                    {selectedRowData.businessContactNumberP1}
                  </List.Item>
                </List>
              </div>
            </div>
          )}
        </Modal>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div className="text">Member Lists</div>
        <Button type="default" onClick={() => fetchFirestoreData()}>
          <ReloadOutlined style={{ marginRight: 10 }} />
          Refresh
        </Button>
      </div>
      <Tabs defaultActiveKey="2">
        {items.map((item) => (
          <Tabs tab={item.label} key={item.key}>
            {item.content}
          </Tabs>
        ))}
      </Tabs>
    </>
  );
};
export default Members;
