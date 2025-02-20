import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://spademeet.vercel.app"
});
const useAxios = () => {
  return axiosPublic;
};

export default useAxios;
