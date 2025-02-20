"use client";

import { useQuery } from "@tanstack/react-query";
import useAxios from "@/CustomHooks/useAxios";
import useFavorites from "@/Service/FavoriteRooms";
import Loading from "@/Components/Loading";
import {
  FaDoorOpen,
  FaCheckCircle,
  FaHeart,
  FaCalendarCheck,
} from "react-icons/fa";
import { SaveUser } from "@/Service/APICalls";

const fetchDashboardData = async () => {
  const Axios = useAxios();
  const { data: favoriteRooms } = await useFavorites();

  const [roomsRes, bookingsRes] = await Promise.all([
    Axios.get("/api/rooms"),
    Axios.get("/api/bookings"),
  ]);

  return {
    totalRooms: roomsRes.data.length,
    availableRooms: roomsRes.data.filter((room: any) => !room.bookings).length,
    lastBooking: bookingsRes.data[bookingsRes.data.length - 1] || null,
    favoriteRoom: favoriteRooms.length > 0 ? favoriteRooms[0] : null,
  };
};

export default function Home() {
  SaveUser();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
  });
  console.log(data);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Rooms */}
        <DashboardCard
          title="Total Rooms"
          value={data?.totalRooms}
          icon={<FaDoorOpen className="text-blue-600 text-3xl" />}
        />

        {/* Available Rooms */}
        {/* <DashboardCard
          title="Available Rooms"
          value={data?.availableRooms}
          icon={<FaCheckCircle className="text-green-600 text-3xl" />}
        /> */}

        {/* Last Booking */}
        {/* <DashboardCard
          title="Last Booking"
          value={
            data?.lastBooking ? (
              <>
                {data.lastBooking.title} <br />
                <span className="text-sm text-gray-500">
                  {new Date(data.lastBooking.startTime).toLocaleString()}
                </span>
              </>
            ) : (
              "No recent bookings"
            )
          }
          icon={<FaCalendarCheck className="text-orange-600 text-3xl" />}
        /> */}

        {/* Favorite Room */}
        {/* <DashboardCard
          title="Favorite Room"
          value={
            data?.favoriteRoom
              ? data.favoriteRoom.name
              : "No favorite room selected"
          }
          icon={<FaHeart className="text-red-600 text-3xl" />}
        /> */}
      </div>
    </div>
  );
}

const DashboardCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: any;
  icon: React.ReactNode;
}) => (
  <div className="p-6 bg-white shadow-md rounded-xl flex flex-col items-center justify-center text-center">
    {icon}
    <h3 className="text-lg font-semibold mt-3">{title}</h3>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);
