import React, { useEffect, useState } from "react";
import images from "./images";
import { FIREBASE_DB } from "../configs/firebaseConfig";

const data = {
  user: {
    name: "Administrator",
    img: images.pro,
    icon: <i className="bx bx-category"></i>,
    // list: <i className="bx bx-dots-vertical-rounded"></i>,
  },
  summary: [
    {
      title: "Loans",
      subtitle: "Active Loans",
      icon: <i className="bx bx-collection"></i>,
      value: 20000,
    },
    {
      title: "Members",
      subtitle: "Active members",
      icon: <i className="bx bx-user-check"></i>,
      value: 100,
    },
    {
      title: "Revenue",
      subtitle: "Total revenue",
      icon: <i className="bx bx-analyse "></i>,
      value: 20000,
    },
    {
      title: "Non Payee",
      subtitle: "Non paying members",
      icon: <i className="bx bx-user-x"></i>,
      value: 20,
    },
  ],
  revenueSummary: {
    title: "Revenue",
    value: "$110000",
    chartData: {
      labels: ["May", "Jun", "July", "Aug", "May", "Jun", "July", "Aug"],
      data: [300, 300, 280, 380, 200, 300, 280, 350],
    },
  },
  overall: [
    {
      value: "200K",
      title: "Overall Loans",
    },
    {
      value: "100",
      title: "Members",
    },
    {
      value: "95K",
      title: "Loanable Amount",
    },
    /*  {
      value: "$5678",
      title: "Revenue",
    }, */
  ],
  revenueByChannel: [
    {
      title: "Daily",
      value: 4000,
    },
    {
      title: "Weekly",
      value: 4000,
    },
    {
      title: "Monthly",
      value: 3000,
    },
  ],
  revenueByMonths: {
    labels: [
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
    ],
    data: [100, 200, 300, 280, 100, 220, 310, 190, 200, 120, 250, 350],
  },
};

export default data;
