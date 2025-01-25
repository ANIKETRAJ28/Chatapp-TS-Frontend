import { useEffect, useRef, useState } from 'react';
import { Send, ChevronLeft } from 'lucide-react';
import { CreateMessageResponse, IMessage } from '../interfaces/message';
import { createMessage, createMessageAndCommunity, getMessage } from '../apis/message';
import useAuthStore from '../store/authStore';
import { io } from 'socket.io-client';
import { ICommunity, IFriendCommunity } from '../interfaces/community';

interface ChatAreaProps {
  selectedChat: {
    id: string;
    name: string;
    avatar: string;
    type: 'friend' | 'group' | 'search';
    users: number;
    description?: string;
  } | null;
  setSelectedChat: (community: ICommunity) => void;
  setActiveChat: (type: 'friend' | 'group' | 'search') => void;
  friends: IFriendCommunity[];
  setFriends: (user: IFriendCommunity[]) => void;
  setSearchQuery: (s: string) => void;
  onInfoClick: () => void;
  onBack: () => void;
}

export default function ChatArea({
  selectedChat,
  setSelectedChat,
  setActiveChat,
  friends,
  setFriends,
  setSearchQuery,
  onInfoClick,
  onBack,
}: ChatAreaProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const socket = useRef(io(import.meta.env.VITE_BACKEND_URL, { withCredentials: true })).current;

  const { id } = useAuthStore();

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages.length]);

  useEffect(() => {
    socket.emit('self join', id);

    return () => {
      socket.off('self join');
    };
  }, [id]);

  useEffect(() => {
    if (selectedChat && selectedChat.type !== 'search') {
      socket.emit('setup', selectedChat.id);
    }

    return () => {
      socket.off('setup');
    };
  }, [selectedChat]);

  useEffect(() => {
    const handleAddCommunity = (frnd: IFriendCommunity) => {
      setFriends([...friends, frnd]);
    };

    socket.on('add community', handleAddCommunity);

    return () => {
      socket.off('add community', handleAddCommunity);
    };
  }, [friends, setFriends]);

  useEffect(() => {
    const handleMessageReceived = (message: IMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on('message received', handleMessageReceived);

    return () => {
      socket.off('message received', handleMessageReceived);
    };
  }, [socket]);

  useEffect(() => {
    setMessage('');
    const fetch = async () => {
      if (!selectedChat) return;
      const chats = await getMessage(selectedChat.id);
      setMessages(chats);
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    };
    fetch();
  }, [selectedChat]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [selectedChat]);

  async function onHandleSubmit() {
    if (!selectedChat) return;
    setMessage(message.trim());
    if (message === '') return;
    let chat: IMessage | CreateMessageResponse | null;
    if (selectedChat.type !== 'search') chat = await createMessage(message, 'text', selectedChat.id);
    else chat = await createMessageAndCommunity(message, 'text', selectedChat.id, 'group');
    if (!chat) return;
    if ('id' in chat) {
      setMessages([
        ...messages,
        {
          id: chat.id,
          content: chat.content,
          type: chat.type,
          communityId: chat.communityId,
          isDeleted: chat.isDeleted,
          timestamp: chat.timestamp,
          user: chat.user,
        },
      ]);
      socket.emit('new message', {
        id: chat.id,
        content: message,
        type: chat.type,
        communityId: chat.communityId,
        isDeleted: chat.isDeleted,
        timestamp: chat.timestamp,
        user: chat.user,
      });
    } else {
      setMessages([
        ...messages,
        {
          id: chat.message.id,
          content: chat.message.content,
          type: chat.message.type,
          communityId: chat.message.communityId,
          isDeleted: chat.message.isDeleted,
          timestamp: chat.message.timestamp,
          user: chat.message.user,
        },
      ]);
      const frnd = chat.community;

      // socket.emit('add friend', {
      //   id: frnd.id,
      //   type: frnd.type,
      //   users: frnd.users,
      //   friend: {
      //     id,
      //     name,
      //     email,
      //     username,
      //     avatar,
      //   },
      //   userId: frnd.friend.id,
      // });
      setFriends([...friends, frnd]);
      setActiveChat('friend');
      // socket.emit('setup', chat.community.id);
      setSelectedChat({
        id: chat.community.id,
        avatar: chat.community.friend.avatar,
        name: chat.community.friend.name,
        type: 'friend',
        users: chat.community.users,
      });
      // socket.emit('new message', {
      //   id: chat.message.id,
      //   content: chat.message.content,
      //   type: chat.message.type,
      //   communityId: chat.message.communityId,
      //   isDeleted: chat.message.isDeleted,
      //   timestamp: chat.message.timestamp,
      //   user: chat.message.user,
      // });
    }
    setMessage('');
    setSearchQuery('');
  }

  const chatInfo = { name: selectedChat?.name, avatar: selectedChat?.avatar };
  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="border-b border-gray-200 p-3">
        <div className="flex items-center space-x-3">
          <button className="md:hidden p-1 hover:bg-gray-100 rounded-full" onClick={onBack}>
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </button>
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onInfoClick}>
            <img src={chatInfo.avatar} alt={chatInfo.name} className="w-10 h-10 rounded-full" />
            <div>
              <h2 className="font-medium text-gray-900">{chatInfo.name}</h2>
              <p className="text-sm text-gray-500">
                {selectedChat.type === 'friend' || selectedChat.type === 'search'
                  ? 'Online'
                  : `${selectedChat.users} members`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div ref={chatRef} className="flex-1 overflow-y-scroll no-scrollbar p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.user.id === id ? 'justify-end' : 'justify-start'}`}>
            {msg.user.id !== id && (
              <div className="flex-shrink-0">
                <img src={msg.user.avatar} alt={msg.user.name} className="w-8 h-8 rounded-full object-cover" />
              </div>
            )}
            {msg.user.id !== id && (
              <div className="flex flex-col max-w-[70%]">
                <span className="text-xs text-gray-500 mb-1 ml-1">{msg.user.name}</span>
                <div className={'bg-gray-100 text-gray-900 rounded-lg p-3'}>
                  <p>{msg.content}</p>
                  <p className="text-xs mt-1 opacity-70">{new Date().toUTCString()}</p>
                </div>
              </div>
            )}
            {msg.user.id === id && (
              <div className="max-w-[70%] rounded-lg p-3 bg-blue-500 text-white">
                <p>{msg.content}</p>
                <p className="text-xs mt-1 opacity-70">{new Date().toUTCString()}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={onHandleSubmit} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
