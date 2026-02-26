import { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { format, isPast, isToday, subDays } from 'date-fns';
import { CheckCircle, Circle, Clock, Calendar, AlertCircle, Plus, MoreVertical } from 'lucide-react';
import { Activity, ActivityType } from '../../../types/crm';

export function CRMActivities() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'overdue' | 'completed'>('upcoming');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({ type: 'task' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  console.log('[CRMActivities] Component rendering...');

  // Safely handle context - return null if not available (during hot reload)
  let crmContext;
  try {
    crmContext = useCRM();
  } catch {
    return null;
  }
  
  const { activities, addActivity, completeActivity, updateActivity, contacts, deals, staff, loading } = crmContext;

  console.log('[CRMActivities] Activities loaded:', activities.length, 'Loading:', loading);

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

    setIsSaving(true);
    setSaveError(null);

    try {
      console.log('[Activities] Submitting new activity:', newActivity);
      
      // Clean up data before submitting to database
      const activityData = {
        type: newActivity.type as ActivityType || 'task',
        description: newActivity.description.trim(),
        due_date: newActivity.due_date || undefined,
        completed: false,
        contact_id: newActivity.contact_id || undefined,
        deal_id: newActivity.deal_id || undefined,
        owner_id: newActivity.owner_id || undefined
      };
      
      console.log('[Activities] Cleaned activity data for DB:', activityData);
      const result = await addActivity(activityData);
      
      if (!result) {
        console.error('[Activities] Failed to create activity - no data returned');
        setSaveError('Failed to add activity. Check console for details.');
        return;
      }
      
      console.log('[Activities] Activity created successfully in database:', result);
      setIsAddModalOpen(false);
      setNewActivity({ type: 'task' });
      setSaveError(null);
    } catch (error: any) {
      console.error('[Activities] Exception while adding activity:', error);
      setSaveError(error?.message || 'Failed to add activity. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateActivity = async (activity: Activity) => {
    setIsSaving(true);
    setSaveError(null);

    try {
      console.log('[Activities] Submitting updated activity:', activity);
      
      // Clean up data before submitting to database
      const activityData = {
        type: activity.type as ActivityType || 'task',
        description: activity.description.trim(),
        due_date: activity.due_date || undefined,
        completed: activity.completed,
        contact_id: activity.contact_id || undefined,
        deal_id: activity.deal_id || undefined,
        owner_id: activity.owner_id || undefined
      };
      
      console.log('[Activities] Cleaned activity data for DB:', activityData);
      await updateActivity(activity.id, activityData);
      
      console.log('[Activities] Activity updated successfully in database');
      setIsActionModalOpen(false);
      setSaveError(null);
    } catch (error: any) {
      console.error('[Activities] Exception while updating activity:', error);
      setSaveError(error?.message || 'Failed to update activity. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveToOverdue = async () => {
    if (!selectedActivity) return;
    
    setIsSaving(true);
    setSaveError(null);
    try {
      // Set due date to yesterday to make it overdue
      const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
      console.log('[Activities] Moving to overdue with date:', yesterday);
      await updateActivity(selectedActivity.id, { 
        due_date: yesterday,
        completed: false 
      });
      setIsActionModalOpen(false);
      setSelectedActivity(null);
    } catch (error: any) {
      console.error('[Activities] Failed to move to overdue:', error);
      setSaveError(error?.message || 'Failed to update activity.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkCompleted = async () => {
    if (!selectedActivity) return;
    
    setIsSaving(true);
    setSaveError(null);
    try {
      console.log('[Activities] Marking as completed:', selectedActivity.id);
      await updateActivity(selectedActivity.id, { 
        completed: true,
        completed_at: new Date().toISOString()
      });
      setIsActionModalOpen(false);
      setSelectedActivity(null);
    } catch (error: any) {
      console.error('[Activities] Failed to mark as completed:', error);
      setSaveError(error?.message || 'Failed to update activity.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col relative">
      <div className="p-6 border-b border-gray-200 bg-white flex justify-between items-center shadow-sm relative z-10">
        <div>
          <h2 className="text-xl font-bold font-[Lexend]">My Activities</h2>
          <p className="text-xs text-gray-400 mt-1">
            {activities.length} total • {filteredActivities.length} in view
          </p>
        </div>
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

      <div className="flex-1 overflow-y-auto p-6 relative z-0">
        <div className="space-y-3">
          {filteredActivities.map(activity => (
            <div 
              key={activity.id}
              className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow relative ${activity.completed ? 'opacity-50' : ''}`}
            >
              <button 
                onClick={() => completeActivity(activity.id, !activity.completed)}
                className={`mt-1 flex-shrink-0 z-10 ${activity.completed ? 'text-green-500' : 'text-gray-300 hover:text-green-500'}`}
              >
                {activity.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-4">
                  <h3 className={`font-medium text-gray-900 ${activity.completed ? 'line-through' : ''}`}>
                    {activity.description}
                  </h3>
                  {activity.due_date && (
                    <span className={`text-xs flex items-center gap-1 flex-shrink-0 ${
                      !activity.completed && isPast(new Date(activity.due_date)) && !isToday(new Date(activity.due_date)) 
                        ? 'text-red-600 font-bold' 
                        : 'text-gray-400'
                    }`}>
                      <Calendar size={12} />
                      {format(new Date(activity.due_date), 'MMM d')}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-4 mt-2 text-sm text-gray-500 flex-wrap">
                  <span className="capitalize px-2 py-0.5 bg-gray-100 rounded text-xs">
                    {activity.type}
                  </span>
                  {activity.owner && (
                    <span className="text-xs flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                      👤 {activity.owner.name}
                    </span>
                  )}
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
              <button 
                onClick={() => {
                  setSelectedActivity(activity);
                  setIsActionModalOpen(true);
                }}
                className="text-gray-500 hover:text-gray-700 flex-shrink-0 p-1 z-10 relative"
                aria-label="Activity actions"
              >
                <MoreVertical size={20} />
              </button>
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
                    onChange={e => setNewActivity({...newActivity, due_date: e.target.value || undefined})}
                    className="w-full p-2 border border-gray-200 rounded-lg" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Related Contact</label>
                <select 
                  value={newActivity.contact_id || ''}
                  onChange={e => setNewActivity({...newActivity, contact_id: e.target.value || undefined})}
                  className="w-full p-2 border border-gray-200 rounded-lg"
                >
                  <option value="">None</option>
                  {contacts.map(c => (
                    <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Assigned Staff</label>
                <select 
                  value={newActivity.owner_id || ''}
                  onChange={e => setNewActivity({...newActivity, owner_id: e.target.value || undefined})}
                  className="w-full p-2 border border-gray-200 rounded-lg"
                >
                  <option value="">None</option>
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {saveError && (
                <div className="text-red-500 text-sm mt-2">
                  {saveError}
                </div>
              )}

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
                  disabled={isSaving}
                >
                  {isSaving ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {isActionModalOpen && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Activity Actions</h3>
              <button onClick={() => setIsActionModalOpen(false)}><span className="text-2xl">&times;</span></button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-1">{selectedActivity.description}</h4>
                <p className="text-sm text-gray-500">
                  {selectedActivity.type} • {selectedActivity.due_date ? format(new Date(selectedActivity.due_date), 'MMM d, yyyy') : 'No due date'}
                </p>
              </div>

              {saveError && (
                <div className="text-red-500 text-sm mb-4">
                  {saveError}
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleMarkCompleted}
                  disabled={isSaving || selectedActivity.completed}
                  className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle size={20} />
                  {isSaving ? 'Processing...' : selectedActivity.completed ? 'Already Completed' : 'Mark as Completed'}
                </button>

                <button
                  onClick={handleMoveToOverdue}
                  disabled={isSaving || selectedActivity.completed}
                  className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                >
                  <AlertCircle size={20} />
                  {isSaving ? 'Processing...' : 'Move to Overdue'}
                </button>

                <button
                  onClick={() => setIsActionModalOpen(false)}
                  disabled={isSaving}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}