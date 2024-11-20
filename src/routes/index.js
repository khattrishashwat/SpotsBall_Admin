import { Navigate, createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Protected from "./Protected";
import GuestRoutes from "./GuestRoutes";
import Payments from "../pages/authenticated/payment/Payments";
import GetPayment from "../pages/authenticated/payment/GetPayment";

// Lazy load components
const NotFound = lazy(() => import("../pages/common/NotFound"));
const Register = lazy(() => import("../pages/auth/Register"));
const Login = lazy(() => import("../pages/auth/Login"));
const Forgot = lazy(() => import("../pages/auth/Forgot"));
const Reset = lazy(() => import("../pages/auth/Reset"));
const Dashboard = lazy(() =>
  import("../pages/authenticated/dashboard/Dashboard")
);
const Banner = lazy(() => import("../pages/authenticated/banner/Banner"));
const AddBanner = lazy(() => import("../pages/authenticated/banner/AddBanner"));
const EditBanner = lazy(() =>
  import("../pages/authenticated/banner/EditBanner")
);
const PlayVideo = lazy(() =>
  import("../pages/authenticated/howtoPlay/PlayVideo")
);
const AddPlay = lazy(() => import("../pages/authenticated/howtoPlay/AddPlay"));
const EditPlay = lazy(() =>
  import("../pages/authenticated/howtoPlay/EditPlay")
);
const InPress = lazy(() => import("../pages/authenticated/Press/InPress"));
const AddPress = lazy(() => import("../pages/authenticated/Press/AddPress"));
const EditPress = lazy(() => import("../pages/authenticated/Press/EditPress"));
const UsersData = lazy(() => import("../pages/authenticated/UsersData"));
const Profile = lazy(() => import("../pages/authenticated/Profile"));
const Groups = lazy(() => import("../pages/authenticated/group/Groups"));
const AddGroup = lazy(() => import("../pages/authenticated/group/AddGroup"));
const EditGroup = lazy(() => import("../pages/authenticated/group/EditGroup"));
const Content = lazy(() => import("../pages/authenticated/content/Content"));
const NewContent = lazy(() =>
  import("../pages/authenticated/content/NewContent")
);
const EditContent = lazy(() =>
  import("../pages/authenticated/content/EditContent")
);
const EditQuestions = lazy(() =>
  import("../pages/authenticated/question/EditQuestion")
);
const FAQ = lazy(() => import("../pages/authenticated/faq/FAQ"));
const AddFAQ = lazy(() => import("../pages/authenticated/faq/AddFAQ"));
const EditFAQ = lazy(() => import("../pages/authenticated/faq/EditFAQ"));
const Winners = lazy(() => import("../pages/authenticated/winners/Winners"));
const View = lazy(() => import("../pages/authenticated/winners/View"));
const WinnerCircle = lazy(() => import("../pages/authenticated/winnercircle/WinnerCircle"));
const MatchWinner = lazy(() => import("../pages/authenticated/winnercircle/MatchWinner"));
const ContactUs = lazy(() =>
  import("../pages/authenticated/contactus/ContactUs")
);
const Contact = lazy(() => import("../pages/authenticated/contactus/Contact"));
const UserAccountDelete = lazy(() =>
  import("../pages/authenticated/UserAccountDelete")
);

const Contestmanagement = lazy(() =>
  import("../pages/authenticated/contest/Contestmanagement")
);
const AddContest = lazy(() =>
  import("../pages/authenticated/contest/AddContest")
);
const EditContest = lazy(() =>
  import("../pages/authenticated/contest/EditContest")
);
const FindCoordinates = lazy(() =>
  import("../pages/authenticated/contest/FindCoordinates")
);

// Suspense wrapper for lazy components
const LazyComponent = (Component) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Component />
  </Suspense>
);

const routes = createBrowserRouter(
  [
    // Default redirect to login
    {
      path: "/",
      element: <Navigate to="/auth/login" />,
    },
    // Route for account deletion
    {
      path: "delete-user-account",
      element: LazyComponent(UserAccountDelete),
    },
    // Guest routes
    {
      path: "/auth",
      element: <GuestRoutes />,
      children: [
        {
          path: "",
          element: <Navigate to="login" />,
        },
        {
          path: "register",
          element: LazyComponent(Register),
        },
        {
          path: "login",
          element: LazyComponent(Login),
        },
        {
          path: "forgot",
          element: LazyComponent(Forgot),
        },
        {
          path: "reset",
          element: LazyComponent(Reset),
        },
      ],
    },
    // Protected routes
    {
      path: "/",
      element: <Protected />,
      children: [
        {
          path: "dashboard",
          element: LazyComponent(Dashboard),
        },
        {
          path: "users",
          element: LazyComponent(UsersData),
        },
        {
          path: "contest_management",
          element: LazyComponent(Contestmanagement),
        },
        {
          path: "contest_management/add-contest",
          element: LazyComponent(AddContest),
        },
        {
          path: "contest_management/edit-contest/:id",
          element: LazyComponent(EditContest),
        },
        {
          path: "contest_management/add-contest/find-coordinates",
          element: LazyComponent(FindCoordinates),
        },
        {
          path: "banner",
          element: LazyComponent(Banner),
        },
        {
          path: "banner/add-banner",
          element: LazyComponent(AddBanner),
        },
        {
          path: "banner/edit-banner/:id",
          element: LazyComponent(EditBanner),
        },
        {
          path: "how_to_play",
          element: LazyComponent(PlayVideo),
        },
        {
          path: "how_to_play/add-play",
          element: LazyComponent(AddPlay),
        },
        {
          path: "how_to_play/edit-play/:id",
          element: LazyComponent(EditPlay),
        },
        {
          path: "In_Press",
          element: LazyComponent(InPress),
        },
        {
          path: "In_Press/add-press",
          element: LazyComponent(AddPress),
        },
        {
          path: "In_Press/edit-press/:id",
          element: LazyComponent(EditPress),
        },
        // Content management routes
        {
          path: "content",
          element: LazyComponent(Content),
        },
        {
          path: "content/new-content",
          element: LazyComponent(NewContent),
        },
        {
          path: "content/edit-content/:id",
          element: LazyComponent(EditContent),
        },
        // {
        //   path: "questions/edit-question/:id",
        //   element: LazyComponent(EditQuestions),
        // },
        {
          path: "payment",
          element: LazyComponent(Payments),
        },
        {
          path: "payment/payment-singlecontest/:id",
          element: LazyComponent(GetPayment),
        },
        // FAQ routes
        {
          path: "faqs",
          element: LazyComponent(FAQ),
        },
        {
          path: "faqs/add-faq",
          element: LazyComponent(AddFAQ),
        },
        {
          path: "faqs/update-faq/:id",
          element: LazyComponent(EditFAQ),
        },
        // Winner routes
        {
          path: "winner",
          element: LazyComponent(Winners),
        },
        {
          path: "winner/view",
          element: LazyComponent(View),
        },
        {
          path: "winners_circle",
          element: LazyComponent(WinnerCircle),
        },

        {
          path: "winners_circle/match-winner/:id",
          element: LazyComponent(MatchWinner),
        },
        // Contact routes
        {
          path: "contacts",
          element: LazyComponent(ContactUs),
        },
        {
          path: "contact",
          element: LazyComponent(Contact),
        },
      ],
    },
    // Catch-all for 404 Not Found
    {
      path: "*",
      element: LazyComponent(NotFound),
    },
  ],
  {
    basename: "/spotsball/admin-panel",
  }
);

export default routes;
