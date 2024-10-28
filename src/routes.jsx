import {
  HomeIcon,
  UserCircleIcon,
  TagIcon, // Icon for Brands
  ServerStackIcon,
  RectangleStackIcon,
  ShoppingBagIcon,
  CreditCardIcon, // Using CreditCardIcon for Coupon Codes
} from "@heroicons/react/24/solid"; // Ensure you import the correct icon
import { Home, Profile, Products, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import Codes from "./pages/dashboard/Codes";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Home",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Users",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <ShoppingBagIcon {...icon} />,
        name: "Products",
        path: "/products",
        element: <Products />,
      },
      {
        icon: <TagIcon {...icon} />, // Icon for Brands
        name: "Brands",
        path: "/brands",
        element: <Notifications />, // Adjust this to the correct element if needed
      },
      {
        icon: <CreditCardIcon {...icon} />, // Changed to CreditCardIcon for Coupon Codes
        name: "Codes",
        path: "/codes",
        element: <Codes />, // Adjust this to the correct element if needed
      },
    ],
  },
  {
    title: "Auth Pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Sign In",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Sign Up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
