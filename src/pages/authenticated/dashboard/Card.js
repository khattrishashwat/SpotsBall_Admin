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
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import FeedbackIcon from "@mui/icons-material/Feedback";
import QuizIcon from "@mui/icons-material/Quiz";
import SourceIcon from "@mui/icons-material/Source";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";

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
        <div
          style={
            {
              // width: "100%",
              // height: "100%",
              // position: "absolute",
              // top: "100%",
              // left: "40%",
            }
          }
        >
          <ClipLoader
            // color={color}
            loading={loading}
            // cssOverride={override}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>

        <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 pb-2">
          <div className="card"  onClick={()=>navigate("/users")}>
            <div className="card-header p-4 d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
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
                  Users Management
                </p>
                <h4 className="mb-0 mt-2">{props?.data?.Users}</h4>
              </div>
            </div>

            <hr className="dark horizontal my-0" />
            <div className="card-footer p-3">
              <p className="mb-0">
                <span className="text-success text-sm font-weight-bolder">
                  {/* update */}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
          <div className="card" style={{height:"155px"}} onClick={()=>navigate("/subscription")}>
            <div className="card-header p-4 d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
              <div>
                <SubscriptionsIcon
                  className="fs-1 mt-2"
                  style={{ color: "purple" }}
                />
              </div>
              <div
                className="text-end pt-1 d-flex flex-column justify-content-center align-items-center"
                // onClick={handleToggle}
                
              >
                <p
                  style={{
                    color: "black",
                    fontWeight: "600",
                    fontSize: "1.1rem",
                  }}
                  className="mb-0 text-capitalize"
                >
                  How to Play 
                </p>
                <h4 className="mb-0 mt-2">{props?.data?.UserSubscriptions}</h4>
              </div>
            </div>

            <hr className="dark horizontal my-0" />
            <div className="card-footer p-3">
              <p className="mb-0">
                <span className="text-success text-sm font-weight-bolder">
                  {/* update */}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
          <div className="card" onClick={()=>navigate("/questions")}>
            <div
              className="card-header p-4 d-flex justify-content-between align-items-center"
              // onClick={() => navigate("/category")}
              style={{ cursor: "pointer" }}
            >
              <div className="">
                <QuestionAnswerIcon
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
                  Questions
                </p>
                <h4 className="mb-0 mt-2">{props?.data?.Questions}</h4>
              </div>
            </div>

            <hr className="dark horizontal my-0" />
            <div className="card-footer p-3">
              <p className="mb-0">
                <span className="text-success text-sm font-weight-bolder"></span>
              </p>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
          <div className="card" onClick={()=>navigate("/groups")}>
            <div
              className="card-header p-4 d-flex justify-content-between align-items-center"
              // onClick={() => navigate("/category")}
              style={{ cursor: "pointer" }}
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
                  Total Groups
                </p>
                <h4 className="mb-0 mt-2">{props?.data?.Groups}</h4>
              </div>
            </div>

            <hr className="dark horizontal my-0" />
            <div className="card-footer p-3">
              <p className="mb-0">
                <span className="text-success text-sm font-weight-bolder"></span>
              </p>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
          <div className="card" onClick={()=>navigate("/content")}>
            <div
              className="card-header p-4 d-flex justify-content-between align-items-center"
              // onClick={() => navigate("/category")}
              style={{ cursor: "pointer" }}
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
                  Total Contents
                </p>
                <h4 className="mb-0 mt-2">{props?.data?.Content}</h4>
              </div>
            </div>

            <hr className="dark horizontal my-0" />
            <div className="card-footer p-3">
              <p className="mb-0">
                <span className="text-success text-sm font-weight-bolder"></span>
              </p>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
          <div className="card" onClick={()=>navigate("/feedbacks")}>
            <div
              className="card-header p-4 d-flex justify-content-between align-items-center"
              // onClick={() => navigate("/category")}
              style={{ cursor: "pointer" }}
            >
              <div className="">
                <FeedbackIcon className="fs-1 mt-2" style={{ color: "gold" }} />
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
                  Feedbacks
                </p>
                <h4 className="mb-0 mt-2">{props?.data?.Feedbacks}</h4>
              </div>
            </div>

            <hr className="dark horizontal my-0" />
            <div className="card-footer p-3">
              <p className="mb-0">
                <span className="text-success text-sm font-weight-bolder"></span>
              </p>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
          <div className="card" onClick={()=>navigate("/faqs")}>
            <div
              className="card-header p-4 d-flex justify-content-between align-items-center"
              // onClick={() => navigate("/category")}
              style={{ cursor: "pointer" }}
            >
              <div className="">
                <QuizIcon className="fs-1 mt-2" style={{ color: "blue" }} />
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
                  FAQ
                </p>
                <h4 className="mb-0 mt-2">{props?.data?.Faq}</h4>
              </div>
            </div>

            <hr className="dark horizontal my-0" />
            <div className="card-footer p-3">
              <p className="mb-0">
                <span className="text-success text-sm font-weight-bolder"></span>
              </p>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
          <div className="card" onClick={()=>navigate("/contacts")}>
            <div
              className="card-header p-4 d-flex justify-content-between align-items-center"
              // onClick={() => navigate("/category")}
              style={{ cursor: "pointer" }}
            >
              <div className="">
                <ContactMailIcon
                  className="fs-1 mt-2"
                  style={{ color: "green" }}
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
                  Contact Us
                </p>
                <h4 className="mb-0 mt-2">{props?.data?.ContactUs}</h4>
              </div>
            </div>

            <hr className="dark horizontal my-0" />
            <div className="card-footer p-3">
              <p className="mb-0">
                <span className="text-success text-sm font-weight-bolder"></span>
              </p>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
          <div className="card" onClick={()=>navigate("/contacts")}>
            <div
              className="card-header p-4 d-flex justify-content-between align-items-center"
              // onClick={() => navigate("/category")}
              style={{ cursor: "pointer" }}
            >
              <div className="">
                <ContactMailIcon
                  className="fs-1 mt-2"
                  style={{ color: "green" }}
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
                  Contact Us
                </p>
                <h4 className="mb-0 mt-2">{props?.data?.ContactUs}</h4>
              </div>
            </div>

            <hr className="dark horizontal my-0" />
            <div className="card-footer p-3">
              <p className="mb-0">
                <span className="text-success text-sm font-weight-bolder"></span>
              </p>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
          <div className="card" onClick={()=>navigate("/contacts")}>
            <div
              className="card-header p-4 d-flex justify-content-between align-items-center"
              // onClick={() => navigate("/category")}
              style={{ cursor: "pointer" }}
            >
              <div className="">
                <ContactMailIcon
                  className="fs-1 mt-2"
                  style={{ color: "green" }}
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
                  Contact Us
                </p>
                <h4 className="mb-0 mt-2">{props?.data?.ContactUs}</h4>
              </div>
            </div>

            <hr className="dark horizontal my-0" />
            <div className="card-footer p-3">
              <p className="mb-0">
                <span className="text-success text-sm font-weight-bolder"></span>
              </p>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
          <div className="card" onClick={()=>navigate("/contacts")}>
            <div
              className="card-header p-4 d-flex justify-content-between align-items-center"
              // onClick={() => navigate("/category")}
              style={{ cursor: "pointer" }}
            >
              <div className="">
                <ContactMailIcon
                  className="fs-1 mt-2"
                  style={{ color: "green" }}
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
                  Contact Us
                </p>
                <h4 className="mb-0 mt-2">{props?.data?.ContactUs}</h4>
              </div>
            </div>

            <hr className="dark horizontal my-0" />
            <div className="card-footer p-3">
              <p className="mb-0">
                <span className="text-success text-sm font-weight-bolder"></span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(Card);
