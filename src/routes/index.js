import { Navigate, createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Protected from "./Protected";
import GuestRoutes from "./GuestRoutes";

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
const Profile = lazy(() => import("../pages/authenticated/profile/Profile"));
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
const WinnerCircle = lazy(() =>
  import("../pages/authenticated/winnercircle/WinnerCircle")
);
const MatchWinner = lazy(() =>
  import("../pages/authenticated/winnercircle/MatchWinner")
);
const UserPaticipate = lazy(() =>
  import("../pages/authenticated/winnercircle/UserPaticipate")
);
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
// const FindCoordinates = lazy(() =>
//   import("../pages/authenticated/contest/FindCoordinates")
// );
const Payments = lazy(() => import("../pages/authenticated/payment/Payments"));
const AllPayments = lazy(() =>
  import("../pages/authenticated/payment/AllPayments")
);
const GetPayment = lazy(() =>
  import("../pages/authenticated/payment/GetPayment")
);
const Socialslinks = lazy(() =>
  import("../pages/authenticated/sociallinks/Socialslinks")
);
const AddSocials = lazy(() =>
  import("../pages/authenticated/sociallinks/AddSocials")
);
const EditSocials = lazy(() =>
  import("../pages/authenticated/sociallinks/EditSocials")
);
const WeAre = lazy(() => import("../pages/authenticated/whoweare/WeAre"));
const AddWeAre = lazy(() => import("../pages/authenticated/whoweare/AddWeAre"));
const EditWeAre = lazy(() =>
  import("../pages/authenticated/whoweare/EditWeAre")
);

const PromoCodes = lazy(() =>
  import("../pages/authenticated/promo/PromoCodes")
);
const AddPromoCodes = lazy(() =>
  import("../pages/authenticated/promo/AddPromoCodes")
);
const EditPromoCodes = lazy(() =>
  import("../pages/authenticated/promo/EditPromoCodes")
);
const CouponsCodes = lazy(() =>
  import("../pages/authenticated/coupons/CouponsCodes")
);
const AddCouponsCodes = lazy(() =>
  import("../pages/authenticated/coupons/AddCouponsCodes")
);
const EditCouponsCodes = lazy(() =>
  import("../pages/authenticated/coupons/EditCouponsCodes")
);
const Restricted = lazy(() =>
  import("../pages/authenticated/restricted/Restricted")
);
const AddRestricted = lazy(() =>
  import("../pages/authenticated/restricted/AddRestricted")
);
const EditRestricted = lazy(() =>
  import("../pages/authenticated/restricted/EditRestricted")
);
const Application = lazy(() =>
  import("../pages/authenticated/application/Application")
);
const AddApplication = lazy(() =>
  import("../pages/authenticated/application/AddApplication")
);
const EditApplication = lazy(() =>
  import("../pages/authenticated/application/EditApplication")
);
const FindCoordinates = lazy(() =>
  import("../pages/authenticated/winnercircle/FindCoordinates")
);
const Subsribers = lazy(() =>
  import("../pages/authenticated/subscriber/Subsribers")
);

/**
 * Lazy wrapper to enable Suspense fallback for lazy-loaded components.
 * @param {React.Component} Component - The component to be wrapped.
 * @returns {React.Component} - The wrapped component with Suspense fallback.
 */
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
          path: "profile",
          element: LazyComponent(Profile),
        },
        {
          path: "dashboard",
          element: LazyComponent(Dashboard),
        },
        {
          path: "users",
          element: LazyComponent(UsersData),
        },
        {
          path: "applicatiom_management",
          element: LazyComponent(Application),
        },
        {
          path: "applicatiom_management/add-application",
          element: LazyComponent(AddApplication),
        },
        {
          path: "applicatiom_management/edit-application/:id",
          element: LazyComponent(EditApplication),
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
        // {
        //   path: "contest_management/add-contest/find-coordinates",
        //   element: LazyComponent(FindCoordinates),
        // },
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
          path: "blogs",
          element: LazyComponent(InPress),
        },
        {
          path: "blogs/add-blogs",
          element: LazyComponent(AddPress),
        },
        {
          path: "blogs/edit-blogs/:id",
          element: LazyComponent(EditPress),
        },
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
        {
          path: "allpayments",
          element: LazyComponent(AllPayments),
        },
        {
          path: "payment",
          element: LazyComponent(Payments),
        },
        {
          path: "payment/payment-singlecontest/:id",
          element: LazyComponent(GetPayment),
        },
        {
          path: "restricted",
          element: LazyComponent(Restricted),
        },
        {
          path: "restricted/add_area",
          element: LazyComponent(AddRestricted),
        },
        {
          path: "restricted/edit_area/:id",
          element: LazyComponent(EditRestricted),
        },
        {
          path: "coupons",
          // path: "promocodes",
          element: LazyComponent(PromoCodes),
        },
        {
          // path: "promocodes/new_promo",
          path: "coupons/new_coupons",

          element: LazyComponent(AddPromoCodes),
        },
        {
          // path: "promocodes/edit_promo/:id",
          path: "coupons/edit_coupons/:id",

          element: LazyComponent(EditPromoCodes),
        },
        {
          path: "promocodes",

          // path: "coupons",
          element: LazyComponent(CouponsCodes),
        },
        {
          // path: "coupons/new_coupons",
          path: "promocodes/new_promo",
          element: LazyComponent(AddCouponsCodes),
        },
        {
          // path: "coupons/edit_coupons/:id",
          path: "promocodes/edit_promo/:id",
          element: LazyComponent(EditCouponsCodes),
        },
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
        {
          path: "winners_circle/match-winner/:id/userpaticipate",
          element: LazyComponent(UserPaticipate),
        },
        {
          path: "winners_circle/match-winner/:id/find-coordinates",
          element: LazyComponent(FindCoordinates),
        },
        {
          path: "social_links",
          element: LazyComponent(Socialslinks),
        },
        {
          path: "social_links/add_links",
          element: LazyComponent(AddSocials),
        },
        {
          path: "social_links/edit_links/:id",
          element: LazyComponent(EditSocials),
        },
        {
          path: "who_we_are",
          element: LazyComponent(WeAre),
        },
        {
          path: "who_we_are/add_details",
          element: LazyComponent(AddWeAre),
        },
        {
          path: "who_we_are/edit_details/:id",
          element: LazyComponent(EditWeAre),
        },
        {
          path: "contacts",
          element: LazyComponent(ContactUs),
        },
        {
          path: "contacts/contact",
          element: LazyComponent(Contact),
        },

        {
          path: "subscribers",
          element: LazyComponent(Subsribers),
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
    basename: "/admin-panel",
  }
);

export default routes;
