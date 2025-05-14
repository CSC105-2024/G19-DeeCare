import { Axios } from "../utils/axiosInstance";

export const getEventAPIbyID = async (id) => {
    try {
      const response = await Axios.get(`events/getOne/${id}`); 
      return {
        success: true,
        data: response.data
      }
    } catch (e) {
      console.log(e);
      return {
        success: false,
        data: null
      }
    }
  }

  export const getEventAPI = async () => {
    try {
      const response = await Axios.get(`events/getAll`); 
      return {
        success: true,
        data: response.data
      }
    } catch (e) {
      console.log(e);
      return {
        success: false,
        data: null
      }
    }
  }