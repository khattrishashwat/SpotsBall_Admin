import { Navigate, createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import Protected from "./Protected";
import GuestRoutes from "./GuestRoutes";
import ContentManager from "../pages/authenticated/ContentManager";

const NotFound = lazy(() => import("../pages/common/NotFound"));

const Register = lazy(() => import("../pages/auth/Register"));
const Login = lazy(() => import("../pages/auth/Login"));
const Forgot = lazy(() => import("../pages/auth/Forgot"));
const Reset = lazy(() => import("../pages/auth/Reset"));
const Dashboard = lazy(() =>
  import("../pages/authenticated/dashboard/Dashboard")
);
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
const Questions = lazy(() =>
  import("../pages/authenticated/question/Questions")
);
const AddQuestion = lazy(() =>
  import("../pages/authenticated/question/AddQuestion")
);
const EditQuestions = lazy(() =>
  import("../pages/authenticated/question/EditQuestion")
);
const Preference = lazy(() =>
  import("../pages/authenticated/preference/Preference")
);
const Subscription = lazy(() => import("../pages/authenticated/subscription/Subscription"));
const FAQ = lazy(() => import("../pages/authenticated/faq/FAQ"));
const AddFAQ = lazy(() => import("../pages/authenticated/faq/AddFAQ"));
const EditFAQ = lazy(() => import("../pages/authenticated/faq/EditFAQ"));
const SubscriptionCategory = lazy(() =>
  import("../pages/authenticated/SubscriptionCategory")
);

const Feedbacks = lazy(() =>
  import("../pages/authenticated/feedbacks/Feedbacks")
);
const View = lazy(() => import("../pages/authenticated/feedbacks/View"));
const ContactUs = lazy(() =>
  import("../pages/authenticated/contactus/ContactUs")
);
const Contact = lazy(() => import("../pages/authenticated/contactus/Contact"));
const AppSetting = lazy(() =>
  import("../pages/authenticated/appSetting/AppSetting")
);
const LoginTrouble = lazy(() =>
  import("../pages/authenticated/loginTrouble/LoginTrouble")
);
const AddNewLoginTrouble = lazy(() =>
  import("../pages/authenticated/loginTrouble/AddNewLoginTrouble")
);
const EditLoginTrouble = lazy(() =>
  import("../pages/authenticated/loginTrouble/EditLoginTrouble")
);
const UsersSubscription = lazy(() =>
  import("../pages/authenticated/usersSubscription/UsersSubscription")
);
const ReportedUsers = lazy(() =>
  import("../pages/authenticated/reportedUsers/ReportedUsers")
);
const UserAccountDelete = lazy(() => import("../pages/authenticated/UserAccountDelete"));

const routes = createBrowserRouter(
  [
    {
      path: "/",
      element: <Navigate to={"/auth/login"} />,
    },
    {
      path: "/auth",
      Component: GuestRoutes,
      children: [
        {
          path: "",
          element: <Navigate to={"login"} />,
        },
        {
          path: "register",
          Component: Register,
        },
        {
          path: "login",
          Component: Login,
        },
        {
          path: "forgot",
          Component: Forgot,
        },
        {
          path: "reset",
          Component: Reset,
        },
        {
          path:"delete-user-account",
          Component:UserAccountDelete,
        }
      ],
    },
    {
      path: "/",
      Component: Protected,
      children: [
        {
          path: "dashboard",
          Component: Dashboard,
        },
        {
          path: "users",
          Component: UsersData,
        },
        {
          path: "groups",
          Component: Groups,
        },
        {
          path: "groups/add-group",
          Component: AddGroup,
        },
        {
          path: "groups/edit-group/:id",
          Component: EditGroup,
        },
        {
          path: "content",
          Component: Content,
        },
        {
          path: "content/new-content",
          Component: NewContent,
        },
        {
          path: "content/edit-content/:id",
          Component: EditContent,
        },
        {
          path: "questions",
          Component: Questions,
        },
        {
          path: "questions/add-question",
          Component: AddQuestion,
        },
        {
          path: "questions/edit-question/:id",
          Component: EditQuestions,
        },
        {
          path: "preference",
          Component: Preference,
        },
        {
          path: "Subscription",
          Component: Subscription,
        },
        {
          path: "faqs",
          Component: FAQ,
        },
        {
          path: "faqs/add-faq",
          Component: AddFAQ,
        },
        {
          path: "faqs/update-faq/:id",
          Component: EditFAQ,
        },
        {
          path: "subscription_category",
          Component: SubscriptionCategory,
        },
        {
          path: "feedbacks",
          Component: Feedbacks,
        },
        {
          path: "feedbacks/view",
          Component: View,
        },
        {
          path: "contacts",
          Component: ContactUs,
        },
        {
          path: "contact",
          Component: Contact,
        },
        {
          path: "app-setting",
          Component: AppSetting,
        },
        {
          path: "login-trouble",
          Component: LoginTrouble,
        },
        {
          path: "login-trouble/add-login-trouble",
          Component: AddNewLoginTrouble,
        },
        {
          path: "login-trouble/edit-login-trouble/:id",
          Component: EditLoginTrouble,
        },
        {
          path: "users-subscription",
          Component: UsersSubscription,
        },
        {
          path: "reported-users",
          Component: ReportedUsers,
        },
        
      ],
    },
    {
      path: "*",
      Component: NotFound,
    },
  ],
  {
    // basename: "/admin-panel", // <-- Replace with your actual base path
  }
);

export default routes;
