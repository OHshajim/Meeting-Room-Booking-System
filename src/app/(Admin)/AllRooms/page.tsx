"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "@/CustomHooks/useAxios";
import Loading from "@/Components/Loading";

interface Room {
  id: string;
  name: string;
  capacity: number;
  amenities: Record<string, boolean>;
  createdAt: string;
}

export default function AllRooms() {
  const Axios = useAxios();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const [newRoom, setNewRoom] = useState({
    name: "",
    capacity: 0,
    amenities: "",
  });
  const [filters, setFilters] = useState({ capacity: "", amenities: "" });

  // Fetch rooms with filters
  const {
    data: rooms,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["rooms", filters],
    queryFn: async () => {
      const { data } = await Axios.get("/api/rooms", { params: filters });
      return data;
    },
  });

  // Create or update room
  const saveRoomMutation = useMutation({
    mutationFn: async () => {
      const amenitiesArray = newRoom.amenities
        .split(",")
        .map((item) => item.trim());
      const parsedAmenities = amenitiesArray.reduce((acc, amenity) => {
        acc[amenity] = true;
        return acc;
      }, {} as Record<string, boolean>);

      if (editRoom) {
        return Axios.patch(`/api/rooms/${editRoom.id}`, {
          ...newRoom,
          amenities: parsedAmenities,
        });
      } else {
        return Axios.post("/api/rooms", {
          ...newRoom,
          amenities: parsedAmenities,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      setOpen(false);
      setNewRoom({ name: "", capacity: 0, amenities: "" });
      setEditRoom(null);
    },
  });

  // Delete room
  const deleteRoomMutation = useMutation({
    mutationFn: async (id: string) => Axios.delete(`/api/rooms/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rooms"] })
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Room Management</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setOpen(true)}
        >
          + Add Room
        </button>
      </div>

      {/* Filtering */}
      <div className="flex gap-4 mb-4">
        <Select
          value={filters.capacity}
          onChange={(e) => setFilters({ ...filters, capacity: e.target.value })}
          displayEmpty
        >
          <MenuItem value="">All Capacities</MenuItem>
          <MenuItem value="50">50</MenuItem>
          <MenuItem value="100">100</MenuItem>
        </Select>
        <TextField
          label="Amenities (e.g., WiFi, Projector)"
          value={filters.amenities}
          onChange={(e) =>
            setFilters({ ...filters, amenities: e.target.value })
          }
        />
      </div>

      {/* Room Table */}
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <p className="text-red-500">Error fetching rooms</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Room Name</th>
              <th className="border p-2">Capacity</th>
              <th className="border p-2">Amenities</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room: Room) => (
              <tr key={room.id} className="border text-center">
                <td className="border p-2">{room.name}</td>
                <td className="border p-2">{room.capacity}</td>
                <td className="border p-2">
                  {Object.keys(room.amenities).join(", ")}
                </td>
                <td className="border p-2 flex gap-5 items-center justify-center">
                  <button
                    className="bg-green-300 text-black font-bold px-2 py-1 rounded mr-2"
                    onClick={() => {
                      setEditRoom(room);
                      setNewRoom({
                        name: room.name,
                        capacity: room.capacity,
                        amenities: Object.keys(room.amenities).join(", "),
                      });
                      setOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => deleteRoomMutation.mutate(room.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add/Edit Room Modal */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editRoom ? "Edit Room" : "Add New Room"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Room Name"
            fullWidth
            margin="dense"
            defaultValue={editRoom?.name}
            onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
          />
          <TextField
            label="Capacity"
            type="number"
            fullWidth
            margin="dense"
            defaultValue={editRoom?.capacity}
            onChange={(e) =>
              setNewRoom({ ...newRoom, capacity: Number(e.target.value) })
            }
          />
          <TextField
            label="Amenities (comma-separated)"
            fullWidth
            margin="dense"
            defaultValue={editRoom?.amenities}
            onChange={(e) =>
              setNewRoom({ ...newRoom, amenities: e.target.value })
            }
            helperText="Example: WiFi, Projector, AC"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setEditRoom(null);
            }}
          >
            Cancel
          </Button>
          <Button onClick={() => saveRoomMutation.mutate()} color="primary">
            {editRoom ? "Update" : "Add"} Room
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
