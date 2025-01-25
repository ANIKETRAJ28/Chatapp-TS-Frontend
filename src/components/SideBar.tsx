import { useCallback, useEffect, useState } from 'react';
import { Search, Users, UserCircle, UserPlus } from 'lucide-react';
import { IFriendCommunity, IGroupCommunity } from '../interfaces/community';
import { IUser } from '../interfaces/user';
import { findUserByQuery } from '../apis/user';
import useAuthStore from '../store/authStore';

interface SidebarProps {
  friends: IFriendCommunity[];
  groups: IGroupCommunity[];
  activeChat: 'friend' | 'group' | 'search';
  setActiveChat: (type: 'friend' | 'group' | 'search') => void;
  onSelectChat: (
    id: string,
    name: string,
    avatar: string,
    type: 'friend' | 'group' | 'search',
    users: number,
    description?: string,
  ) => void;
  searchQuery: string;
  setSearchQuery: (s: string) => void;
}

export default function Sidebar({
  friends,
  groups,
  activeChat,
  setActiveChat,
  onSelectChat,
  searchQuery,
  setSearchQuery,
}: SidebarProps) {
  const [searchResults, setSearchResults] = useState<IUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [previousActiveChat, setPreviousActiveChat] = useState<'friend' | 'group'>('friend');
  const { id } = useAuthStore();
  const debouncedSearch = useCallback(() => {
    setActiveChat('search');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let timeoutId: any;
    return (query: string) => {
      query = query.trim();
      setIsSearching(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        const results = await findUserByQuery(query);
        const filteredResult = results.filter(
          (user) => !friends.some((friend) => friend.friend.id === user.id) && id && user.id !== id,
        );
        setSearchResults(filteredResult);
      }, 500); // 500ms delay
    };
  }, [setActiveChat, friends, id]);

  useEffect(() => {
    if (searchQuery) {
      const search = debouncedSearch();
      if (search) search(searchQuery);
    } else {
      setActiveChat(previousActiveChat);
      setIsSearching(false);
      setSearchResults([]);
    }
  }, [searchQuery, debouncedSearch, setActiveChat, previousActiveChat]);

  return (
    <div className="w-80 border-r border-gray-200 h-full bg-white">
      <div className="p-4">
        <div className="h-fit">
          <div className="flex items-center space-x-2 mb-6 h-fit">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => {
                  setActiveChat('search');
                  setIsSearching(true);
                  setSearchQuery(e.target.value);
                }}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button className="py-2 px-4 rounded-lg bg-gray-100 text-gray-600">
              <UserPlus className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="flex space-x-1 mb-6">
            <button
              className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                activeChat === 'friend' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => {
                setActiveChat('friend');
                setPreviousActiveChat('friend');
              }}
            >
              <div className="flex items-center justify-center space-x-2">
                <UserCircle className="h-5 w-5" />
                <span>Friends</span>
              </div>
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                activeChat === 'group' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => {
                setActiveChat('group');
                setPreviousActiveChat('group');
              }}
            >
              <div className="flex items-center justify-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Groups</span>
              </div>
            </button>
          </div>
        </div>

        <div className="space-y-2 overflow-y-scroll no-scrollbar h-[70vh]">
          {activeChat === 'friend'
            ? friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    onSelectChat(friend.id, friend.friend.name, friend.friend.avatar, friend.type, friend.users);
                  }}
                >
                  <div className="relative">
                    <img src={friend.friend.avatar} alt={friend.friend.name} className="w-12 h-12 rounded-full" />
                    {/* <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        friend.status === 'online'
                          ? 'bg-green-500'
                          : 'bg-gray-400'
                      }`}
                    /> */}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{friend.friend.name}</p>
                    {/* <p className="text-sm text-gray-500">{friend.status}</p> */}
                  </div>
                </div>
              ))
            : activeChat === 'group'
              ? groups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      if (group.description)
                        onSelectChat(group.id, group.name, group.avatar, group.type, group.users, group.description);
                      else onSelectChat(group.id, group.name, group.avatar, group.type, group.users);
                    }}
                  >
                    <img src={group.avatar} alt={group.name} className="w-12 h-12 rounded-full" />
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{group.name}</p>
                    </div>
                  </div>
                ))
              : isSearching &&
                searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      onSelectChat(result.id, result.name, result.avatar, 'search', 1);
                    }}
                  >
                    <img src={result.avatar} alt={result.name} className="w-12 h-12 rounded-full" />
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{result.name}</p>
                    </div>
                  </div>
                ))}
        </div>
      </div>
    </div>
  );
}
