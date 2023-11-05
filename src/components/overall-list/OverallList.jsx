import React from "react";
import "./overall-list.scss";
import { Icon } from "@iconify/react";

// import { data } from "../../constants";

const icons = [
  <i className="bx bx-collection"></i>,
  <i className="bx bx-user"></i>,
  <Icon icon="mdi:hand-coin" />,
];

const OverallList = ({ itemLeft }) => {
  return (
    <ul className="overall-list">
      {itemLeft.overall.map((item, index) => (
        <li className="overall-list__item" key={`overall-${index}`}>
          <div className="overall-list__item__icon">{icons[index]}</div>
          <div className="overall-list__item__info">
            <div className="title">{item.value}</div>
            <span>{item.title}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default OverallList;
