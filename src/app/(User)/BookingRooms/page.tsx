"use client";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import Loading from "@/Components/Loading";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { UserRoleCheck } from "@/Service/APICalls";
import useAxios from "@/CustomHooks/useAxios";
import { Modal, Box, TextField, Button, Select, MenuItem } from "@mui/material";

const Axios = useAxios();

// Delete booking mutation
const deleteBooking = async (bookingId: string) => {
  await axios.delete(`/api/bookings/${bookingId}`);
};

// Edit booking mutation
const editBooking = async (bookingId: string, updatedData: any) => {
  await axios.put(`/api/bookings/${bookingId}`, updatedData);
};

interface Booking {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  room: { name: string };
}

const BookingPage = () => {
  const [isAdmin, setAdmin] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const {
    data: bookings,
    isLoading,
    refetch: reload,
  } = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await Axios.get(`/api/bookings`);
      const IsAdmin = (await UserRoleCheck()) || false;
      setAdmin(IsAdmin);
      return res.data;
    },
  });

  const mutationDelete = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      reload();
    },
  });

  const mutationEdit = useMutation({
    mutationFn: async ({
      bookingId,
      updatedData,
    }: {
      bookingId: string;
      updatedData: any;
    }) => {
      await editBooking(bookingId, updatedData);
    },
    onSuccess: () => {
      reload();
    },
  });

  const handleEditBooking = async (e: React.FormEvent, bookingId: string) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("title") as string;
    const startTime = new Date(formData.get("startTime") as string);
    const endTime = new Date(formData.get("endTime") as string);

    const updatedData = {
      title,
      startTime,
      endTime,
    };

    await mutationEdit.mutateAsync({ bookingId, updatedData });
    setSelectedBooking(null);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Manage Bookings</h2>
      <div className="py-4">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowBookingModal(true)}
        >
          Book a Room
        </Button>
      </div>
      {/* Table for bookings */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th>Room</th>
              <th>Title</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings?.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.room.name}</td>
                <td>{booking.title}</td>
                <td>{new Date(booking.startTime).toLocaleString()}</td>
                <td>{new Date(booking.endTime).toLocaleString()}</td>
                <td>
                  {isAdmin ? (
                    <>
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="text-blue-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => mutationDelete.mutate(booking.id)}
                        className="ml-2 text-red-600"
                      >
                        <FaTrashAlt />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => mutationDelete.mutate(booking.id)}
                      className="text-red-600"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Admin can edit booking */}
      {selectedBooking && (
        <div className="mt-6">
          <h3>Edit Booking</h3>
          <form onSubmit={(e) => handleEditBooking(e, selectedBooking.id)}>
            <div className="mb-4">
              <label htmlFor="title" className="block">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                defaultValue={selectedBooking.title}
                className="input"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="startTime" className="block">
                Start Time
              </label>
              <input
                type="datetime-local"
                id="startTime"
                name="startTime"
                defaultValue={new Date(selectedBooking.startTime)
                  .toISOString()
                  .slice(0, 16)}
                className="input"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="endTime" className="block">
                End Time
              </label>
              <input
                type="datetime-local"
                id="endTime"
                name="endTime"
                defaultValue={new Date(selectedBooking.endTime)
                  .toISOString()
                  .slice(0, 16)}
                className="input"
              />
            </div>
            <button type="submit" className="btn">
              Save Changes
            </button>
          </form>
        </div>
      )}

      {/* Modal for making a new booking */}
      <Modal
        open={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        aria-labelledby="book-room-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            width: "400px",
            borderRadius: "8px",
          }}
        >
          <h3 className="text-2xl mb-4">Book a Room</h3>
          <form>
            <div className="mb-4">
              <TextField
                fullWidth
                select
                label="Room"
                variant="outlined"
                defaultValue=""
                className="input"
              >
                <MenuItem value="">Select Room</MenuItem>
                {/* Add logic to populate room options */}
                <MenuItem value="Room1">Room 1</MenuItem>
                <MenuItem value="Room2">Room 2</MenuItem>
              </TextField>
            </div>
            <div className="mb-4">
              <TextField
                fullWidth
                label="Title"
                variant="outlined"
                className="input"
              />
            </div>
            <div className="mb-4">
              <TextField
                fullWidth
                type="datetime-local"
                label="Start Time"
                variant="outlined"
                className="input"
              />
            </div>
            <div className="mb-4">
              <TextField
                fullWidth
                type="datetime-local"
                label="End Time"
                variant="outlined"
                className="input"
              />
            </div>
            <Button variant="contained" color="primary" fullWidth>
              Confirm Booking
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => setShowBookingModal(false)}
              sx={{ marginTop: "10px" }}
            >
              Cancel
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default BookingPage;
