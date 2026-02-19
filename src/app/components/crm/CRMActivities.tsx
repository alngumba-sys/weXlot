import { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { format, isPast, isToday } from 'date-fns';
import { CheckCircle, Circle, Clock, Calendar, AlertCircle, Plus } from 'lucide-react';
import { Activity, ActivityType } from '../../../types/crm';

export function CRMActivities() {
  const { activities, addActivity, completeActivity, contacts, deals } = useCRM();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'overdue' | 'completed'>('upcoming');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({ type: 'task' });

  const filteredActivities = activities.filter(activity => {
    if (filter === 'completed') return activity.completed;
    if (activity.completed) return false;
    
    if (filter === 'overdue') {
      return activity.due_date && isPast(new Date(activity.due_date)) && !isToday(new Date(activity.due_date));
    }
    if (filter === 'upcoming') {
      return !activity.due_date || !isPast(new Date(activity.due_date)) || isToday(new Date(activity.due_date));
    }
    return true;
  });

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.description) return;

    await addActivity({
      type: newActivity.type as ActivityType || 'task',
      description: newActivity.description,
      due_date: newActivity.due_date,
      completed: false,
      contact_id: newActivity.contact_id,
      deal_id: newActivity.deal_id,
      owner_id: newActivity.owner_id
    });
    setIsAddModalOpen(false);
    setNewActivity({ type: 'task' });
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="p-6 border-b border-gray-200 bg-white flex justify-between items-center shadow-sm">
        <h2 className="text-xl font-bold font-[Lexend]">My Activities</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter('upcoming')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'upcoming' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setFilter('overdue')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'overdue' ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            Overdue
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'completed' ? 'bg-green-50 text-green-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            Completed
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="ml-4 px-4 py-2 bg-[#FF4F00] text-white rounded-lg hover:bg-[#e04500] flex items-center gap-2"
          >
            <Plus size={18} /> Add Task
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-3">
          {filteredActivities.map(activity => (
            <div 
              key={activity.id}
              className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow ${activity.completed ? 'opacity-50' : ''}`}
            >
              <button 
                onClick={() => completeActivity(activity.id, !activity.completed)}
                className={`mt-1 flex-shrink-0 ${activity.completed ? 'text-green-500' : 'text-gray-300 hover:text-green-500'}`}
              >
                {activity.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
              </button>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`font-medium text-gray-900 ${activity.completed ? 'line-through' : ''}`}>
                    {activity.description}
                  </h3>
                  {activity.due_date && (
                    <span className={`text-xs flex items-center gap-1 ${
                      !activity.completed && isPast(new Date(activity.due_date)) && !isToday(new Date(activity.due_date)) 
                        ? 'text-red-600 font-bold' 
                        : 'text-gray-400'
                    }`}>
                      <Calendar size={12} />
                      {format(new Date(activity.due_date), 'MMM d')}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span className="capitalize px-2 py-0.5 bg-gray-100 rounded text-xs">
                    {activity.type}
                  </span>
                  {activity.contact_id && (
                    <span className="text-xs flex items-center gap-1">
                      👤 Contact ID: {activity.contact_id.substring(0, 8)}...
                    </span>
                  )}
                  {activity.deal_id && (
                    <span className="text-xs flex items-center gap-1">
                      💼 Deal ID: {activity.deal_id.substring(0, 8)}...
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {filteredActivities.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <CheckCircle size={48} className="mx-auto mb-4 opacity-20" />
              <p>No activities found in this view.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Add New Task</h3>
              <button onClick={() => setIsAddModalOpen(false)}><span className="text-2xl">&times;</span></button>
            </div>
            <form onSubmit={handleAddActivity} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                <input 
                  required
                  value={newActivity.description || ''}
                  onChange={e => setNewActivity({...newActivity, description: e.target.value})}
                  className="w-full p-2 border border-gray-200 rounded-lg" 
                  placeholder="e.g. Follow up with John regarding contract"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Type</label>
                  <select 
                    value={newActivity.type || 'task'}
                    onChange={e => setNewActivity({...newActivity, type: e.target.value as ActivityType})}
                    className="w-full p-2 border border-gray-200 rounded-lg"
                  >
                    <option value="task">Task</option>
                    <option value="call">Call</option>
                    <option value="email">Email</option>
                    <option value="meeting">Meeting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Due Date</label>
                  <input 
                    type="date"
                    value={newActivity.due_date || ''}
                    onChange={e => setNewActivity({...newActivity, due_date: e.target.value})}
                    className="w-full p-2 border border-gray-200 rounded-lg" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Related Contact</label>
                <select 
                  value={newActivity.contact_id || ''}
                  onChange={e => setNewActivity({...newActivity, contact_id: e.target.value})}
                  className="w-full p-2 border border-gray-200 rounded-lg"
                >
                  <option value="">None</option>
                  {contacts.map(c => (
                    <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-[#FF4F00] text-white rounded-lg hover:bg-[#e04500]"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
