import React from "react";
// import { data } from "../../constants";
import "./revenue-list.scss";
import ProgressBar from "../progressbar/ProgressBar";

const RevenueList = ({ itemLeft }) => {
  return (
    <ul className="revenue-list">
      {itemLeft.revenueByChannel.map((item, index) => (
        <li className="revenue-list__item" key={`revenue-${index}`}>
          <div className="revenue-list__item__title">
            {item.title}
            <span className={`${item.value && "txt-success"}`}>
              {item.value}
            </span>
          </div>
          <div>
            <ProgressBar value={item.value} />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default RevenueList;
