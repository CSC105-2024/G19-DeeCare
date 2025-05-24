import { Axios } from "../utils/axiosInstance";

  export const findDoctorByde = async (DE) => {
    try {
      const response = await Axios.get(`doctors/DE/${DE}`); 
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

export const findDoctorBySearch = async (name) => {
    try {
      const response = await Axios.get(`doctors/search/${name}`); 
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

  export const findAllDoc = async () => {
    try {
      const response = await Axios.get("doctors"); 
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