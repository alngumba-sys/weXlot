import { useState, useMemo, useRef, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Deal, DealStage } from '../../../types/crm';
import { format } from 'date-fns';
import { MoreHorizontal, Plus, DollarSign, ChevronRight, Trash2, User, Layers } from 'lucide-react';

const STAGES: { id: DealStage; label: string; color: string }[] = [
  { id: 'planned-visit', label: 'Planned to visit', color: 'bg-gray-100' },
  { id: 'first-contact', label: 'First contact established', color: 'bg-blue-50' },
  { id: 'decision-maker', label: 'Decision maker stage', color: 'bg-purple-50' },
  { id: 'demo', label: 'Demo stage', color: 'bg-yellow-50' },
  { id: 'decision', label: 'Decision stage', color: 'bg-orange-50' },
  { id: 'closed-won', label: 'Won (Pilot Stage)', color: 'bg-green-50' },
  { id: 'closed-lost', label: 'Lost', color: 'bg-red-50' },
];

export function CRMPipeline() {
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDeal, setNewDeal] = useState<Partial<Deal>>({ stage: 'planned-visit', probability: 20 });
  const [openMenuDealId, setOpenMenuDealId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Safely handle context - return null if not available (during hot reload)
  let crmContext;
  try {
    crmContext = useCRM();
  } catch {
    return null;
  }
  
  const { deals, updateDealStage, deleteDeal, addDeal, contacts, companies, platforms, staff, loading } = crmContext;

  console.log('[CRMPipeline] Rendering with', deals?.length || 0, 'deals, loading:', loading);

  // Group deals by stage, then platform, then contact
  const dealsByStageAndPlatformAndContact = useMemo(() => {
    const grouped: Record<DealStage, Record<string, Record<string, Deal[]>>> = {
      'planned-visit': {}, 'first-contact': {}, 'decision-maker': {}, 'demo': {}, 
      'decision': {}, 'closed-won': {}, 'closed-lost': {}
    };
    
    deals.forEach(deal => {
      if (grouped[deal.stage]) {
        // Group by platform_id first
        const platformKey = deal.platform_id || 'no-platform';
        if (!grouped[deal.stage][platformKey]) {
          grouped[deal.stage][platformKey] = {};
        }
        
        // Then group by contact_id within platform
        const contactKey = deal.contact_id || 'no-contact';
        if (!grouped[deal.stage][platformKey][contactKey]) {
          grouped[deal.stage][platformKey][contactKey] = [];
        }
        grouped[deal.stage][platformKey][contactKey].push(deal);
      }
    });
    
    return grouped;
  }, [deals]);

  const dealsByStage = useMemo(() => {
    const grouped: Record<DealStage, Deal[]> = {
      'planned-visit': [], 'first-contact': [], 'decision-maker': [], 'demo': [], 
      'decision': [], 'closed-won': [], 'closed-lost': []
    };
    deals.forEach(deal => {
      if (grouped[deal.stage]) {
        grouped[deal.stage].push(deal);
      }
    });
    return grouped;
  }, [deals]);

  // Calculate totals per platform
  const platformTotals = useMemo(() => {
    const totals: Record<string, { name: string; total: number }> = {};
    
    deals.forEach(deal => {
      const platformId = deal.platform_id || 'no-platform';
      const platformName = deal.platform?.name || 'No Platform';
      
      if (!totals[platformId]) {
        totals[platformId] = { name: platformName, total: 0 };
      }
      totals[platformId].total += Number(deal.value) || 0;
    });
    
    return Object.values(totals).sort((a, b) => b.total - a.total);
  }, [deals]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuDealId(null);
      }
    };

    if (openMenuDealId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuDealId]);

  const getNextStage = (currentStage: DealStage): DealStage | null => {
    const stageOrder: DealStage[] = ['planned-visit', 'first-contact', 'decision-maker', 'demo', 'decision', 'closed-won'];
    const currentIndex = stageOrder.indexOf(currentStage);
    if (currentIndex >= 0 && currentIndex < stageOrder.length - 1) {
      return stageOrder[currentIndex + 1];
    }
    return null;
  };

  const handleMoveToNextStage = async (dealId: string, currentStage: DealStage) => {
    const nextStage = getNextStage(currentStage);
    if (nextStage) {
      await updateDealStage(dealId, nextStage);
      setOpenMenuDealId(null);
    }
  };

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

    setIsSaving(true);
    setSaveError(null);

    try {
      await addDeal({
        title: newDeal.title,
        value: Number(newDeal.value),
        stage: newDeal.stage as DealStage || 'planned-visit',
        probability: Number(newDeal.probability),
        expected_close_date: newDeal.expected_close_date,
        contact_id: newDeal.contact_id,
        company_id: newDeal.company_id,
        platform_id: newDeal.platform_id,
        owner_id: newDeal.owner_id
      });
      setIsAddModalOpen(false);
      setNewDeal({ stage: 'planned-visit', probability: 20 });
    } catch (error) {
      setSaveError('Failed to create deal. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center shadow-sm z-10">
        <h2 className="font-[Lexend] text-[16px] font-bold">Sales Pipeline</h2>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div>
              Total Value: <span className="font-bold text-gray-900">${deals.reduce((sum, d) => sum + (Number(d.value) || 0), 0).toLocaleString()}</span>
            </div>
            {platformTotals.length > 0 && (
              <div className="flex items-center gap-3">
                {platformTotals.map((platform, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{platform.name}:</span>
                    <span className="font-semibold text-gray-900">${platform.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
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
                {Object.entries(dealsByStageAndPlatformAndContact[stage.id]).map(([platformKey, contactGroups]) => {
                  // Get platform info from first deal
                  const firstContactDeals = Object.values(contactGroups)[0];
                  const platformDeal = firstContactDeals?.[0];
                  const platformName = platformDeal?.platform?.name || 'No Platform';
                  
                  // Calculate total for this platform
                  const platformTotal = Object.values(contactGroups).reduce((sum, deals) => {
                    return sum + deals.reduce((dealSum, d) => dealSum + (Number(d.value) || 0), 0);
                  }, 0);
                  
                  return (
                    <div key={platformKey} className="bg-white/70 rounded-lg p-2 space-y-2">
                      {/* Platform Header */}
                      <div className="flex justify-between items-center px-1 pb-1 border-b border-gray-200">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                          <Layers size={12} className="text-[#FF4F00]" />
                          <span className="truncate">{platformName}</span>
                        </div>
                        <div className="text-xs font-bold text-[#FF4F00]">
                          ${platformTotal.toLocaleString()}
                        </div>
                      </div>
                      
                      {/* Contact groups within platform */}
                      {Object.entries(contactGroups).map(([contactKey, opportunityDeals]) => {
                        const firstDeal = opportunityDeals[0];
                        const totalValue = opportunityDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
                        const contactName = firstDeal.contact 
                          ? `${firstDeal.contact.first_name} ${firstDeal.contact.last_name}`
                          : 'No Contact';
                        
                        return (
                          <div key={contactKey} className="bg-white/80 rounded-lg p-2 space-y-1.5">
                            {/* Opportunity Header */}
                            <div className="flex justify-between items-center mb-1 px-1">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                                <User size={11} className="text-gray-400" />
                                <span className="truncate">{contactName}</span>
                              </div>
                              <div className="text-xs font-bold text-[#FF4F00]">
                                ${totalValue.toLocaleString()}
                              </div>
                            </div>
                            
                            {/* Deals in this opportunity */}
                            {opportunityDeals.map(deal => {
                              const nextStage = getNextStage(deal.stage);
                              const nextStageLabel = nextStage ? STAGES.find(s => s.id === nextStage)?.label : null;
                              
                              return (
                                <div
                                  key={deal.id}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, deal.id)}
                                  className="bg-white p-2 rounded border border-gray-100 cursor-move hover:shadow-sm transition-shadow group relative"
                                >
                                  <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium text-gray-900 text-xs line-clamp-1">{deal.title}</h4>
                                    </div>
                                    <div className="relative flex-shrink-0" ref={openMenuDealId === deal.id ? menuRef : null}>
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setOpenMenuDealId(openMenuDealId === deal.id ? null : deal.id);
                                        }}
                                        className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-gray-100 rounded"
                                      >
                                        <MoreHorizontal size={18} className="text-gray-400 opacity-40" />
                                      </button>
                                      
                                      {/* Dropdown Menu */}
                                      {openMenuDealId === deal.id && (
                                        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-48 z-50">
                                          {nextStageLabel && (
                                            <button
                                              onClick={() => handleMoveToNextStage(deal.id, deal.stage)}
                                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                            >
                                              <ChevronRight size={14} className="text-[#FF4F00]" />
                                              Move to {nextStageLabel}
                                            </button>
                                          )}
                                          <div className="border-t border-gray-100 my-1"></div>
                                          <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase">
                                            Move to Stage
                                          </div>
                                          {STAGES.filter(s => s.id !== 'closed-lost' && s.id !== 'closed-won').map(s => (
                                            <button
                                              key={s.id}
                                              onClick={async () => {
                                                if (s.id !== deal.stage) {
                                                  await updateDealStage(deal.id, s.id);
                                                  setOpenMenuDealId(null);
                                                }
                                              }}
                                              disabled={s.id === deal.stage}
                                              className={`w-full px-4 py-2 text-left text-sm ${
                                                s.id === deal.stage 
                                                  ? 'text-gray-400 bg-gray-50 cursor-not-allowed' 
                                                  : 'text-gray-700 hover:bg-gray-50'
                                              }`}
                                            >
                                              {s.label} {s.id === deal.stage && '(current)'}
                                            </button>
                                          ))}
                                          <div className="border-t border-gray-100 my-1"></div>
                                          <button
                                            onClick={async () => {
                                              await updateDealStage(deal.id, 'closed-won');
                                              setOpenMenuDealId(null);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50"
                                          >
                                            Mark as Won
                                          </button>
                                          <button
                                            onClick={async () => {
                                              await updateDealStage(deal.id, 'closed-lost');
                                              setOpenMenuDealId(null);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                          >
                                            Mark as Lost
                                          </button>
                                          <div className="border-t border-gray-100 my-1"></div>
                                          <button
                                            onClick={async () => {
                                              await deleteDeal(deal.id);
                                              setOpenMenuDealId(null);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                          >
                                            Delete Deal
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-1 text-[#FF4F00] font-bold text-xs mt-1">
                                    <DollarSign size={12} />
                                    {Number(deal.value).toLocaleString()}
                                  </div>

                                  <div className="mt-1.5 flex justify-between items-center text-[10px] text-gray-400">
                                    <span>{deal.probability}% Prob.</span>
                                    {deal.expected_close_date && (
                                      <span>{format(new Date(deal.expected_close_date), 'MMM d')}</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
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
                <label className="block text-xs font-bold text-gray-500 mb-1">Owner (Staff)</label>
                <select 
                  value={newDeal.owner_id || ''}
                  onChange={e => setNewDeal({...newDeal, owner_id: e.target.value})}
                  className="w-full p-2 border border-gray-200 rounded-lg"
                >
                  <option value="">Select Owner...</option>
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
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
                  {isSaving ? 'Creating...' : 'Create Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}