import React, { useState, memo } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import ClipLoader from "react-spinners/ClipLoader";

function BarGraph() {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <div className="row d-flex gap- flex-wrap px-2 mt-4">
        <div>
          <ClipLoader
            // color={color}
            loading={loading}
            // cssOverride={override}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
        <div className="col-xl-6 col-sm-6">
          {/* <h3>User Logins</h3> */}
          <BarChart
            xAxis={[
              {
                scaleType: "band",
                data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              },
            ]}
            series={[
              { label: "Normal Login", data: [50, 70, 90, 120, 140, 160] },
              { label: "Google Login", data: [40, 60, 85, 110, 130, 150] },
              { label: "Facebook Login", data: [30, 50, 75, 100, 120, 140] },
              { label: "Twitter Login", data: [20, 40, 65, 90, 110, 130] },
            ]}
            width={500}
            height={400}
          />
        </div>

        {/* Payments Bar Chart */}
        <div className="col-xl-6 col-sm-6">
          {/* <h3>Payments</h3> */}
          <BarChart
            xAxis={[
              {
                scaleType: "band",
                data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              },
            ]}
            series={[
              {
                label: "Successful Payments",
                data: [100, 130, 170, 210, 240, 290],
              },
              { label: "Failed Payments", data: [10, 20, 30, 40, 50, 60] },
            ]}
            width={500}
            height={400}
          />
        </div>
      </div>
    </>
  );
}

export default memo(BarGraph);
