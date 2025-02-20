import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const getFavoriteRooms = (): string[] => {
  if (typeof window !== "undefined") {
    const favorites = localStorage.getItem("favoriteRooms");
    return favorites ? JSON.parse(favorites) : [];
  }
  return [];
};
const fetchFavoriteRooms = async () => {
  const roomIds = getFavoriteRooms();
  if (roomIds.length === 0) return [];
  const res = await axios.post("/api/favorites", { roomIds });
  return res.data;
};

export default function useFavorites() {
  return useQuery({ queryKey: ["favorites"], queryFn: fetchFavoriteRooms });
}
