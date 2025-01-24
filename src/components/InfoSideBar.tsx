import { useEffect, useState } from 'react';
import { Shield, ShieldCheck, MoreVertical, ChevronLeft, UserPlus } from 'lucide-react';
import AddMembersModal from './AddMembers';
import { ICommunity } from '../interfaces/community';
import { demoteMember, getCommunityMembers, promoteMember, removeMember } from '../apis/community';
import { IUserCommunity } from '../interfaces/userCommunity';
import useAuthStore from '../store/authStore';

interface InfoSidebarProps {
  selectedChat: ICommunity | null;
  onBack: () => void;
}

export default function InfoSidebar({ selectedChat, onBack }: InfoSidebarProps) {
  const id = useAuthStore().id;
  const [selectedMember, setSelectedMember] = useState<IUserCommunity | null>(null);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [members, setMembers] = useState<IUserCommunity[]>([]);

  const customSort = (a: IUserCommunity, b: IUserCommunity) => {
    if (a.isSuperAdmin) return -1;
    if (b.isSuperAdmin) return 1;
    if (a.isAdmin) return -1;
    if (b.isAdmin) return 1;
    return 0;
  };

  const customSortMembers = (members: IUserCommunity[]) => {
    return members.sort(customSort);
  };

  useEffect(() => {
    const fetch = async () => {
      if (!selectedChat || selectedChat.type === 'friend') return;
      const members = await getCommunityMembers(selectedChat.id);
      const membersWithRole: IUserCommunity[] = customSortMembers(members);
      setMembers(membersWithRole);
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  const friendInfo = {
    name: selectedChat?.name,
    avatar: selectedChat?.avatar,
    status: 'online',
  };

  const handleMemberAction = (action: string, id: string) => {
    // Handle member actions here
    if (!selectedChat) return;
    if (action === 'demote') {
      demoteMember(selectedChat.id, id);
      setMembers(customSortMembers(members));
    } else if (action === 'promote') {
      promoteMember(selectedChat.id, id);
      setMembers(customSortMembers(members));
    } else if (action === 'remove') {
      removeMember(selectedChat.id, id);
      setMembers(customSortMembers(members.filter((member) => member.id !== id)));
    }
    setSelectedMember(null);
  };

  if (!selectedChat) return null;

  return (
    <div className="w-full bg-white md:h-fit">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <button className="md:hidden p-1 mr-2 hover:bg-gray-100 rounded-full" onClick={onBack}>
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </button>
          <h2 className="font-semibold text-lg">{selectedChat.type === 'group' ? 'Group Info' : 'Profile'}</h2>
        </div>
        {selectedChat.type === 'group' && (
          <button className="p-2 hover:bg-gray-100 rounded-full" onClick={() => setShowAddMembers(true)}>
            {members.find((m) => m.user.id === id && m.isAdmin) && <UserPlus className="h-5 w-5 text-gray-500" />}
          </button>
        )}
      </div>

      <div className="p-4 h-[90%] md:h-[82vh] overflow-y-scroll no-scrollbar">
        {selectedChat.type === 'group' ? (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Members</h3>
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={member.user.avatar} alt={member.user.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-medium text-gray-900">{member.user.name}</p>
                    <div className="flex items-center space-x-1">
                      {member.isSuperAdmin && <Shield className="h-4 w-4 text-yellow-500" />}
                      {member.isAdmin && !member.isSuperAdmin && <ShieldCheck className="h-4 w-4 text-green-500" />}
                      {/* <p className="text-sm text-gray-500">{member.role}</p> */}
                    </div>
                  </div>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded-full" onClick={() => setSelectedMember(member)}>
                  {members.find((m) => m.user.id === id && m.isAdmin) && !member.isSuperAdmin && (
                    <MoreVertical className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <img src={friendInfo.avatar} alt={friendInfo.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
            <h2 className="font-semibold text-xl mb-1">{friendInfo.name}</h2>
            <div className="flex items-center justify-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${friendInfo.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}
              />
              <p className="text-sm text-gray-500 capitalize">{friendInfo.status}</p>
            </div>
          </div>
        )}
      </div>

      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50">
          <div className="bg-white w-full md:w-80 rounded-t-xl md:rounded-xl overflow-hidden">
            <div className="p-4 space-y-2">
              {!selectedMember.isSuperAdmin && (
                <>
                  {!selectedMember.isAdmin ? (
                    <button
                      className="w-full py-2 text-left px-4 hover:bg-gray-100 rounded-lg"
                      onClick={() => handleMemberAction('promote', selectedMember.user.id)}
                    >
                      Promote
                    </button>
                  ) : (
                    <button
                      className="w-full py-2 text-left px-4 hover:bg-gray-100 rounded-lg"
                      onClick={() => handleMemberAction('demote', selectedMember.user.id)}
                    >
                      Demote
                    </button>
                  )}
                  <button
                    className="w-full py-2 text-left px-4 hover:bg-gray-100 rounded-lg text-red-500"
                    onClick={() => handleMemberAction('remove', selectedMember.user.id)}
                  >
                    Remove
                  </button>
                </>
              )}
              <button
                className="w-full py-2 text-left px-4 hover:bg-gray-100 rounded-lg"
                onClick={() => setSelectedMember(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddMembers && <AddMembersModal onClose={() => setShowAddMembers(false)} />}
    </div>
  );
}
