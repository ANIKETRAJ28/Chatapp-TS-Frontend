import { useState } from 'react';
import { X } from 'lucide-react';

interface AddMembersModalProps {
  onClose: () => void;
}

export default function AddMembersModal({ onClose }: AddMembersModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const users = [
    {
      id: 4,
      name: 'Sarah Wilson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    },
    {
      id: 5,
      name: 'Alex Thompson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    },
  ];

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50">
      <div className="bg-white w-full md:w-96 rounded-t-xl md:rounded-xl overflow-hidden max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Add Members</h2>
          <button className="p-1 hover:bg-gray-100 rounded-full" onClick={onClose}>
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                <p className="font-medium text-gray-900">{user.name}</p>
              </div>
              <button className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Add</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
