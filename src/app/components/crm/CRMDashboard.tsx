import { useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Briefcase, DollarSign, TrendingUp, Users, Phone, Mail, Calendar } from 'lucide-react';

export function CRMDashboard() {
  console.log('[CRMDashboard] Component function called');
  
  // Safely handle context - return null if not available (during hot reload)
  let crmContext;
  try {
    crmContext = useCRM();
    console.log('[CRMDashboard] Successfully got CRM context');
  } catch (error) {
    console.error('[CRMDashboard] Failed to get CRM context:', error);
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <p className="text-red-600 font-bold mb-2">Context Error</p>
          <p className="text-gray-500 text-sm">CRM context not available</p>
        </div>
      </div>
    );
  }
  
  const { deals, interactions, staff, activities, loading, error } = crmContext;
  
  console.log('[CRMDashboard] Rendering with:', { 
    dealsCount: deals?.length, 
    staffCount: staff?.length, 
    loading, 
    error 
  });

  const stats = useMemo(() => {
    const totalPipelineValue = deals.reduce((sum, deal) => sum + (Number(deal.value) || 0), 0);
    const weightedForecast = deals.reduce((sum, deal) => sum + ((Number(deal.value) || 0) * (deal.probability / 100)), 0);
    const activeDeals = deals.filter(d => d.stage !== 'closed-won' && d.stage !== 'closed-lost').length;
    
    // Activity by Rep
    const activityByRep = staff.map(rep => {
      const repInteractions = interactions.filter(i => i.owner_id === rep.id).length; // assuming interactions have owner_id, wait, schema didn't have owner_id for interactions, let's check
      // Ah, interactions schema: contact_id, deal_id. But usually interaction is logged by someone. 
      // I'll assume interactions might need an 'author' but for now let's use activities which have owner_id.
      const repActivities = activities.filter(a => a.owner_id === rep.id && a.completed).length;
      return {
        name: rep.name,
        activities: repActivities,
        value: deals.filter(d => d.owner_id === rep.id).reduce((sum, d) => sum + Number(d.value), 0)
      };
    });

    return { totalPipelineValue, weightedForecast, activeDeals, activityByRep };
  }, [deals, interactions, staff, activities]);

  const recentInteractions = interactions.slice(0, 5);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4F00] mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading dashboard</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-full bg-gray-50">
      <h2 className="text-2xl font-bold font-[Lexend] text-gray-800">Sales Dashboard</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-[Mallanna]">Total Pipeline</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">${stats.totalPipelineValue.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-[Mallanna]">Weighted Forecast</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">${stats.weightedForecast.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-[Mallanna]">Active Deals</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.activeDeals}</h3>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <Briefcase size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-[Mallanna]">Team Activity (This Week)</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{activities.filter(a => a.completed).length}</h3>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <Users size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Charts */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold font-[Lexend] text-gray-800 mb-4">Pipeline by Rep</h3>
          <div style={{ width: '100%', height: '256px' }}>
            <ResponsiveContainer>
              <BarChart data={stats.activityByRep}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']} />
                <Bar dataKey="value" fill="#FF4F00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold font-[Lexend] text-gray-800 mb-4">Live Interactions</h3>
          <div className="space-y-4">
            {recentInteractions.length > 0 ? (
              recentInteractions.map((interaction) => (
                <div key={interaction.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0">
                  <div className={`mt-1 p-1.5 rounded-full text-white ${
                    interaction.type === 'call' ? 'bg-green-500' : 
                    interaction.type === 'email' ? 'bg-blue-500' : 
                    interaction.type === 'meeting' ? 'bg-purple-500' : 'bg-gray-500'
                  }`}>
                    {interaction.type === 'call' && <Phone size={12} />}
                    {interaction.type === 'email' && <Mail size={12} />}
                    {interaction.type === 'meeting' && <Users size={12} />}
                    {interaction.type === 'note' && <Briefcase size={12} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)} with <span className="text-[#FF4F00]">{interaction.contact_id || 'Unknown Contact'}</span>
                    </p>
                    <p className="text-xs text-gray-500 font-[Mallanna] line-clamp-1">{interaction.notes}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{format(new Date(interaction.date), 'MMM d, h:mm a')}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent interactions logged.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}