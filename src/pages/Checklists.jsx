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
  Slider,
} from "antd";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { ReloadOutlined } from "@ant-design/icons";
import { FIREBASE_DB } from "../configs/firebaseConfig";
import { Checkbox } from "antd";
import {
  CheckCircleOutlined,
  EditOutlined,
  SearchOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const Checklist = () => {
  const [membersData, setMembersData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Set initial state to false
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCheck, setIsCheck] = useState();

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
          View Checklist
        </Button>
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
      const members = data.filter((item) => item.status === "Member");

      setMembersData(members);
    } catch (error) {
      console.error("Error querying the memberRegister collection: ", error);
    }
    setIsUpdating(false);
  };
  const handleShow = (rowData) => {
    setSelectedRowData(rowData); // Set the selected row data
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    fetchFirestoreData();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedRowData(null);
  };

  return (
    <>
      {selectedRowData && (
        <Modal
          title="Check Lists"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Ok"
          okButtonProps={{
            style: {
              backgroundColor: "#57708c",
              borderColor: "#57708c",
            },
          }}
          width={450}
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
                        {selectedRowData.checkList1 ? (
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
                      {selectedRowData.checkList1 ? (
                        " "
                      ) : (
                        <List.Item>
                          <Popconfirm
                            title="Confirm"
                            description="Are you sure you want to mark this as paid?"
                            onConfirm={() =>
                              updateChecklists(
                                selectedRowData.registerID,
                                "check1"
                              )
                            }
                            onOpenChange={() => console.log("open change")}
                            okButtonProps={{
                              style: { backgroundColor: "#57708c" },
                            }}
                          >
                            <Button
                              type="link"
                              //   onClick={() => handleShow(record)}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  gap: 8,
                                }}
                              >
                                <EditOutlined style={{ color: "#57708c" }} />
                                <div style={{ color: "#57708c" }}>
                                  Mark as okay
                                </div>
                              </div>
                            </Button>
                          </Popconfirm>
                          {/* <EditOutlined style={{ marginRight: 10 }} />
                      Mark as paid */}
                        </List.Item>
                      )}
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
                      {selectedRowData.checkList2 ? (
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
                    {selectedRowData.checkList2 ? (
                      " "
                    ) : (
                      <List.Item>
                        <Popconfirm
                          title="Confirm"
                          description="Are you sure you want to mark this as paid?"
                          onConfirm={() =>
                            updateChecklists(
                              selectedRowData.registerID,
                              "check2"
                            )
                          }
                          onOpenChange={() => console.log("open change")}
                          okButtonProps={{
                            style: { backgroundColor: "#57708c" },
                          }}
                        >
                          <Button
                            type="link"
                            //   onClick={() => handleShow(record)}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 8,
                              }}
                            >
                              <EditOutlined style={{ color: "#57708c" }} />
                              <div style={{ color: "#57708c" }}>
                                Mark as okay
                              </div>
                            </div>
                          </Button>
                        </Popconfirm>
                        {/* <EditOutlined style={{ marginRight: 10 }} />
                      Mark as paid */}
                      </List.Item>
                    )}
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
                      {selectedRowData.checkList3 ? (
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
                    {selectedRowData.checkList3 ? (
                      " "
                    ) : (
                      <List.Item>
                        <Popconfirm
                          title="Confirm"
                          description="Are you sure you want to mark this as paid?"
                          onConfirm={() =>
                            updateChecklists(
                              selectedRowData.registerID,
                              "check3"
                            )
                          }
                          onOpenChange={() => console.log("open change")}
                          okButtonProps={{
                            style: { backgroundColor: "#57708c" },
                          }}
                        >
                          <Button
                            type="link"
                            //   onClick={() => handleShow(record)}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 8,
                              }}
                            >
                              <EditOutlined style={{ color: "#57708c" }} />
                              <div style={{ color: "#57708c" }}>
                                Mark as okay
                              </div>
                            </div>
                          </Button>
                        </Popconfirm>
                        {/* <EditOutlined style={{ marginRight: 10 }} />
                      Mark as paid */}
                      </List.Item>
                    )}
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
                      {selectedRowData.checkList4 ? (
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
                    {selectedRowData.checkList4 ? (
                      " "
                    ) : (
                      <List.Item>
                        <Popconfirm
                          title="Confirm"
                          description="Are you sure you want to mark this as paid?"
                          onConfirm={() =>
                            updateChecklists(
                              selectedRowData.registerID,
                              "check4"
                            )
                          }
                          onOpenChange={() => console.log("open change")}
                          okButtonProps={{
                            style: { backgroundColor: "#57708c" },
                          }}
                        >
                          <Button
                            type="link"
                            //   onClick={() => handleShow(record)}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 8,
                              }}
                            >
                              <EditOutlined style={{ color: "#57708c" }} />
                              <div style={{ color: "#57708c" }}>
                                Mark as okay
                              </div>
                            </div>
                          </Button>
                        </Popconfirm>
                        {/* <EditOutlined style={{ marginRight: 10 }} />
                      Mark as paid */}
                      </List.Item>
                    )}
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
                      {selectedRowData.checkList5 ? (
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
                    {selectedRowData.checkList5 ? (
                      " "
                    ) : (
                      <List.Item>
                        <Popconfirm
                          title="Confirm"
                          description="Are you sure you want to mark this as paid?"
                          onConfirm={() =>
                            updateChecklists(
                              selectedRowData.registerID,
                              "check5"
                            )
                          }
                          onOpenChange={() => console.log("open change")}
                          okButtonProps={{
                            style: { backgroundColor: "#57708c" },
                          }}
                        >
                          <Button
                            type="link"
                            //   onClick={() => handleShow(record)}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 8,
                              }}
                            >
                              <EditOutlined style={{ color: "#57708c" }} />
                              <div style={{ color: "#57708c" }}>
                                Mark as okay
                              </div>
                            </div>
                          </Button>
                        </Popconfirm>
                        {/* <EditOutlined style={{ marginRight: 10 }} />
                      Mark as paid */}
                      </List.Item>
                    )}
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
                      {selectedRowData.checkList6 ? (
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
                    {selectedRowData.checkList6 ? (
                      " "
                    ) : (
                      <List.Item>
                        <Popconfirm
                          title="Confirm"
                          description="Are you sure you want to mark this as paid?"
                          onConfirm={() =>
                            updateChecklists(
                              selectedRowData.registerID,
                              "check6"
                            )
                          }
                          onOpenChange={() => console.log("open change")}
                          okButtonProps={{
                            style: { backgroundColor: "#57708c" },
                          }}
                        >
                          <Button
                            type="link"
                            //   onClick={() => handleShow(record)}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 8,
                              }}
                            >
                              <EditOutlined style={{ color: "#57708c" }} />
                              <div style={{ color: "#57708c" }}>
                                Mark as okay
                              </div>
                            </div>
                          </Button>
                        </Popconfirm>
                        {/* <EditOutlined style={{ marginRight: 10 }} />
                      Mark as paid */}
                      </List.Item>
                    )}
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
                      {selectedRowData.checkList7 ? (
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
                    {selectedRowData.checkList7 ? (
                      " "
                    ) : (
                      <List.Item>
                        <Popconfirm
                          title="Confirm"
                          description="Are you sure you want to mark this as paid?"
                          onConfirm={() =>
                            updateChecklists(
                              selectedRowData.registerID,
                              "check7"
                            )
                          }
                          onOpenChange={() => console.log("open change")}
                          okButtonProps={{
                            style: { backgroundColor: "#57708c" },
                          }}
                        >
                          <Button
                            type="link"
                            //   onClick={() => handleShow(record)}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 8,
                              }}
                            >
                              <EditOutlined style={{ color: "#57708c" }} />
                              <div style={{ color: "#57708c" }}>
                                Mark as okay
                              </div>
                            </div>
                          </Button>
                        </Popconfirm>
                        {/* <EditOutlined style={{ marginRight: 10 }} />
                      Mark as paid */}
                      </List.Item>
                    )}
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
                      {selectedRowData.checkList8 ? (
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
                    {selectedRowData.checkList8 ? (
                      " "
                    ) : (
                      <List.Item>
                        <Popconfirm
                          title="Confirm"
                          description="Are you sure you want to mark this as paid?"
                          onConfirm={() =>
                            updateChecklists(
                              selectedRowData.registerID,
                              "check8"
                            )
                          }
                          onOpenChange={() => console.log("open change")}
                          okButtonProps={{
                            style: { backgroundColor: "#57708c" },
                          }}
                        >
                          <Button
                            type="link"
                            //   onClick={() => handleShow(record)}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 8,
                              }}
                            >
                              <EditOutlined style={{ color: "#57708c" }} />
                              <div style={{ color: "#57708c" }}>
                                Mark as okay
                              </div>
                            </div>
                          </Button>
                        </Popconfirm>
                        {/* <EditOutlined style={{ marginRight: 10 }} />
                      Mark as paid */}
                      </List.Item>
                    )}
                  </div>
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
        <div className="text">Requirements Checklist</div>
        <Button type="default" onClick={fetchFirestoreData}>
          <ReloadOutlined style={{ marginRight: 10 }} />
          Refresh
        </Button>
      </div>
      <div style={{ marginTop: 15 }}>
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
        )}
      </div>
    </>
  );
};
export default Checklist;
