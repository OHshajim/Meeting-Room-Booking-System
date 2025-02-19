"use client";
import Loading from "@/Components/Loading";
import SaveUser from "@/Service/SaveUser";

export default function Home() {
  try {
    const res = SaveUser();
    console.log(res);
    if (!res) {
      return <Loading />;
    }
  } catch (error) {
    console.log(error);
  }
  return <div></div>;
}
