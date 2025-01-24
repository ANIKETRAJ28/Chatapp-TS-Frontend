import { useEffect, useState } from 'react';
import ChatArea from '../components/ChartArea';
import InfoSidebar from '../components/InfoSideBar';
import Sidebar from '../components/SideBar';
import { IGroupCommunity, IFriendCommunity, ICommunity } from '../interfaces/community';
import { getCommunities } from '../apis/community';

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState<'friend' | 'group'>('friend');
  const [showInfo, setShowInfo] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [friends, setFriends] = useState<IFriendCommunity[]>([]);
  const [groups, setGroups] = useState<IGroupCommunity[]>([]);

  const [selectedChat, setSelectedChat] = useState<ICommunity | null>(null);

  const handleSelectChat = (
    id: string,
    name: string,
    avatar: string,
    type: 'friend' | 'group',
    users: number,
    description?: string,
  ) => {
    if (description) setSelectedChat({ id, name, avatar, type, users, description });
    else setSelectedChat({ id, name, avatar, type, users });
    setShowInfo(false);
    setShowSidebar(false);
  };

  const handleBack = () => {
    if (showInfo) {
      setShowInfo(false);
    } else {
      setShowSidebar(true);
      setSelectedChat(null);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const communities = await getCommunities();
      const friends = communities.filter((community) => community.type === 'friend') as unknown as IFriendCommunity[];
      setFriends(friends);
      const groups = communities.filter((community) => community.type === 'group') as unknown as IGroupCommunity[];
      setGroups(groups);
    };
    fetch();
  }, []);

  return (
    <div className="flex flex-1 h-[90vh]">
      <div className={`${showSidebar ? 'flex' : 'hidden'} md:flex w-full md:w-80 border-r border-gray-200`}>
        <Sidebar
          friends={friends}
          groups={groups}
          activeChat={activeChat}
          setActiveChat={setActiveChat}
          onSelectChat={handleSelectChat}
        />
      </div>

      <div className={`${!showSidebar || selectedChat ? 'flex' : 'hidden'} md:flex flex-1`}>
        <ChatArea selectedChat={selectedChat} onInfoClick={() => setShowInfo(!showInfo)} onBack={handleBack} />
      </div>

      <div
        className={`${
          showInfo
            ? 'flex absolute inset-0 top-[8vh] overflow-hidden md:relative md:w-80 md:top-0 md:overflow-visible'
            : 'hidden'
        } bg-white md:border-l border-gray-200`}
      >
        <InfoSidebar selectedChat={selectedChat} onBack={() => setShowInfo(false)} />
      </div>
    </div>
  );
}
