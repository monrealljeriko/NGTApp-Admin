import React from "react";
import { Tabs, Table, Space } from "antd";

const columns = [
  {
    title: "ID",
    width: 100,
    dataIndex: "id",
  },
  {
    title: "Name",
    dataIndex: "number_of_payments",
    width: 150,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    width: 100,
  },
  {
    title: "Interest",
    dataIndex: "interest",
    width: 100,
  },
  {
    title: "Term",
    dataIndex: "term",
    width: 100,
  },
  {
    title: "Number of Payments",
    dataIndex: "number_of_payments",
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
    render: () => <a> View Details </a>,
  },
];
const data = [
  {
    key: "1",
    id: 204203526,
    amount: 2000,
    interest: "8%",
    term: "30 days",
    number_of_payments: "Weekly",
    status: "Active",
  },
  {
    key: "2",
    id: 204203526,
    id: 204203526,
    amount: 2000,
    interest: "4%",
    term: "60 days",
    number_of_payments: "Daily",
    status: "Active",
  },
  {
    key: "3",
    id: 204203526,
    amount: 2000,
    interest: "3%",
    term: "100 days",
    number_of_payments: "Montly",
    status: "Active",
  },
  {
    key: "3",
    id: 204203526,
    amount: 2000,
    interest: "3%",
    term: "100 days",
    number_of_payments: "Montly",
    status: "Active",
  },
  {
    key: "3",
    id: 204203526,
    amount: 2000,
    interest: "3%",
    term: "100 days",
    number_of_payments: "Montly",
    status: "Active",
  },
  {
    key: "3",
    id: 204203526,
    amount: 2000,
    interest: "3%",
    term: "100 days",
    number_of_payments: "Montly",
    status: "Active",
  },
  {
    key: "3",
    id: 204203526,
    amount: 2000,
    interest: "3%",
    term: "100 days",
    number_of_payments: "Montly",
    status: "Active",
  },
  {
    key: "3",
    id: 204203526,
    amount: 2000,
    interest: "3%",
    term: "100 days",
    number_of_payments: "Montly",
    status: "Active",
  },
];

const Loans = () => {
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
      label: "Active",
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
      label: "Completed",
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
      key: "4",
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
      <div className="text">Member Loans</div>
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
export default Loans;
