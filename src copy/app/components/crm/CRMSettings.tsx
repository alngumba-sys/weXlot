import { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { User, Layers, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { Staff, Platform } from '../../../types/crm';

export function CRMSettings() {
  // Safely handle context - return null if not available (during hot reload)
  let crmContext;
  try {
    crmContext = useCRM();
  } catch {
    return null;
  }
  
  const { 
    staff, platforms, 
    addStaff, updateStaff, deleteStaff,
    addPlatform, updatePlatform, deletePlatform 
  } = crmContext;
  const [activeTab, setActiveTab] = useState<'staff' | 'platforms'>('staff');
  
  const [newStaff, setNewStaff] = useState<Partial<Staff>>({});
  const [newPlatform, setNewPlatform] = useState('');

  // Editing state for platforms
  const [editingPlatformId, setEditingPlatformId] = useState<string | null>(null);
  const [editingPlatformName, setEditingPlatformName] = useState('');

  // Editing state for staff
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [editingStaffData, setEditingStaffData] = useState<Partial<Staff>>({});

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) return;

    await addStaff({
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.role || 'staff',
      avatar_url: `https://ui-avatars.com/api/?name=${newStaff.name}&background=random`
    });
    setNewStaff({});
  };

  const startEditingStaff = (member: Staff) => {
    setEditingStaffId(member.id);
    setEditingStaffData({
      name: member.name,
      email: member.email,
      role: member.role
    });
  };

  const cancelEditingStaff = () => {
    setEditingStaffId(null);
    setEditingStaffData({});
  };

  const saveStaff = async () => {
    if (editingStaffId && editingStaffData.name && editingStaffData.email) {
      await updateStaff(editingStaffId, {
        name: editingStaffData.name,
        email: editingStaffData.email,
        role: editingStaffData.role
      });
      setEditingStaffId(null);
      setEditingStaffData({});
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      await deleteStaff(id);
    }
  };

  const handleAddPlatform = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlatform) return;

    await addPlatform(newPlatform);
    setNewPlatform('');
  };

  const startEditingPlatform = (platform: Platform) => {
    setEditingPlatformId(platform.id);
    setEditingPlatformName(platform.name);
  };

  const cancelEditingPlatform = () => {
    setEditingPlatformId(null);
    setEditingPlatformName('');
  };

  const savePlatform = async () => {
    if (editingPlatformId && editingPlatformName) {
      await updatePlatform(editingPlatformId, editingPlatformName);
      setEditingPlatformId(null);
      setEditingPlatformName('');
    }
  };

  const handleDeletePlatform = async (id: string) => {
    if (confirm('Are you sure you want to delete this platform?')) {
      await deletePlatform(id);
    }
  };

  return (
    <div className="h-full bg-gray-50 p-6 space-y-6 overflow-y-auto">
      <h2 className="text-2xl font-bold font-[Lexend] text-gray-800">Settings</h2>
      
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('staff')}
          className={`pb-2 px-4 font-medium transition-colors ${
            activeTab === 'staff' 
              ? 'border-b-2 border-[#FF4F00] text-[#FF4F00]' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Staff Management
        </button>
        <button
          onClick={() => setActiveTab('platforms')}
          className={`pb-2 px-4 font-medium transition-colors ${
            activeTab === 'platforms' 
              ? 'border-b-2 border-[#FF4F00] text-[#FF4F00]' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Platform Configuration
        </button>
      </div>

      {activeTab === 'staff' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold font-[Lexend] mb-4">Add New Team Member</h3>
            <form onSubmit={handleAddStaff} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-gray-500 mb-1">Full Name</label>
                <input 
                  required
                  value={newStaff.name || ''}
                  onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                  className="w-full p-2 border border-gray-200 rounded-lg"
                  placeholder="e.g. Jane Doe"
                />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-gray-500 mb-1">Email</label>
                <input 
                  type="email"
                  required
                  value={newStaff.email || ''}
                  onChange={e => setNewStaff({...newStaff, email: e.target.value})}
                  className="w-full p-2 border border-gray-200 rounded-lg"
                  placeholder="e.g. jane@wexlot.com"
                />
              </div>
              <div className="w-full md:w-32">
                <label className="block text-xs font-bold text-gray-500 mb-1">Role</label>
                <select 
                  value={newStaff.role || 'staff'}
                  onChange={e => setNewStaff({...newStaff, role: e.target.value as any})}
                  className="w-full p-2 border border-gray-200 rounded-lg"
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button 
                type="submit"
                className="w-full md:w-auto px-6 py-2 bg-[#FF4F00] text-white rounded-lg hover:bg-[#e04500] font-medium"
              >
                Add Member
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 font-semibold text-gray-700">
              Current Staff ({staff.length})
            </div>
            <div className="divide-y divide-gray-100">
              {staff.map(member => (
                <div key={member.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-3 flex-1">
                    <img 
                      src={member.avatar_url || `https://ui-avatars.com/api/?name=${member.name}`} 
                      alt={member.name}
                      className="w-10 h-10 rounded-full bg-gray-200"
                    />
                    
                    {editingStaffId === member.id ? (
                      <div className="flex flex-col md:flex-row gap-2 flex-1 mr-4">
                        <input
                          autoFocus
                          value={editingStaffData.name || ''}
                          onChange={(e) => setEditingStaffData({...editingStaffData, name: e.target.value})}
                          className="p-1 border border-gray-300 rounded w-full focus:ring-2 focus:ring-[#FF4F00] outline-none"
                          placeholder="Name"
                        />
                        <input
                          value={editingStaffData.email || ''}
                          onChange={(e) => setEditingStaffData({...editingStaffData, email: e.target.value})}
                          className="p-1 border border-gray-300 rounded w-full focus:ring-2 focus:ring-[#FF4F00] outline-none"
                          placeholder="Email"
                        />
                        <select 
                          value={editingStaffData.role || 'staff'}
                          onChange={(e) => setEditingStaffData({...editingStaffData, role: e.target.value as any})}
                          className="p-1 border border-gray-300 rounded w-32"
                        >
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {!editingStaffId && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {member.role.toUpperCase()}
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      {editingStaffId === member.id ? (
                        <>
                          <button 
                            onClick={saveStaff}
                            className="text-green-600 hover:text-green-700 p-1 hover:bg-green-50 rounded"
                            title="Save"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={cancelEditingStaff}
                            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded"
                            title="Cancel"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => startEditingStaff(member)}
                            className="text-gray-400 hover:text-blue-500 transition-colors p-1 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteStaff(member.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {staff.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No staff members added yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'platforms' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold font-[Lexend] mb-4">Create New Platform</h3>
            <form onSubmit={handleAddPlatform} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 mb-1">Platform Name</label>
                <input 
                  required
                  value={newPlatform}
                  onChange={e => setNewPlatform(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg"
                  placeholder="e.g. ScissorUp, TillsUp..."
                />
              </div>
              <button 
                type="submit"
                className="px-6 py-2 bg-[#FF4F00] text-white rounded-lg hover:bg-[#e04500] font-medium"
              >
                Add Platform
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 font-semibold text-gray-700">
              Active Platforms ({platforms.length})
            </div>
            <div className="divide-y divide-gray-100">
              {platforms.map(platform => (
                <div key={platform.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-orange-50 rounded-lg text-[#FF4F00]">
                      <Layers size={20} />
                    </div>
                    {editingPlatformId === platform.id ? (
                      <input
                        autoFocus
                        value={editingPlatformName}
                        onChange={(e) => setEditingPlatformName(e.target.value)}
                        className="p-1 border border-gray-300 rounded w-full max-w-xs focus:ring-2 focus:ring-[#FF4F00] outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') savePlatform();
                          if (e.key === 'Escape') cancelEditingPlatform();
                        }}
                      />
                    ) : (
                      <span className="font-medium text-gray-900">{platform.name}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {editingPlatformId === platform.id ? (
                      <>
                        <button 
                          onClick={savePlatform}
                          className="text-green-600 hover:text-green-700 p-1 hover:bg-green-50 rounded"
                          title="Save"
                        >
                          <Check size={18} />
                        </button>
                        <button 
                          onClick={cancelEditingPlatform}
                          className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded"
                          title="Cancel"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => startEditingPlatform(platform)}
                          className="text-gray-400 hover:text-blue-500 transition-colors p-1 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeletePlatform(platform.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {platforms.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No platforms configured.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}