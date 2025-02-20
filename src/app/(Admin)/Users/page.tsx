"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TextField } from "@mui/material";
import useAxios from "@/CustomHooks/useAxios";
import Loading from "@/Components/Loading";

interface User {
  id: string;
  email: string;
  role: string;
  bookings: number;
}

export default function AllRooms() {
  const Axios = useAxios();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["users", search],
    queryFn: async () => {
      const { data } = await Axios.get("/api/users", {
        params: search ? { email: search } : {},
      });
      return data;
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      await Axios.delete(`/api/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold">User Management</h2>
        <TextField
          label="Search by Email"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">User Email</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Total Bookings</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  <Loading />
                </td>
              </tr>
            ) : users?.length > 0 ? (
              users.map((user: User) => (
                <tr key={user.id} className="border text-center">
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.role}</td>
                  <td className="border p-2">{user.bookings.length}</td>
                  <td className="border p-2">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      onClick={() => deleteUserMutation.mutate(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
