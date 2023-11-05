import { Icon } from "@iconify/react";

const sidebarNav = [
  {
    link: "/",
    section: "dashboard",
    icon: <i className="bx bx-home-alt"></i>,
    text: "Dashboard",
  },
  {
    link: "/members",
    section: "members",
    icon: <i className="bx bx-user"></i>,
    text: "Members",
  },
  {
    link: "/loans",
    section: "loans",
    icon: <i className="bx bx-collection"></i>,
    text: "Loans",
  },
  {
    link: "/duedate",
    section: "duedate",
    icon: (
      <Icon icon="tabler:calendar" style={{ fontSize: 35 }}>
        {" "}
      </Icon>
    ),
    text: "Duedates",
  },
  {
    link: "/register",
    section: "register",
    icon: <i className="bx bx-user-plus"></i>,
    text: "Register",
  },

  {
    link: "/credits",
    section: "credits",
    icon: <i className="bx bx-data"></i>,
    text: "Credits",
  },
  {
    link: "/history ",
    section: "history",
    icon: <i className="bx bx-history"></i>,
    text: "History",
  },
  {
    link: "/settings",
    section: "settings",
    icon: <i className="bx bx-cog"></i>,
    text: "Settings",
  },
];

export default sidebarNav;
