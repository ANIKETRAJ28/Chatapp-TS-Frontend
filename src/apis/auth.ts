import axios from 'axios';
import envConfig from '../config/envConfig';
import { IUser } from '../interfaces/user';
import { IAuth } from '../interfaces/auth';

export const auth = async (): Promise<IUser | null> => {
  try {
    axios.defaults.withCredentials = true;
    const user: { data: { data: IUser } } = await axios.get(`${envConfig.BACKEND_API_URL}/auth`);
    if (!user) throw new Error('User not found');
    return user.data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const logout = async () => {
  try {
    axios.defaults.withCredentials = true;
    await axios.get(`${envConfig.BACKEND_API_URL}/auth/logout`);
    localStorage.clear();
  } catch (error) {
    console.log(error);
  }
};

export const login = async (email: string, password: string) => {
  try {
    console.log(email, password);
    axios.defaults.withCredentials = true;
    await axios.post(`${envConfig.BACKEND_API_URL}/auth/signin?email=${email}`, {
      password,
    });
  } catch (error) {
    console.log(error);
  }
};

export const signup = async (user: IAuth) => {
  try {
    axios.defaults.withCredentials = true;
    await axios.post(`${envConfig.BACKEND_API_URL}/auth/signup`, {
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
