import { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Incident, IncidentSeverity, IncidentStatus } from '../../../types/crm';
import { format } from 'date-fns';
import { AlertTriangle, Plus, CheckCircle, Clock, Filter, Search, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export function CRMIncidents() {
  console.log('[CRMIncidents] Component function called');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | IncidentStatus>('all');
  const [filterSeverity, setFilterSeverity] = useState<'all' | IncidentSeverity>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [expandedIncidentId, setExpandedIncidentId] = useState<string | null>(null);
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

  const { incidents, addIncident, updateIncident, deleteIncident, staff, contacts, platforms, loading, error } = crmContext;

  console.log('[CRMIncidents] Rendering with', incidents?.length || 0, 'incidents, loading:', loading);

  // Check if incidents table exists (if incidents is empty and there's no loading, table likely doesn't exist)
  const incidentsTableExists = incidents.length > 0 || loading || error;

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
    } catch (error: any) {
      console.error('Failed to create incident:', error);
      // Check if it's an RLS policy error
      if (error?.code === '42501' || error?.message?.includes('row-level security policy')) {
        setSaveError('⚠️ Row-Level Security Error: Please run /DISABLE_RLS_NOW.sql in your Supabase SQL Editor to fix this.');
      }
      // Check if it's a missing table error
      else if (error?.code === 'PGRST205' || error?.message?.includes('Could not find the table')) {
        setSaveError('⚠️ Database not set up. Please run the SQL migration script from /supabase-migration-fix.sql in your Supabase SQL Editor.');
      } else {
        setSaveError(`Failed to create incident: ${error?.message || 'Please try again.'}`);
      }
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
    // Check if it's an RLS error
    const isRLSError = error?.message?.includes('row-level security') || error?.code === '42501';
    
    return (
      <div className="p-6 max-w-4xl mx-auto">
        {isRLSError ? (
          // RLS ERROR - Show prominent fix instructions
          <div className="space-y-6">
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="text-3xl">🚨</div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-red-800 mb-2">
                    Database Security Policy Error
                  </h2>
                  <p className="text-red-700 font-semibold mb-4">
                    Row-Level Security (RLS) is blocking database operations.
                  </p>
                  <div className="bg-white rounded p-4 border border-red-200">
                    <code className="text-sm text-red-900 block whitespace-pre-wrap">
                      {error?.message || 'new row violates row-level security policy'}
                    </code>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 text-white rounded-lg p-6 shadow-lg">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                ⚡ QUICK FIX (1 minute)
              </h3>
              
              <div className="space-y-4">
                <div className="bg-blue-700 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-white text-blue-600 font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Open Supabase Dashboard</p>
                      <a 
                        href="https://supabase.com/dashboard" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-blue-50 transition-colors"
                      >
                        → Go to Supabase Dashboard
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-700 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-white text-blue-600 font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold mb-2">Navigate to SQL Editor</p>
                      <p className="text-blue-100 text-sm">
                        Click your project → <strong>SQL Editor</strong> (left sidebar) → <strong>New Query</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-700 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-white text-blue-600 font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold mb-3">Copy & Paste This SQL</p>
                      <div className="bg-gray-900 rounded p-4 relative">
                        <p className="text-green-400 text-xs mb-2 font-semibold">👇 Click inside and press Ctrl+A (or Cmd+A) to select all, then Ctrl+C (or Cmd+C) to copy</p>
                        <textarea
                          readOnly
                          onClick={(e) => e.currentTarget.select()}
                          className="w-full bg-gray-800 text-green-400 text-xs p-3 rounded border border-gray-700 font-mono resize-none"
                          rows={8}
                          value={`ALTER TABLE IF EXISTS incidents DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS platforms DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS deals DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS interactions DISABLE ROW LEVEL SECURITY;`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-700 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-white text-blue-600 font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      4
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Click RUN in Supabase</p>
                      <p className="text-blue-100 text-sm">
                        Then come back here and refresh this page
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-blue-500">
                <p className="text-sm text-blue-100">
                  💡 <strong>What this does:</strong> Disables Row-Level Security on your database tables, allowing the app to work in demo/development mode without authentication.
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                📚 <strong>Alternative:</strong> See files <code className="bg-yellow-100 px-2 py-1 rounded">/QUICK_FIX.md</code>, 
                <code className="bg-yellow-100 px-2 py-1 rounded ml-1">/DISABLE_RLS_NOW.sql</code>, or 
                <code className="bg-yellow-100 px-2 py-1 rounded ml-1">/RLS_ERROR_FIX.md</code> in your project folder for detailed instructions.
              </p>
            </div>
          </div>
        ) : (
          // OTHER ERRORS - Show original error message
          <div className="space-y-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 text-3xl mr-4">⚠️</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Database Setup Required</h3>
                  <p className="text-gray-700 mb-4">
                    The incidents table could not be loaded. This usually means the database hasn't been set up yet.
                  </p>
                  {error?.message && (
                    <div className="bg-white p-3 rounded border border-yellow-200 mb-4">
                      <code className="text-sm text-red-600">{error.message}</code>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded border border-gray-200">
              <p className="text-sm text-gray-500">
                To fix this, run the SQL migration script from <code className="bg-gray-100 px-2 py-1 rounded font-mono">/supabase-migration-fix.sql</code> in your Supabase SQL Editor.
              </p>
              <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                <li>Open your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-[#FF4F00] underline hover:text-[#e04500]">Supabase Dashboard</a></li>
                <li>Go to <strong>SQL Editor</strong> → <strong>New Query</strong></li>
                <li>Copy all SQL from <code className="bg-gray-100 px-2 py-1 rounded font-mono">/supabase-migration-fix.sql</code></li>
                <li>Paste and click <strong>Run</strong></li>
                <li>Refresh this page</li>
              </ol>
              <p className="text-xs text-gray-500 mt-3">
                📄 Use the <strong>migration-fix</strong> script (not setup.sql) if you already have tables.
              </p>
            </div>

            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <p className="text-xs text-blue-700">
                💡 <strong>Tip:</strong> The migration script safely adds missing columns and tables without deleting your existing data.
              </p>
            </div>
          </div>
        )}
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
              filteredIncidents.flatMap((incident) => {
                const rows = [
                  <tr 
                    key={incident.id}
                    onClick={() => setExpandedIncidentId(expandedIncidentId === incident.id ? null : incident.id)}
                    className={`cursor-pointer transition-colors ${
                      expandedIncidentId === incident.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2">
                        <button 
                          className="flex-shrink-0 mt-1 text-gray-400 hover:text-gray-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedIncidentId(expandedIncidentId === incident.id ? null : incident.id);
                          }}
                        >
                          {expandedIncidentId === incident.id ? (
                            <ChevronUp size={18} className="text-blue-600" />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 flex items-center gap-2">
                            {getSeverityIcon(incident.severity)}
                            {incident.title}
                          </div>
                          <div className="text-sm text-gray-500 mt-1 line-clamp-2">{incident.description}</div>
                        </div>
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
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(incident);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            incident.status === 'ongoing'
                              ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                          }`}
                        >
                          {incident.status === 'ongoing' ? 'Mark Resolved' : 'Reopen'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(incident.id);
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                          title="Delete incident"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ];

                // Add expanded row if this incident is expanded
                if (expandedIncidentId === incident.id) {
                  rows.push(
                    <tr key={`${incident.id}-expanded`} className="bg-blue-50">
                      <td colSpan={8} className="px-6 py-6">
                        <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-blue-200">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="text-lg font-bold text-gray-900">Issue Details</h4>
                            <button
                              onClick={() => setExpandedIncidentId(null)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <span className="text-2xl">&times;</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Title */}
                            <div className="md:col-span-2">
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                Issue Title
                              </label>
                              <p className="text-gray-900 font-medium">{incident.title}</p>
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                Description
                              </label>
                              <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200">
                                {incident.description || 'No description provided'}
                              </p>
                            </div>

                            {/* Severity */}
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                Severity Level
                              </label>
                              <span className={`inline-flex px-3 py-1.5 rounded-lg text-sm font-bold border ${getSeverityColor(incident.severity)}`}>
                                {getSeverityIcon(incident.severity)}
                                <span className="ml-2">{incident.severity.toUpperCase()}</span>
                              </span>
                            </div>

                            {/* Status */}
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                Current Status
                              </label>
                              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold ${
                                incident.status === 'resolved' 
                                  ? 'bg-green-100 text-green-700 border border-green-300' 
                                  : 'bg-gray-100 text-gray-700 border border-gray-300'
                              }`}>
                                {incident.status === 'resolved' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                {incident.status === 'resolved' ? 'Resolved' : 'Ongoing'}
                              </span>
                            </div>

                            {/* Platform */}
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                Platform
                              </label>
                              <p className="text-gray-900">{incident.platform?.name || 'Not specified'}</p>
                            </div>

                            {/* Related Contact */}
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                Related Contact
                              </label>
                              <p className="text-gray-900">
                                {incident.contact 
                                  ? `${incident.contact.first_name} ${incident.contact.last_name}${incident.contact.business_name ? ` (${incident.contact.business_name})` : ''}`
                                  : 'Not specified'
                                }
                              </p>
                            </div>

                            {/* Assigned To */}
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                Assigned To
                              </label>
                              <p className="text-gray-900">{incident.assignee?.name || 'Unassigned'}</p>
                            </div>

                            {/* Reported By */}
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                Reported By
                              </label>
                              <p className="text-gray-900">{incident.reporter?.name || 'Not specified'}</p>
                            </div>

                            {/* Created Date */}
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                Created On
                              </label>
                              <p className="text-gray-900">
                                {format(new Date(incident.created_at), 'MMMM d, yyyy')}
                                <span className="text-gray-500 text-sm ml-2">
                                  at {format(new Date(incident.created_at), 'h:mm a')}
                                </span>
                              </p>
                            </div>

                            {/* Resolved Date (if resolved) */}
                            {incident.status === 'resolved' && incident.resolved_at && (
                              <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                  Resolved On
                                </label>
                                <p className="text-gray-900">
                                  {format(new Date(incident.resolved_at), 'MMMM d, yyyy')}
                                  <span className="text-gray-500 text-sm ml-2">
                                    at {format(new Date(incident.resolved_at), 'h:mm a')}
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Action buttons in detail view */}
                          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end gap-3">
                            <button
                              onClick={() => handleToggleStatus(incident)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                incident.status === 'ongoing'
                                  ? 'bg-green-600 text-white hover:bg-green-700'
                                  : 'bg-gray-600 text-white hover:bg-gray-700'
                              }`}
                            >
                              {incident.status === 'ongoing' ? '✓ Mark as Resolved' : '↺ Reopen Issue'}
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(incident.id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                            >
                              <Trash2 size={16} />
                              Delete Issue
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return rows;
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Incident Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="border-b border-gray-200 flex justify-between items-center px-6 py-4 flex-shrink-0">
              <h3 className="font-bold text-xl">Create New Issue</h3>
              <button 
                onClick={() => {
                  setIsAddModalOpen(false);
                  setSaveError(null);
                }} 
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              <form onSubmit={handleAddIncident} className="space-y-4">
                <p className="text-xs text-gray-500 mx-[0px] mt-[0px] mb-[4px]">* Indicates required</p>

                {/* Title Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Title*
                  </label>
                  <input
                    type="text"
                    required
                    value={newIncident.title || ''}
                    onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                    placeholder="Enter issue title"
                  />
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newIncident.description || ''}
                    onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none resize-none transition-colors"
                    rows={4}
                    maxLength={2000}
                    placeholder="Describe the issue..."
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {(newIncident.description || '').length}/2,000
                  </div>
                </div>

                {/* Severity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severity*
                  </label>
                  <select
                    required
                    value={newIncident.severity || 'medium'}
                    onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value as IncidentSeverity })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                {/* Platform */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platform
                  </label>
                  <select
                    value={newIncident.platform_id || ''}
                    onChange={(e) => setNewIncident({ ...newIncident, platform_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                  >
                    <option value="">Select platform</option>
                    {platforms.map(platform => (
                      <option key={platform.id} value={platform.id}>{platform.name}</option>
                    ))}
                  </select>
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Related Contact
                  </label>
                  <select
                    value={newIncident.contact_id || ''}
                    onChange={(e) => setNewIncident({ ...newIncident, contact_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                  >
                    <option value="">Select contact</option>
                    {contacts.map(contact => (
                      <option key={contact.id} value={contact.id}>
                        {contact.first_name} {contact.last_name} {contact.business_name ? `(${contact.business_name})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assigned To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign To
                  </label>
                  <select
                    value={newIncident.assigned_to || ''}
                    onChange={(e) => setNewIncident({ ...newIncident, assigned_to: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                  >
                    <option value="">Select team member</option>
                    {staff.map(member => (
                      <option key={member.id} value={member.id}>{member.name}</option>
                    ))}
                  </select>
                </div>

                {/* Reported By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reported By
                  </label>
                  <select
                    value={newIncident.reported_by || ''}
                    onChange={(e) => setNewIncident({ ...newIncident, reported_by: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                  >
                    <option value="">Select reporter</option>
                    {staff.map(member => (
                      <option key={member.id} value={member.id}>{member.name}</option>
                    ))}
                  </select>
                </div>

                {/* Error Message */}
                {saveError && (
                  <div className="bg-red-50 border border-red-300 rounded-lg p-4">
                    <p className="text-sm text-red-700 font-semibold mb-2">{saveError}</p>
                    {saveError.includes('Row-Level Security') && (
                      <div className="mt-3 space-y-3">
                        <p className="text-xs text-gray-700 font-semibold">
                          👇 Select all text below (Ctrl+A or Cmd+A), copy (Ctrl+C or Cmd+C), then paste in Supabase SQL Editor:
                        </p>
                        <textarea
                          readOnly
                          onClick={(e) => e.currentTarget.select()}
                          className="w-full bg-gray-900 text-green-400 text-xs p-3 rounded border border-gray-700 font-mono resize-none"
                          rows={8}
                          value={`ALTER TABLE IF EXISTS incidents DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS platforms DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS deals DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS interactions DISABLE ROW LEVEL SECURITY;`}
                        />
                        <p className="text-xs text-gray-600 text-center">
                          Then paste in <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700">Supabase SQL Editor</a> and click RUN
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setSaveError(null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (() => {
        const incidentToDelete = incidents.find(inc => inc.id === deleteConfirmId);
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[150] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <Trash2 className="text-red-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Delete Issue</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                  </div>
                </div>
                
                {incidentToDelete && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <p className="text-sm font-semibold text-gray-900 mb-1">{incidentToDelete.title}</p>
                    <p className="text-xs text-gray-600 line-clamp-2">{incidentToDelete.description}</p>
                  </div>
                )}

                <p className="text-sm text-gray-700 mb-6">
                  Are you sure you want to delete this incident? This will permanently remove all associated data.
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      await deleteIncident(deleteConfirmId);
                      setDeleteConfirmId(null);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete Issue
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}