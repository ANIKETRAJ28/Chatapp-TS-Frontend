import axios from 'axios';
import envConfig from '../config/envConfig';
import { CreateMessageResponse, IMessage } from '../interfaces/message';

export async function getMessage(id: string): Promise<IMessage[]> {
  try {
    const response = await axios.get(`${envConfig.BACKEND_API_URL}/message/?communityId=${id}`);
    return response.data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

// type CreateMessageResponse = IMessage | ({ community: ICommunity } & { message: IMessage });

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

export async function createMessageAndCommunity(
  content: string,
  type: 'text' | 'image' | 'video',
  communityId: string,
  communityType?: string,
): Promise<CreateMessageResponse | null> {
  try {
    const response = await axios.post(`${envConfig.BACKEND_API_URL}/message`, {
      message: {
        content,
        type,
        communityType,
        communityId,
      },
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
