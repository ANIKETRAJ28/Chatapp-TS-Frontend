import axios from 'axios';
import envConfig from '../config/envConfig';
import { IFriendCommunity, IGroupCommunity } from '../interfaces/community';
import { IUserCommunity } from '../interfaces/userCommunity';

export async function getCommunities(): Promise<(IGroupCommunity | IFriendCommunity)[]> {
  try {
    const response = await axios.get(`${envConfig.BACKEND_API_URL}/community`);
    return response.data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getCommunityMembers(id: string): Promise<IUserCommunity[]> {
  try {
    const response = await axios.get(`${envConfig.BACKEND_API_URL}/community/${id}/members`);
    return response.data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function addMember(communityId: string, memberId: string): Promise<IUserCommunity[]> {
  try {
    const response = await axios.post(`${envConfig.BACKEND_API_URL}/community/${communityId}/add/${memberId}`);
    return response.data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function removeMember(communityId: string, memberId: string): Promise<IUserCommunity[]> {
  try {
    const response = await axios.post(`${envConfig.BACKEND_API_URL}/community/${communityId}/remove/${memberId}`);
    return response.data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function promoteMember(communityId: string, memberId: string): Promise<IUserCommunity[]> {
  try {
    const response = await axios.post(`${envConfig.BACKEND_API_URL}/community/${communityId}/promote/${memberId}`);
    return response.data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function demoteMember(communityId: string, memberId: string): Promise<IUserCommunity[]> {
  try {
    console.log('community id...', communityId);
    console.log('member id...', memberId);
    const response = await axios.post(`${envConfig.BACKEND_API_URL}/community/${communityId}/demote/${memberId}`);
    return response.data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}
