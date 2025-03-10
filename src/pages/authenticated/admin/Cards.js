import React, { memo, useCallback } from "react";
import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import GroupsIcon from "@mui/icons-material/Groups";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import OnlinePredictionIcon from "@mui/icons-material/OnlinePrediction";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate } from "react-router-dom";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import FeedbackIcon from "@mui/icons-material/Feedback";
import QuizIcon from "@mui/icons-material/Quiz";
import SourceIcon from "@mui/icons-material/Source";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

const images = ["GroupsIcon"];

function Card(props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(0);
  const navigate = useNavigate();

  const override = {
    display: "block",
    margin: "40px 0 auto",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  const handleToggle = () => {
    // navigate("/user");
  };

  return (
    <>
      <div className="row d-flex gap- flex-wrap px-2">
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
        <div className="col-xl-6 col-sm-6 mb-xl-0 mb-4 pb-2 mt-4">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="font-weight-bold">Congratulations John! 🎉</h5>
              <p className="text-secondary">Best seller of the month</p>
              <div className="d-flex align-items-center justify-content-center mt-2">
                <i
                  className="fas fa-trophy"
                  style={{ fontSize: "50px", color: "#ffca28" }}
                ></i>
                <div className="ml-3">
                  <h4 className="text-primary font-weight-bold">$42.8k</h4>
                  <p className="text-secondary">78% of target 🚀</p>
                </div>
              </div>
              {/* <button className="btn btn-primary mt-3">View Sales</button> */}
            </div>
          </div>
        </div>
        <div class="col-xl-6 col-sm-6 mb-xl-0 mb-4 pb-2 mt-4">
          <div class="card">
            <div
              class="card-header p-4 d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer", height: "100px" }}
            >
              <div class="text-end pt-1 d-flex flex-column justify-content-center align-items-center">
                <p
                  style={{
                    color: "black",
                    fontWeight: 500,
                    fontSize: "1.2rem",
                  }}
                  class="mb-0 text-capitalize"
                >
                  Transactions
                </p>
                <h4 class="mb-0 mt-2"></h4>
              </div>
            </div>
            {/* <hr class="dark horizontal my-0" /> */}
            <div class="card-body">
              <p class="text-secondary mb-2">
                Total <strong>48.5% Growth 😎</strong> this month
              </p>
              <div class="d-flex justify-content-between">
                <div class="d-flex align-items-center gap-2">
                  <i class="fas fa-clock" style={{ color: "#9C27B0" }}></i>
                  <span>Sales</span>
                  <strong>245k</strong>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <i class="fas fa-users" style={{ color: "#4CAF50" }}></i>
                  <span>Users</span>
                  <strong>12.5k</strong>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <i class="fas fa-laptop" style={{ color: "#FFC107" }}></i>
                  <span>Products</span>
                  <strong>1.54k</strong>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <i
                    class="fas fa-dollar-sign"
                    style={{ color: "#2196F3" }}
                  ></i>
                  <span>Revenue</span>
                  <strong>$88k</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 pb-2 mt-4">
          <div className="card">
            <div
              className="card-header p-4 d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer", height: "100px" }}
            >
              <div>
                <GroupsIcon className="fs-1 mt-2" style={{ color: "orange" }} />
              </div>
              <div
                className="text-end pt-1 d-flex flex-column justify-content-center align-items-center"
                // onClick={handleToggle}
              >
                <p
                  style={{
                    color: "black",
                    fontWeight: "500",
                    fontSize: "1.2rem",
                  }}
                  className="mb-0 text-capitalize"
                >
                  Users
                </p>
                <h4 className="mb-0 mt-2">{props?.data?.Users}</h4>
              </div>
            </div>

            <hr className="dark horizontal my-0" />
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-4">
          <div className="card">
            <div
              className="card-header p-4 d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer", height: "100px" }}
            >
              <div className="">
                <Diversity1Icon
                  className="fs-1 mt-2"
                  style={{ color: "pink" }}
                />
              </div>
              <div className="text-end pt-1 d-flex flex-column justify-content-center align-items-center">
                <p
                  style={{
                    color: "black",
                    fontWeight: "500",
                    fontSize: "1.2rem",
                  }}
                  className=" mb-0 text-capitalize "
                >
                  New Contest
                </p>
                <h4 className="mb-0 mt-2">{props?.data?.Groups}</h4>
              </div>
            </div>

            <hr className="dark horizontal my-0" />
          </div>
        </div>

        <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-4">
          <div className="card">
            <div
              className="card-header p-4 d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer", height: "100px" }}
            >
              <div className="">
                <EmojiEventsIcon
                  className="fs-1 mt-2"
                  style={{ color: "red" }}
                />
              </div>
              <div className="text-end pt-1 d-flex flex-column justify-content-center align-items-center">
                <p
                  style={{
                    color: "black",
                    fontWeight: "500",
                    fontSize: "1.2rem",
                  }}
                  className=" mb-0 text-capitalize "
                >
                  Contest
                </p>
                <h4 className="mb-0 mt-2">{props?.data?.Questions}</h4>
              </div>
            </div>

            <hr className="dark horizontal my-0" />
          </div>
        </div>

        <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-4">
          <div className="card" >
            <div
              className="card-header p-4 d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer", height: "100px" }}
            >
              <div className="">
                <SourceIcon className="fs-1 mt-2" style={{ color: "black" }} />
              </div>
              <div className="text-end pt-1 d-flex flex-column justify-content-center align-items-center">
                <p
                  style={{
                    color: "black",
                    fontWeight: "500",
                    fontSize: "1.2rem",
                  }}
                  className=" mb-0 text-capitalize "
                >
                  Support
                </p>
                <h4 className="mb-0 mt-2">{props?.data?.Content}</h4>
              </div>
            </div>

            <hr className="dark horizontal my-0" />
          </div>
        </div>

      </div>
    </>
  );
}

export default memo(Card);
