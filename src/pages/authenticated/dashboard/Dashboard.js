import React, { useEffect, useState } from "react";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import PageTitle from "../../common/PageTitle";
import { CContainer } from "@coreui/react";
import Card from "./Card";
import httpClient from "../../../util/HttpClient";
import BarGraph from "./BarGraph";

const Dashboard = () => {
  const [data, setData] = useState([]);
  // useEffect(() => {
  //   httpClient.get("/admin/dashboard").then((res) => {
  //     console.log("ress => ", res.data.data);
  //     setData(res.data.data);
  //   });
  // }, []);
  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center just new">
        <AppHeader />
        <PageTitle title="Dashboard" />
        <Card data={data} />
        <BarGraph data={data} />
      </div>
    </>
  );
};

export default Dashboard;
