"use client";
import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";

const SaveUser = () => {
  const [success, setSuccess] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && user) {
      fetch("/api/auth/saveUser")
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setSuccess(false);
            signOut();
          } else {
            setSuccess(true);
          }
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

export default SaveUser;
