"use client";
import useAxios from "@/CustomHooks/useAxios";
import { UserRoleCheck } from "@/Service/APICalls";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import {
  FaHome,
  FaCalendarAlt,
  FaUsers,
  FaChartBar,
  FaCog,
} from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const Sidebar = () => {
  const Axios = useAxios();
  const [openSidebar, setOpenSidebar] = useState(false);
  const [isAdmin, setAdmin] = useState(false);

  useEffect(() => {
    const userRoleCheck = async () => {
      const response = await UserRoleCheck();
      setAdmin(response || false);
    };
    userRoleCheck();
  }, []);
  const handleClose = () => setOpenSidebar(false);

  return (
    <div>
      {/* Mobile Menu Button */}
      <div className="lg:hidden flex absolute top-5 left-4 z-50">
        <button onClick={() => setOpenSidebar(!openSidebar)}>
          {openSidebar ? (
            <RxCross2 className="text-3xl" />
          ) : (
            <CiMenuFries className="text-3xl" />
          )}
        </button>
      </div>

      {/* Sidebar for Large Screens */}
      <aside className="hidden lg:flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r dark:bg-gray-900 dark:border-gray-700">
        <SidebarLinks handleClose={handleClose} isAdmin={isAdmin} />
      </aside>

      {/* Sidebar for Small Screens */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-900 border-r transform ${
          openSidebar ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden z-40`}
      >
        <button
          className="absolute top-5 right-4 text-3xl"
          onClick={handleClose}
        >
          <RxCross2 />
        </button>
        <SidebarLinks handleClose={handleClose} isAdmin={isAdmin} />
      </div>
    </div>
  );
};

const SidebarLinks = ({
  handleClose,
  isAdmin,
}: {
  handleClose: () => void;
  isAdmin: boolean;
}) => (
  <nav className="mt-6">
    {[
      { href: "/", icon: <FaHome />, label: "Dashboard" },
      {
        href: "/BookingRooms",
        icon: <FaCalendarAlt />,
        label: "Booking Rooms",
      },
    ].map(({ href, icon, label }) => (
      <Link
        key={href}
        href={href}
        className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
        onClick={handleClose}
      >
        <span className="w-5 h-5">{icon}</span>
        <span className="mx-4 font-medium">{label}</span>
      </Link>
    ))}

    {isAdmin && (
      <>
        <hr className="my-6 border-gray-200 dark:border-gray-600" />
        <Link
          href="/AllRooms"
          className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
          onClick={handleClose}
        >
          <FaCog className="w-5 h-5" />
          <span className="mx-4 font-medium">All Rooms</span>
        </Link>
        <Link
          href="/Users"
          className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
          onClick={handleClose}
        >
          <FaUsers className="w-5 h-5" />
          <span className="mx-4 font-medium">All Users</span>
        </Link>
      </>
    )}
  </nav>
);

export default Sidebar;
