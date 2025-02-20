"use client";

import { useQuery } from "@tanstack/react-query";
import useAxios from "@/CustomHooks/useAxios";
import useFavorites from "@/Service/FavoriteRooms";
import Loading from "@/Components/Loading";
import { FaDoorOpen, FaHeart, FaCalendarCheck } from "react-icons/fa";
import { SaveUser } from "@/Service/APICalls";
import Calender from "@/Components/Calender";

export default function Home() {
  SaveUser();
  const Axios = useAxios();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      const roomsRes = await Axios.get("/api/rooms");
      const bookingsRes = await Axios.get(`/api/bookings`);

      return {
        totalRooms: roomsRes.data.length,
        lastBooking: bookingsRes.data[bookingsRes.data.length - 1] || null,
      };
    },
  });
  const { data: favoriteRooms } = useFavorites();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );

  return (
    <div className="p-6 w-full">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Rooms */}
        <DashboardCard
          title="Total Rooms"
          value={data?.totalRooms}
          icon={<FaDoorOpen className="text-blue-600 text-3xl" />}
        />

        {/* Last Booking */}
        <DashboardCard
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
        />

        {/* Favorite Room */}
        <DashboardCard
          title="Favorite Room"
          value={
            favoriteRooms.length > 0
              ? favoriteRooms.length
              : "No favorite room selected"
          }
          icon={<FaHeart className="text-red-600 text-3xl" />}
        />
      </div>

      {/* Full-Page Calendar */}
      <div className="w-full mt-8 h-full flex justify-center items-center">
        <Calender />
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
