"use client";
import SaveUser from "@/Service/SaveUser";

export default function Home() {
  try {
    SaveUser();
  } catch (error) {
    console.log(error);
  }

  return (
    <div>
      
    </div>
  );
}
