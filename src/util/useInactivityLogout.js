import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const TIMEOUT = parseInt("1800000"); // 30 minutes

const useInactivityLogout = () => {
  //   const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const resetTimer = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const currentToken = localStorage.getItem("token");
      if (!currentToken) return;

      localStorage.removeItem("token");
      localStorage.removeItem("name");

      Swal.fire({
        icon: "warning",
        title: "Session Expired",
        text: "You have been logged out due to inactivity.",
        allowOutsideClick: false,
        confirmButtonText: "OK",
      }).then(
        () => {
          window.location.href = "/admin-panel";
        }

        //  navigate("/")
      );
    }, TIMEOUT);
  }, []);

  useEffect(() => {
    const events = ["mousemove", "keydown", "click"];
    const checkAndReset = () => {
      const token = localStorage.getItem("token");
      if (token) resetTimer();
    };

    checkAndReset(); // Run once on mount
    events.forEach((event) => window.addEventListener(event, checkAndReset));

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((event) =>
        window.removeEventListener(event, checkAndReset)
      );
    };
  }, [resetTimer]);
};

export default useInactivityLogout;
