import useAxios from "@/CustomHooks/useAxios";
import { useQuery } from "@tanstack/react-query";
const Axios = useAxios();
export const getFavoriteRooms = (): string[] => {
  if (typeof window !== "undefined") {
    const favorites = localStorage.getItem("favoriteRooms");
    return favorites ? JSON.parse(favorites) : [];
  }
  return [];
};

export default function useFavorites() {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const roomIds = getFavoriteRooms();
      if (roomIds.length === 0) return [];
      const res = await Axios.post("/api/favorites", { roomIds });
      return res.data;
    },
  });
}
