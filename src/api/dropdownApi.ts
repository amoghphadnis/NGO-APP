import api from './client';
import { 
  StandardApiResponse, 
  DistrictsResponse, 
  GendersResponse, 
  CastesResponse, 
  CoursesResponse, 
  PlacesResponse 
} from '@/types/api';

export const dropdownApi = {
  // GET /students/districts
  getDistricts: async (): Promise<StandardApiResponse<DistrictsResponse[]>> => {
    try {
      const response = await api.get('/students/districts');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /students/genders
  getGenders: async (): Promise<StandardApiResponse<GendersResponse[]>> => {
    try {
      const response = await api.get('/students/genders');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /students/castes
  getCastes: async (): Promise<StandardApiResponse<CastesResponse[]>> => {
    try {
      const response = await api.get('/students/castes');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /students/courses
  getCourses: async (): Promise<StandardApiResponse<CoursesResponse[]>> => {
    try {
      const response = await api.get('/students/courses');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /students/places
  getPlaces: async (): Promise<StandardApiResponse<PlacesResponse[]>> => {
    try {
      const response = await api.get('/students/places');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
