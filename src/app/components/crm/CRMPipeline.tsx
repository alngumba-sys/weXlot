import { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Deal, DealStage } from '../../../types/crm';
import { format } from 'date-fns';
import { MoreHorizontal, Plus, DollarSign } from 'lucide-react';

const STAGES: { id: DealStage; label: string; color: string }[] = [
  { id: 'lead', label: 'Lead', color: 'bg-gray-100' },
  { id: 'contacted', label: 'Contacted', color: 'bg-blue-50' },
  { id: 'meeting', label: 'Meeting', color: 'bg-purple-50' },
  { id: 'proposal', label: 'Proposal', color: 'bg-yellow-50' },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-orange-50' },
  { id: 'closed-won', label: 'Won', color: 'bg-green-50' },
  { id: 'closed-lost', label: 'Lost', color: 'bg-red-50' },
];

export function CRMPipeline() {
  const { deals, updateDealStage, addDeal, contacts, companies, platforms } = useCRM();
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDeal, setNewDeal] = useState<Partial<Deal>>({ stage: 'lead', probability: 20 });

  const dealsByStage = useMemo(() => {
    const grouped: Record<DealStage, Deal[]> = {
      'lead': [], 'contacted': [], 'meeting': [], 'proposal': [], 
      'negotiation': [], 'closed-won': [], 'closed-lost': []
    };
    deals.forEach(deal => {
      if (grouped[deal.stage]) {
        grouped[deal.stage].push(deal);
      }
    });
    return grouped;
  }, [deals]);

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('dealId', dealId);
    setDraggedDealId(dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, stage: DealStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    if (dealId) {
      await updateDealStage(dealId, stage);
    }
    setDraggedDealId(null);
  };

  const handleAddDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeal.title || !newDeal.value) return;

    await addDeal({
      title: newDeal.title,
      value: Number(newDeal.value),
      stage: newDeal.stage as DealStage || 'lead',
      probability: Number(newDeal.probability),
      expected_close_date: newDeal.expected_close_date,
      contact_id: newDeal.contact_id,
      company_id: newDeal.company_id,
      platform_id: newDeal.platform_id,
      owner_id: newDeal.owner_id
    });
    setIsAddModalOpen(false);
    setNewDeal({ stage: 'lead', probability: 20 });
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center shadow-sm z-10">
        <h2 className="font-[Lexend] text-[16px] font-bold">Sales Pipeline</h2>
        <div className="flex gap-4 items-center">
          <div className="text-sm text-gray-500">
            Total Value: <span className="font-bold text-gray-900">${deals.reduce((sum, d) => sum + (Number(d.value) || 0), 0).toLocaleString()}</span>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-[#FF4F00] text-white rounded-lg hover:bg-[#e04500] font-medium flex items-center gap-2"
          >
            <Plus size={18} /> New Deal
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-4 h-full min-w-max">
          {STAGES.map(stage => (
            <div 
              key={stage.id}
              className={`w-72 flex-shrink-0 flex flex-col rounded-xl ${stage.color} bg-opacity-50 border border-gray-200/50`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="p-3 font-semibold text-gray-700 flex justify-between items-center border-b border-gray-200/50">
                <span>{stage.label}</span>
                <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs text-gray-500">
                  {dealsByStage[stage.id].length}
                </span>
              </div>
              
              <div className="flex-1 p-2 space-y-3 overflow-y-auto">
                {dealsByStage[stage.id].map(deal => (
                  <div
                    key={deal.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal.id)}
                    className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 cursor-move hover:shadow-md transition-shadow group relative"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{deal.title}</h4>
                      <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-1 text-[#FF4F00] font-bold text-sm mb-2">
                      <DollarSign size={14} />
                      {Number(deal.value).toLocaleString()}
                    </div>

                    <div className="space-y-1">
                      {deal.company && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          🏢 {deal.company.name}
                        </p>
                      )}
                      {deal.contact && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          👤 {deal.contact.first_name} {deal.contact.last_name}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 flex justify-between items-center text-xs text-gray-400">
                      <span>{deal.probability}% Prob.</span>
                      {deal.expected_close_date && (
                        <span>{format(new Date(deal.expected_close_date), 'MMM d')}</span>
                      )}
                    </div>
                    
                    {deal.platform && (
                        <div className="mt-2 pt-2 border-t border-gray-50">
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">
                                {deal.platform.name}
                            </span>
                        </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Deal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Create New Deal</h3>
              <button onClick={() => setIsAddModalOpen(false)}><span className="text-2xl">&times;</span></button>
            </div>
            <form onSubmit={handleAddDeal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Deal Title</label>
                <input 
                  required
                  value={newDeal.title || ''}
                  onChange={e => setNewDeal({...newDeal, title: e.target.value})}
                  className="w-full p-2 border border-gray-200 rounded-lg" 
                  placeholder="e.g. Enterprise License for Acme Corp"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Value ($)</label>
                  <input 
                    type="number"
                    required
                    value={newDeal.value || ''}
                    onChange={e => setNewDeal({...newDeal, value: Number(e.target.value)})}
                    className="w-full p-2 border border-gray-200 rounded-lg" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Probability (%)</label>
                  <input 
                    type="number"
                    min="0"
                    max="100"
                    value={newDeal.probability || 20}
                    onChange={e => setNewDeal({...newDeal, probability: Number(e.target.value)})}
                    className="w-full p-2 border border-gray-200 rounded-lg" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Platform</label>
                <select 
                  value={newDeal.platform_id || ''}
                  onChange={e => setNewDeal({...newDeal, platform_id: e.target.value})}
                  className="w-full p-2 border border-gray-200 rounded-lg"
                >
                  <option value="">Select Platform...</option>
                  {platforms.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Contact</label>
                <select 
                  value={newDeal.contact_id || ''}
                  onChange={e => setNewDeal({...newDeal, contact_id: e.target.value})}
                  className="w-full p-2 border border-gray-200 rounded-lg"
                >
                  <option value="">Select Contact...</option>
                  {contacts.map(c => (
                    <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Expected Close Date</label>
                <input 
                  type="date"
                  value={newDeal.expected_close_date || ''}
                  onChange={e => setNewDeal({...newDeal, expected_close_date: e.target.value})}
                  className="w-full p-2 border border-gray-200 rounded-lg" 
                />
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
                  Create Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
