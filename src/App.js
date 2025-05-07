import { RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import routes from "./routes/index";
import "./styles/style.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import Loader from "./components/loader/Loader";
import { LanguageProvider } from "./LanguageContext";
import useInactivityLogout from "./util/useInactivityLogout";
import "./App.css";
function App() {
  useInactivityLogout();

  return (
    <LanguageProvider>
      <Suspense fallback={<Loader />}>
        <RouterProvider router={routes} />
      </Suspense>
    </LanguageProvider>
  );
}

export default App;
