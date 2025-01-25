import axios from 'axios';
import { IUser } from '../interfaces/user';
import envConfig from '../config/envConfig';

export async function findUserByQuery(query: string): Promise<IUser[]> {
  try {
    const response = await axios.get(`${envConfig.BACKEND_API_URL}/user/search?query=${query}`);
    return response.data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}
