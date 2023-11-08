import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Spin } from "antd";
import Box from "../components/box/Box";
import { Icon } from "@iconify/react";
import DashboardWrapper, {
  DashboardWrapperMain,
  DashboardWrapperRight,
} from "../components/dashboard-wrapper/DashboardWrapper";
import SummaryBox, {
  SummaryBoxSpecial,
} from "../components/summary-box/SummaryBox";
import { colors, data } from "../constants";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import OverallList from "../components/overall-list/OverallList";
import RevenueList from "../components/revenue-list/RevenueList";
import { FIREBASE_DB } from "../configs/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [activeLoanSum, setActiveLoanSum] = useState("");
  const [completedLoanSum, setCompletedLoanSum] = useState("");
  const [totalRevenueSum, setTotalRevenueSum] = useState("");
  const [dailyRevenueSum, setDailyRevenueSum] = useState("");
  const [WeeklyRevenueSum, setWeeklyRevenueSum] = useState("");
  const [MonhtlyRevenueSum, setMonthlyRevenueSum] = useState("");
  const [activeMembers, setActiveMembers] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [loanable, setLoanable] = useState("");
  const [laoding, setLoading] = useState(false);

  const summaryData = {
    summary: [
      {
        title: "Loans",
        subtitle: "Active Loans",
        icon: <Icon icon="mdi:hand-coin-outline" style={{ fontSize: 38 }} />,
        value: activeLoanSum,
      },
      {
        title: "Members",
        subtitle: "Active members",
        icon: <i className="bx bx-user-check" style={{ fontSize: 38 }}></i>,
        value: 10,
      },
      {
        title: "Revenue",
        subtitle: "Total revenue",
        icon: <i className="bx bx-analyse "></i>,
        value: totalRevenueSum,
      },
      {
        title: "Non Payee",
        subtitle: "Non paying members",
        icon: <i className="bx bx-user-x" style={{ fontSize: 38 }}></i>,
        value: 2,
      },
    ],
    overall: [
      {
        value: completedLoanSum,
        title: "Overall Loans",
      },
      {
        value: 10,
        title: "Members",
      },
      {
        value: loanable,
        title: "Loanable Amount",
      },
    ],
    revenueByChannel: [
      {
        title: "Daily",
        value: dailyRevenueSum,
      },
      {
        title: "Weekly",
        value: WeeklyRevenueSum,
      },
      {
        title: "Monthly",
        value: MonhtlyRevenueSum,
      },
    ],
  };

  useEffect(() => {
    fetchLoanData();
    fetchMemberData();
  }, []);

  const formatNumber = (number) => {
    if (number >= 99999) {
      // Divide the number by 1000 and round it to 1 decimal place
      const formattedNumber = (number / 1000).toFixed(1);

      // Add 'K' to the formatted number
      return `${formattedNumber}K`;
    } else {
      // If the number is less than 1000, just add commas every 3 digits
      return number.toLocaleString();
    }
  };

  const calculateSum = (data, filterFunction) => {
    return data.filter(filterFunction).reduce((accumulator, item) => {
      const loanAmount = parseFloat(item.loanAmount) || 0;
      return accumulator + loanAmount;
    }, 0);
  };

  const calculateTotalDeductionCharge = (data, filterFunction) => {
    return data.filter(filterFunction).reduce((accumulator, item) => {
      const deductionCharge = parseFloat(item.totalDeductionCharge) || 0;
      return accumulator + deductionCharge;
    }, 0);
  };

  const fetchLoanData = async () => {
    setLoading(true);
    const borrowersCollection = collection(FIREBASE_DB, "borrowers");
    const adminData = collection(FIREBASE_DB, "data");

    try {
      const querySnapshot = await getDocs(borrowersCollection);
      const adminSnapshot = await getDocs(adminData);
      const loanAmt = adminSnapshot.docs.map(
        (doc) => doc.data().loanableAmount
      );
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
      const totalActiveLoanAmount = calculateSum(
        borrowerDataLoan,
        (item) => item.status === "Active"
      );
      const totalRevenueLoanAmount = calculateTotalDeductionCharge(
        borrowerDataLoan,
        (item) => item.status === "Completed"
      );
      const totalDailyRevenue = calculateTotalDeductionCharge(
        borrowerDataLoan,
        (item) =>
          item.numberOfPayments === "Daily" && item.status === "Completed"
      );
      const totalWeeklyRevenue = calculateTotalDeductionCharge(
        borrowerDataLoan,
        (item) =>
          item.numberOfPayments === "Weekly" && item.status === "Completed"
      );
      const totalMonthlyRevenue = calculateTotalDeductionCharge(
        borrowerDataLoan,
        (item) =>
          item.numberOfPayments === "Monthly" && item.status === "Completed"
      );
      const totalCompletedLoanAmount = calculateSum(
        borrowerDataLoan,
        (item) => item.status === "Completed"
      );

      const formattedloanAmount = formatNumber(loanAmt);
      const formattedActiveLoanSum = formatNumber(totalActiveLoanAmount);
      const formattedCompletedLoanSum = formatNumber(totalCompletedLoanAmount);
      const formattedRevenueLoanAmount = formatNumber(totalRevenueLoanAmount);
      const formattedtotalDailyRevenue = formatNumber(totalDailyRevenue);
      const formattedtotalWeeklyRevenue = formatNumber(totalWeeklyRevenue);
      const formattedtotalMonthlyRevenue = formatNumber(totalMonthlyRevenue);
      setLoanable(formattedloanAmount);
      setActiveLoanSum(formattedActiveLoanSum);
      setCompletedLoanSum(formattedCompletedLoanSum);
      setTotalRevenueSum(formattedRevenueLoanAmount);
      setDailyRevenueSum(formattedtotalDailyRevenue);
      setWeeklyRevenueSum(formattedtotalWeeklyRevenue);
      setMonthlyRevenueSum(formattedtotalMonthlyRevenue);
    } catch (error) {
      console.error("Error querying the borrowers collection: ", error);
    }
    setLoading(false);
  };

  const fetchMemberData = async () => {
    // Fetch active members
    const membersCollection = collection(FIREBASE_DB, "memberRegister");
    const activeMembersQuery = query(
      membersCollection,
      where("status", "==", "Member")
    );

    try {
      const activeMembersQuerySnapshot = await getDocs(activeMembersQuery);
      const activeMembersCount = activeMembersQuerySnapshot.size;

      // Fetch total members
      const totalMembersQuerySnapshot = await getDocs(membersCollection);
      const totalMembersCount = totalMembersQuerySnapshot.size;

      setActiveMembers(activeMembersCount);
      setTotalMembers(totalMembersCount);
    } catch (error) {
      console.error("Error querying borrowers collection: ", error);
    }
  };

  return (
    <DashboardWrapper>
      <DashboardWrapperMain>
        {laoding ? (
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
          <div className="row">
            <div className="col col-md-12">
              <div className="row">
                {summaryData.summary.map((item, index) => (
                  <div
                    key={`summary-${index}`}
                    className="col-6 col-md-6 col-sm-12 mb"
                  >
                    <SummaryBox item={item} />
                  </div>
                ))}
              </div>
            </div>

            {/*  <div className="col-4 hide-md">
            <SummaryBoxSpecial item={data.revenueSummary} />
          </div> */}
          </div>
        )}

        {/* <div className="row">
          <div className="col-12">
            <Box>
              <RevenueByMonthsChart />
            </Box>
          </div>
        </div> */}
      </DashboardWrapperMain>
      <DashboardWrapperRight>
        <div
          className="row"
          style={{
            justifyContent: "space-between",
            marginLeft: 5,
            marginRight: 5,
          }}
        >
          <div className="title mb">Overall</div>
          <i className="bx bx-layer" style={{ fontSize: 30 }}></i>
        </div>
        {laoding ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
              marginBottom: 40,
            }}
          >
            <Spin size="middle">Loading, plese wait.</Spin>
          </div>
        ) : (
          <div className="mb">
            <OverallList itemLeft={summaryData} />
          </div>
        )}
        <div
          className="row"
          style={{
            justifyContent: "space-between",
            marginLeft: 2,
            marginRight: 2,
          }}
        >
          <div className="title mb">Revenue</div>
          <i className="bx bx-analyse" style={{ fontSize: 30 }}></i>
        </div>
        {laoding ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
              marginBottom: 40,
            }}
          >
            <Spin size="middle">Loading, plese wait.</Spin>
          </div>
        ) : (
          <div className="mb">
            <RevenueList itemLeft={summaryData} />
          </div>
        )}
      </DashboardWrapperRight>
    </DashboardWrapper>
  );
};

export default Dashboard;

const RevenueByMonthsChart = () => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: {
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      yAxes: {
        grid: {
          display: false,
          drawBorder: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    elements: {
      bar: {
        backgroundColor: colors.green,
        borderRadius: 20,
        borderSkipped: "bottom",
      },
    },
  };

  const chartData = {
    labels: data.revenueByMonths.labels,
    datasets: [
      {
        label: "Revenue",
        data: data.revenueByMonths.data,
      },
    ],
  };
  return (
    <>
      <div
        className="row"
        style={{
          justifyContent: "space-between",
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        <div className="title mb">Revenue by months</div>
        <i className="bx bx-line-chart" style={{ fontSize: 30 }}></i>
      </div>

      <div>
        <Bar options={chartOptions} data={chartData} height={`300px`} />
      </div>
    </>
  );
};
