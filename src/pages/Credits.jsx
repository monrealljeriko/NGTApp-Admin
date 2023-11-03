import React from "react";
import { Tabs, Table, Space } from "antd";

const columnsCredits = [
  {
    title: "Name",
    dataIndex: "name",
    width: 100,
  },
  {
    title: "Min Score",
    dataIndex: "min_score",
    width: 100,
  },
  {
    title: "Max Score",
    dataIndex: "max_score",
    width: 100,
  },
  {
    title: "Available",
    dataIndex: "available",
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
    render: () => <a> Reset </a>,
  },
];
const columnsShare = [
  {
    title: "Name",
    dataIndex: "name",
    width: 100,
  },
  {
    title: "Min Share",
    dataIndex: "min_share",
    width: 100,
  },
  {
    title: "Max Share",
    dataIndex: "max_share",
    width: 100,
  },
  {
    title: "Available",
    dataIndex: "available",
    width: 100,
  },
];
const dataCredits = [
  {
    name: "John Brown",
    min_score: 500,
    max_score: 600,
    available: 600,
    status: "Good",
  },
];
const dataShare = [
  {
    name: "Lee Brown",
    min_share: 30000,
    max_share: 40000,
    available: 600,
  },
];

const Members = () => {
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
          dataSource={dataCredits}
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
          dataSource={dataShare}
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
