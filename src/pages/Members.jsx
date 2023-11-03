import React from "react";
import { Tabs, Table, Space } from "antd";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    width: 100,
  },

  {
    title: "Name",
    dataIndex: "name",
    width: 100,
  },
  {
    title: "Address",
    dataIndex: "address",
    width: 150,
  },
  {
    title: "Email ",
    dataIndex: "email",
    width: 100,
  },
  {
    title: "Contact",
    dataIndex: "contact",
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
    render: () => <a> View Details </a>,
  },
];
const data = [
  {
    key: "1",
    id: 204203526,
    name: "John Brown",
    address: "New York No. 1 Lake Park",
    email: "john@brown",
    contact: "09234235",
    occupation: "administrator",
    spouse_name: "Jinny Brown",
    status: "Active",
  },
  {
    key: "1",
    id: 204203526,
    name: "John Brown",
    address: "New York No. 1 Lake Park",
    email: "john@brown",
    contact: "09234235",
    occupation: "administrator",
    spouse_name: "Jinny Brown",
    status: "Active",
  },
  {
    key: "1",
    id: 204203526,
    name: "John Brown",
    address: "New York No. 1 Lake Park",
    email: "john@brown",
    contact: "09234235",
    occupation: "administrator",
    spouse_name: "Jinny Brown",
    status: "Active",
  },
  {
    key: "1",
    id: 204203526,
    name: "John Brown",
    address: "New York No. 1 Lake Park",
    email: "john@brown",
    contact: "09234235",
    occupation: "administrator",
    spouse_name: "Jinny Brown",
    status: "Active",
  },
  {
    key: "1",
    id: 204203526,
    name: "John Brown",
    address: "New York No. 1 Lake Park",
    email: "john@brown",
    contact: "09234235",
    occupation: "administrator",
    spouse_name: "Jinny Brown",
    status: "Active",
  },
  {
    key: "1",
    id: 204203526,
    name: "John Brown",
    address: "New York No. 1 Lake Park",
    email: "john@brown",
    contact: "09234235",
    occupation: "administrator",
    spouse_name: "Jinny Brown",
    status: "Active",
  },
  {
    key: "1",
    id: 204203526,
    name: "John Brown",
    address: "New York No. 1 Lake Park",
    email: "john@brown",
    contact: "09234235",
    occupation: "administrator",
    spouse_name: "Jinny Brown",
    status: "Active",
  },
  {
    key: "1",
    id: 204203526,
    name: "John Brown",
    address: "New York No. 1 Lake Park",
    email: "john@brown",
    contact: "09234235",
    occupation: "administrator",
    spouse_name: "Jinny Brown",
    status: "Active",
  },
  {
    key: "1",
    id: 204203526,
    name: "John Brown",
    address: "New York No. 1 Lake Park",
    email: "john@brown",
    contact: "09234235",
    occupation: "administrator",
    spouse_name: "Jinny Brown",
    status: "Active",
  },
  {
    key: "1",
    id: 204203526,
    name: "John Brown",
    address: "New York No. 1 Lake Park",
    email: "john@brown",
    contact: "09234235",
    occupation: "administrator",
    spouse_name: "Jinny Brown",
    status: "Active",
  },
];

const Members = () => {
  const onChange = (key) => {
    console.log(key);
  };

  const items = [
    {
      key: "1",
      label: "Pending",
      content: (
        <Table
          columns={columns}
          dataSource={data}
          scroll={{
            y: 350,
          }}
        />
      ),
    },
    {
      key: "2",
      label: "Members",
      content: (
        <Table
          columns={columns}
          dataSource={data}
          scroll={{
            y: 350,
          }}
        />
      ),
    },
    {
      key: "3",
      label: "All",
      content: (
        <Table
          columns={columns}
          dataSource={data}
          scroll={{
            y: 350,
          }}
        />
      ),
    },
  ];

  return (
    <>
      <div className="text">Member Lists</div>

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
