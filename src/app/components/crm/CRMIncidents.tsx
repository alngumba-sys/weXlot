import { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Incident, IncidentSeverity, IncidentStatus } from '../../../types/crm';
import { format } from 'date-fns';
import { AlertTriangle, Plus, CheckCircle, Clock, Filter, Search } from 'lucide-react';

export function CRMIncidents() {
  console.log('[CRMIncidents] Component function called');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | IncidentStatus>('all');
  const [filterSeverity, setFilterSeverity] = useState<'all' | IncidentSeverity>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [newIncident, setNewIncident] = useState<Partial<Incident>>({
    severity: 'medium',
    status: 'ongoing'
  });

  // Safely handle context
  let crmContext;
  try {
    crmContext = useCRM();
    console.log('[CRMIncidents] Successfully got CRM context');
  } catch (error) {
    console.error('[CRMIncidents] Failed to get CRM context:', error);
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <p className="text-red-600 font-bold mb-2">Context Error</p>
          <p className="text-gray-500 text-sm">CRM context not available</p>
        </div>
      </div>
    );
  }

  const { incidents, addIncident, updateIncident, staff, contacts, platforms, loading, error } = crmContext;

  console.log('[CRMIncidents] Rendering with', incidents?.length || 0, 'incidents, loading:', loading);

  // Filter incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter(incident => {
      const matchesStatus = filterStatus === 'all' || incident.status === filterStatus;
      const matchesSeverity = filterSeverity === 'all' || incident.severity === filterSeverity;
      const matchesSearch = !searchQuery || 
        incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesSeverity && matchesSearch;
    });
  }, [incidents, filterStatus, filterSeverity, searchQuery]);

  const handleAddIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncident.title || !newIncident.description) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      await addIncident({
        title: newIncident.title,
        description: newIncident.description,
        severity: newIncident.severity as IncidentSeverity || 'medium',
        status: 'ongoing',
        reported_by: newIncident.reported_by,
        assigned_to: newIncident.assigned_to,
        contact_id: newIncident.contact_id,
        platform_id: newIncident.platform_id,
      });
      setIsAddModalOpen(false);
      setNewIncident({ severity: 'medium', status: 'ongoing' });
    } catch (error) {
      setSaveError('Failed to create incident. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (incident: Incident) => {
    const newStatus: IncidentStatus = incident.status === 'ongoing' ? 'resolved' : 'ongoing';
    await updateIncident(incident.id, { 
      status: newStatus,
      resolved_at: newStatus === 'resolved' ? new Date().toISOString() : undefined
    });
  };

  const getSeverityColor = (severity: IncidentSeverity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getSeverityIcon = (severity: IncidentSeverity) => {
    const baseClass = "flex-shrink-0";
    switch (severity) {
      case 'critical': return <AlertTriangle className={`${baseClass} text-red-600`} size={18} />;
      case 'high': return <AlertTriangle className={`${baseClass} text-orange-600`} size={18} />;
      case 'medium': return <AlertTriangle className={`${baseClass} text-yellow-600`} size={18} />;
      case 'low': return <AlertTriangle className={`${baseClass} text-blue-600`} size={18} />;
      default: return <AlertTriangle className={`${baseClass} text-gray-600`} size={18} />;
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4F00] mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading incidents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading incidents</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-6 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold font-[Lexend] text-gray-800">Issue Log</h2>
            <p className="text-sm text-gray-500 mt-1">Track and manage incidents and issues</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-[#FF4F00] text-white rounded-lg hover:bg-[#e04500] font-medium flex items-center gap-2"
          >
            <Plus size={18} /> New Issue
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | IncidentStatus)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
            >
              <option value="all">All Status</option>
              <option value="ongoing">Ongoing</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value as 'all' | IncidentSeverity)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Issue</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Severity</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Platform</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned To</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredIncidents.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <AlertTriangle size={48} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium">No issues found</p>
                    <p className="text-sm mt-1">Create a new issue to get started</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredIncidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        {getSeverityIcon(incident.severity)}
                        {incident.title}
                      </div>
                      <div className="text-sm text-gray-500 mt-1 line-clamp-2">{incident.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${getSeverityColor(incident.severity)}`}>
                      {incident.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      incident.status === 'resolved' 
                        ? 'bg-green-100 text-green-700 border border-green-300' 
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}>
                      {incident.status === 'resolved' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {incident.status === 'resolved' ? 'Resolved' : 'Ongoing'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {incident.platform?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {incident.contact ? `${incident.contact.first_name} ${incident.contact.last_name}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {incident.assignee?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {format(new Date(incident.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(incident)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        incident.status === 'ongoing'
                          ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {incident.status === 'ongoing' ? 'Mark Resolved' : 'Reopen'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Incident Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="font-bold text-lg">Create New Issue</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <form onSubmit={handleAddIncident} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Issue Title *</label>
                <input
                  required
                  value={newIncident.title || ''}
                  onChange={e => setNewIncident({...newIncident, title: e.target.value})}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
                  placeholder="Brief description of the issue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Description *</label>
                <textarea
                  required
                  rows={4}
                  value={newIncident.description || ''}
                  onChange={e => setNewIncident({...newIncident, description: e.target.value})}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
                  placeholder="Detailed description of the issue..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Severity *</label>
                  <select
                    required
                    value={newIncident.severity || 'medium'}
                    onChange={e => setNewIncident({...newIncident, severity: e.target.value as IncidentSeverity})}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Platform</label>
                  <select
                    value={newIncident.platform_id || ''}
                    onChange={e => setNewIncident({...newIncident, platform_id: e.target.value})}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
                  >
                    <option value="">Select Platform...</option>
                    {platforms.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Related Contact</label>
                  <select
                    value={newIncident.contact_id || ''}
                    onChange={e => setNewIncident({...newIncident, contact_id: e.target.value})}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
                  >
                    <option value="">Select Contact...</option>
                    {contacts.map(c => (
                      <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Assign To</label>
                  <select
                    value={newIncident.assigned_to || ''}
                    onChange={e => setNewIncident({...newIncident, assigned_to: e.target.value})}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
                  >
                    <option value="">Select Staff...</option>
                    {staff.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {saveError && (
                <div className="text-sm text-red-500 mt-2">{saveError}</div>
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
                  {isSaving ? 'Creating...' : 'Create Issue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
