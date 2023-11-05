import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
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
        value: activeMembers,
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
        value: 20,
      },
    ],
    overall: [
      {
        value: completedLoanSum,
        title: "Overall Loans",
      },
      {
        value: activeMembers,
        title: "Members",
      },
      {
        value: "95K",
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
      // const active = borrowerDataLoan.filter(
      //   (item) => item.status === "Active"
      // );
      // const completed = borrowerDataLoan.filter(
      //   (item) => item.status === "Completed"
      // );
      // const revenueDaily = borrowerDataLoan.filter(
      //   (item) => item.numberOfPayments === "Daily"
      // );
      // const revenueWeekly = borrowerDataLoan.filter(
      //   (item) => item.numberOfPayments === "Weekly"
      // );
      // const revenueMonthly = borrowerDataLoan.filter(
      //   (item) => item.numberOfPayments === "Monthly"
      // );

      // // Calculate the sum of active loanAmount
      // const totalActiveLoanAmount = active.reduce((accumulator, loan) => {
      //   const loanAmount = parseFloat(loan.loanAmount) || 0;
      //   return accumulator + loanAmount;
      // }, 0);

      // // Calculate the sum of revenue loanAmount
      // const totalRevenueLoanAmount = completed.reduce(
      //   (accumulator, revenue) => {
      //     const loanAmount = parseFloat(revenue.totalDeductionCharge) || 0;
      //     return accumulator + loanAmount;
      //   },
      //   0
      // );
      // // daily
      // const totalDailyRevenue = revenueDaily.reduce((accumulator, revenue) => {
      //   const loanAmount = parseFloat(revenue.totalDeductionCharge) || 0;
      //   return accumulator + loanAmount;
      // }, 0);
      // // weekly
      // const totalWeeklyRevenue = revenueWeekly.reduce(
      //   (accumulator, revenue) => {
      //     const loanAmount = parseFloat(revenue.totalDeductionCharge) || 0;
      //     return accumulator + loanAmount;
      //   },
      //   0
      // );
      // // monthly
      // const totalMonthlyRevenue = revenueMonthly.reduce(
      //   (accumulator, revenue) => {
      //     const loanAmount = parseFloat(revenue.totalDeductionCharge) || 0;
      //     return accumulator + loanAmount;
      //   },
      //   0
      // );

      // // Calculate the sum of complted loanAmount
      // const totalCompletedLoanAmount = completed.reduce((accumulator, loan) => {
      //   const loanAmount = parseFloat(loan.loanAmount) || 0;
      //   return accumulator + loanAmount;
      // }, 0);

      const formattedActiveLoanSum = formatNumber(totalActiveLoanAmount);
      const formattedCompletedLoanSum = formatNumber(totalCompletedLoanAmount);
      const formattedRevenueLoanAmount = formatNumber(totalRevenueLoanAmount);
      const formattedtotalDailyRevenue = formatNumber(totalDailyRevenue);
      const formattedtotalWeeklyRevenue = formatNumber(totalWeeklyRevenue);
      const formattedtotalMonthlyRevenue = formatNumber(totalMonthlyRevenue);
      setActiveLoanSum(formattedActiveLoanSum);
      setCompletedLoanSum(formattedCompletedLoanSum);
      setTotalRevenueSum(formattedRevenueLoanAmount);
      setDailyRevenueSum(formattedtotalDailyRevenue);
      setWeeklyRevenueSum(formattedtotalWeeklyRevenue);
      setMonthlyRevenueSum(formattedtotalMonthlyRevenue);
    } catch (error) {
      console.error("Error querying the borrowers collection: ", error);
    }
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
        <div className="row">
          <div className="col-12">
            <Box>
              <RevenueByMonthsChart />
            </Box>
          </div>
        </div>
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
        <div className="mb">
          <OverallList itemLeft={summaryData} />
        </div>
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
        <div className="mb">
          <RevenueList itemLeft={summaryData} />
        </div>
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
