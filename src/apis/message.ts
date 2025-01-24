import axios from 'axios';
import envConfig from '../config/envConfig';
import { IMessage } from '../interfaces/message';

export async function getMessage(id: string): Promise<IMessage[]> {
  try {
    const response = await axios.get(`${envConfig.BACKEND_API_URL}/message/?communityId=${id}`);
    return response.data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function createMessage(
  content: string,
  type: 'text' | 'image' | 'video',
  communityId: string,
): Promise<IMessage | null> {
  try {
    const response = await axios.post(`${envConfig.BACKEND_API_URL}/message`, {
      message: {
        content,
        type,
        communityId,
      },
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
