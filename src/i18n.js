import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

// Initialize i18n
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: localStorage.getItem("language") || "en",
    fallbackLng: ["en", "hi"],
    debug: false,

    resources: {
      en: {
        translation: {
          Dashboard: "Dashboard",
          "Admin Management": "Admin Management",
          Admin: "Admin",
          "Admin Activities": "Admin Activities",
          "User Management": "User Management",
          Users: "Users",
          Activity: "Activity",
          Subscriber: "Subscriber",
          "Send Notification": "Send Notification",
          "Contest Management": "Contest Management",
          Contest: "Contest",
          "Contest Payment": "Contest Payment",
          "Promo Codes": "Promo Codes",
          "Discount Coupons": "Discount Coupons",
          "Winner Management": "Winner Management",
          "Winner Announcement": "Winner Announcement",
          "Winner List": "Winner List",
          Payments: "Payments",
          "All Payments": "All Payments",
          "Content Management": "Content Management",
          "Content Pages": "Content Pages",
          FAQ: "FAQ",
          Blogs: "Blogs",
          "Who We Are": "Who We Are",
          "PlatForm Setting": "PlatForm Setting",
          "Social Link": "Social Link",
          "Restricted Area": "Restricted Area",
          "How To Play": "How To Play",
          "APK Download": "APK Download",
          Notifications: "Notifications",
          "Send Notification": "Send Notification",
          "Send Emails": "Send Emails",
          "Support & Help Center": "Support & Help Center",
          "No data found": "No data found",
          Profile: "Profile",
          "De-Active/Active": "De-Active/Active",
          Name: "Name",
          Email: "Email",
          "Phone Number": "Phone Number",
          Country: "Country",
          Status: "Status",
          TimeStamp: "TimeStamp",
          "Created Date": "Created Date",
          Action: "Action",
          "Add New Admin": "Add New Admin",
          "Records per page": "Records per page",
          "Search:": "Search:",
          "Search by name, email, phone, etc.":
            "Search by name, email, phone, etc.",
          Show: "Show",
          "Admin Activities Management": "Admin Activities Management",
          Member: "Member",
          "Log's": "Log's",
          Hours: "Hours",
          "Email/Phone": "Email/Phone",
          "Updated At": "Updated At",
          "Created At": "Created At",
          Subscribers: "Subscribers",
          Back: "Back",
          "Add New Notification": "Add New Notification",
          Submit: "Submit",
          User: "User",
          "Send To:": "Send To:",
          Message: "Message",
          Title: "Title",
          TimeStamp: "TimeStamp",
          "New Notification": "New Notification",
          Close: "Close",
          "Support :": "Support :",
          Team: "Team",
          "Updating...": "Updating...",
          "Update APK File": "Update APK File",
          "Add APP Link": "Add APP Link",
          "Appication Links": "Appication Links",
          "Application Links": "Application Links",
          Delete: "Delete",
          "Apk Link": "Apk Link",
          App: "App",
          Platform: "Platform",
          "Social Links": "Social Links",
          "Banner Image": "Banner Image",
          "Edit Banner GIFs": "Edit Banner GIFs",
          Replace: "Replace",
          "Update GIFs": "Update GIFs",
          "Banner Gifs": "Banner Gifs",
          Banner: "Banner",
          "Banner Management": "Banner Management",
          Image: "Image",
          "Max Ticket": "Max Ticket",
          "Ticket Price": "Ticket Price",
          "Total Amount Collect": "Total Amount Collect",
          "Total Ticket Buy": "Total Ticket Buy",
          "Contest Payments Details": "Contest Payments Details",
          "No coordinates available.": "No coordinates available.",
          "Y Coordinate": "Y Coordinate",
          "X Coordinate": "X Coordinate",
          Coordinates: "Coordinates",
          "User Payments Details": "User Payments Details",
          "Transaction Status": "Transaction Status",
          "No. Coordinates Chosen": "No. Coordinates Chosen",
          "Payment ID": "Payment ID",
          "Promo Codes": "Promo Codes",
          Amount: "Amount",
          "Total Platform Amount": "Total Platform Amount",
          "GST Platform Fee Amount": "GST Platform Fee Amount",
          "Platform Fee Amount": "Platform Fee Amount",
          "Sub Total Amount": "Sub Total Amount",
          "GST Amount": "GST Amount",
          "Discount Amount": "Discount Amount",
          "Tickets Price": "Tickets Price",
          Tickets: "Tickets",
          "User Name": "User Name",
          "Transaction Status": "Transaction Status",
          "Payment ID": "Payment ID",
          "Amount (All Tax Included)": "Amount (All Tax Included)",
          "Ticket Amount": "Ticket Amount",
          "₹ Price": "₹ Price",
          "No records to display": "No records to display",
          "Add Contest": "Add Contest",
          "Contest Start Date": "Contest Start Date",
          "Contest End Date": "Contest End Date",
          "Create a New Discount Coupons": "Create a New Discount Coupons",

          Name: "Name",
          "Minimum Tickets": "Minimum Tickets",
          "Maximum Tickets": "Maximum Tickets",
          "Discount Percentage": "Discount Percentage",
          "Min Ticket": "Min Ticket",
          "Add New Coupons": "Add New Coupons",
          "Promo Codes": "Promo Codes",
          "Add New Promo Code": "Add New Promo Code",
          Amount: "Amount",
          "Edit Promo Code": "Edit Promo Code",
          Update: "Update",
          Discount: "Discount",
          "": "",
          "": "",
          "": "",
          "": "",
          "": "",
          "": "",
          "": "",
        },
      },
      hi: {
        translation: {
          Dashboard: "डैशबोर्ड",
          "Admin Management": "एडमिन प्रबंधन",
          Admin: "एडमिन्स",
          "Admin Activities": "एडमिन गतिविधियाँ",
          "User Management": "उपयोगकर्ता प्रबंधन",
          Users: "उपयोगकर्ता",
          Activity: "गतिविधि",
          Subscriber: "सदस्य",
          "Send Notification": "सूचना भेजें",
          "Contest Management": "प्रतियोगिता प्रबंधन",
          Contest: "प्रतियोगिता",
          "Contest Payment": "प्रतियोगिता भुगतान",
          "Promo Codes": "प्रोमो कोड",
          "Discount Coupons": "डिस्काउंट कूपन",
          "Winner Management": "विजेता प्रबंधन",
          "Winner Announcement": "विजेता घोषणा",
          "Winner List": "विजेता सूची",
          Payments: "भुगतान",
          "All Payments": "सभी भुगतान",
          "Content Management": "सामग्री प्रबंधन",
          "Content Pages": "सामग्री पृष्ठ",
          FAQ: "सामान्य प्रश्न",
          Blogs: "ब्लॉग्स",
          "Who We Are": "हम कौन हैं",
          "PlatForm Setting": "प्लेटफ़ॉर्म सेटिंग",
          "Social Link": "सोशल लिंक",
          "Restricted Area": "प्रतिबंधित क्षेत्र",
          "How To Play": "कैसे खेलें",
          "APK Download": "एपीके डाउनलोड",
          Notifications: "सूचनाएं",
          "Send Emails": "ईमेल भेजें",
          "Support & Help Center": "सहायता एवं सहायता केंद्र",
          "No data found": "कोई डेटा नहीं मिला",
          Profile: "प्रोफ़ाइल",
          "De-Active/Active": "निष्क्रिय/सक्रिय",
          Name: "नाम",
          Email: "ईमेल",
          "Phone Number": "फोन नंबर",
          Country: "देश",
          Status: "स्थिति",
          TimeStamp: "समय-चिह्न",
          "Created Date": "निर्माण तिथि",
          Action: "क्रिया",
          "Add New Admin": "नया एडमिन जोड़ें",
          "Records per page": "प्रति पृष्ठ रिकॉर्ड",
          "Search:": "खोजें:",
          "Search by name, email, phone, etc.":
            "नाम, ईमेल, फोन आदि द्वारा खोजें",
          Show: "दिखाएं",
          "Admin Activities Management": "एडमिन गतिविधि प्रबंधन",
          Member: "सदस्य",
          "Log's": "लॉग्स",
          Hours: "घंटे",
          "Email/Phone": "ईमेल/फोन",
          "Updated At": "अपडेट किया गया",
          "Created At": "बनाया गया",
          Subscribers: "सदस्य",
          Back: "वापस",
          "Add New Notification": "नई सूचना जोड़ें",
          Submit: "सबमिट करें",
          User: "उपयोगकर्ता",
          "Send To:": "भेजें:",
          Message: "संदेश",
          Title: "शीर्षक",
          TimeStamp: "समय मुहर",
          "New Notification": "नई सूचना",
          Close: "बंद करें",
          "Support :": "समर्थन :",
          Team: "टीम",
          "Updating...": "अपडेट हो रहा है...",
          "Update APK File": "APK फ़ाइल अपडेट करें",
          "Add APP Link": "ऐप लिंक जोड़ें",
          "Appication Links": "एप्लिकेशन लिंक",
          "Application Links": "एप्लिकेशन लिंक",
          Delete: "हटाएं",
          "Apk Link": "APK लिंक",
          App: "ऐप",
          Platform: "मंच",
          "Social Links": "सामाजिक लिंक",
          "Banner Image": "बैनर छवि",
          "Edit Banner GIFs": "बैनर गिफ्स संपादित करें",
          Replace: "बदलें",
          "Update GIFs": "गिफ्स अपडेट करें",
          "Banner Gifs": "बैनर गिफ्स",
          Banner: "बैनर",
          "Banner Management": "बैनर प्रबंधन",
          Platform: "प्लेटफ़ॉर्म",
          "Social Links": "सामाजिक लिंक",
          "Banner Image": "बैनर छवि",
          "Edit Banner GIFs": "बैनर GIF संपादित करें",
          Replace: "बदलें",
          "Update GIFs": "GIF अपडेट करें",
          "Banner Gifs": "बैनर GIFs",
          Banner: "बैनर",
          "Banner Management": "बैनर प्रबंधन",
          Image: "छवि",
          "Max Ticket": "अधिकतम टिकट",
          "Ticket Price": "टिकट मूल्य",
          "Total Amount Collect": "कुल राशि एकत्रित",
          "Total Ticket Buy": "कुल खरीदे गए टिकट",
          "Contest Payments Details": "प्रतियोगिता भुगतान विवरण",
          "No coordinates available.": "कोई निर्देशांक उपलब्ध नहीं हैं।",
          "Y Coordinate": "Y निर्देशांक",
          "X Coordinate": "X निर्देशांक",
          Coordinates: "निर्देशांक",
          "User Payments Details": "उपयोगकर्ता भुगतान विवरण",
          "Transaction Status": "लेनदेन स्थिति",
          "No. Coordinates Chosen": "कोई निर्देशांक नहीं चुना गया",
          "Payment ID": "भुगतान आईडी",
          "Promo Codes": "प्रोमो कोड्स",
          Amount: "राशि",
          "Total Platform Amount": "कुल प्लेटफ़ॉर्म राशि",
          "GST Platform Fee Amount": "GST प्लेटफ़ॉर्म शुल्क राशि",
          "Platform Fee Amount": "प्लेटफ़ॉर्म शुल्क राशि",
          "Sub Total Amount": "उप-योग राशि",
          "GST Amount": "GST राशि",
          "Discount Amount": "छूट राशि",
          "Tickets Price": "टिकट मूल्य",
          Tickets: "टिकट",
          "User Name": "उपयोगकर्ता नाम",
          "Amount (All Tax Included)": "राशि (सभी कर शामिल)",
          "Ticket Amount": "टिकट राशि",
          "₹ Price": "₹ मूल्य",
          "No records to display": "प्रदर्शित करने के लिए कोई रिकॉर्ड नहीं है",
          "Add Contest": "प्रतियोगिता जोड़ें",
          "Contest Start Date": "प्रतियोगिता प्रारंभ तिथि",
          "Contest End Date": "प्रतियोगिता समाप्ति तिथि",
          "Create a New Discount Coupons": "एक नया छूट कूपन बनाएं",
          Name: "नाम",
          "Minimum Tickets": "न्यूनतम टिकट",
          "Maximum Tickets": "अधिकतम टिकट",
          "Discount Percentage": "छूट प्रतिशत",
          "Min Ticket": "न्यूनतम टिकट",
          "Add New Coupons": "नया कूपन जोड़ें",
          "Promo Codes": "प्रोमो कोड्स",
          "Add New Promo Code": "नया प्रोमो कोड जोड़ें",
          Amount: "राशि",
          "Edit Promo Code": "प्रोमो कोड संपादित करें",
          "": "",
          "": "",
          "": "",
          "": "",
          "": "",
        },
      },
    },
  });

//  .init({
//   lng: localStorage.getItem("language") || "en",
//   fallbackLng: ["en", "hi", "fr", "de"],
//   debug: false,
//   backend: {
//     loadPath: "/locales/{{lng}}/translation.json",
//   },
//   interpolation: {
//     escapeValue: false,
//   },
// });

export default i18n;
