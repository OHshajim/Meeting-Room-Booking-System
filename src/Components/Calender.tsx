import useAxios from "@/CustomHooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Loading from "./Loading";

const Calender = () => {
  const Axios = useAxios();

  const { data, isLoading } = useQuery({
    queryKey: ["bookedDates"],
    queryFn: async () => {
      const bookingsRes = await Axios.get(`/api/bookings`);
      const bookedDates = bookingsRes.data.map((b: any) => new Date(b.date)); // Extract booked dates
      return { bookedDates };
    },
  });

  // Function to check if a date is booked
  const isRoomBooked = (date: Date) => {
    return data?.bookedDates?.some(
      (bookedDate: { toDateString: () => string }) =>
        bookedDate.toDateString() === date.toDateString()
    );
  };

  if (isLoading) return <Loading />;

  return (
    <div className="">
      <div className="w-full mt-8 h-full flex justify-center items-center">
        <Calendar tileDisabled={({ date }) => isRoomBooked(date)} />
      </div>
    </div>
  );
};

export default Calender;
