"use client";
import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import useAxios from "@/CustomHooks/useAxios";
const Axios = useAxios();
export const SaveUser = () => {
  const [success, setSuccess] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && user) {
      Axios.get("/api/auth/saveUser")
        .then((data) => {
          setSuccess(true);
        })
        .catch(() => {
          setSuccess(false);
          signOut();
        });
    }
  }, [isClient, user]);

  if (!isClient) return null;

  return success;
};

export async function fetchRooms() {
  const res = await Axios.get("/api/rooms");
  return res;
}

export async function fetchBookings() {
  const res = await Axios.get("/api/bookings");
  return res;
}

export const UserRoleCheck = async () => {
  try {
    const response = await Axios.get("/api/auth/CheckUserRole");
    return response.data.role === "ADMIN";
  } catch (error) {
    console.error("Error fetching user role:", error);
  }
};
