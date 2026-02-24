import { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Plus, X, User, Phone, MapPin, FileText, Zap, Layers } from 'lucide-react';
import { toast } from 'sonner';

export function QuickAddLead() {
  // Safely handle context - return null if not available (during hot reload)
  let crmContext;
  try {
    crmContext = useCRM();
  } catch {
    return null;
  }
  
  const { addContact, addDeal, staff, platforms } = crmContext;
  const [isOpen, setIsOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    clientName: '',
    clientPhone: '',
    clientLocation: '',
    platformId: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Resolve Staff Member
      const staffMember = staff.find(s => {
        const full = s.name.toLowerCase();
        const first = s.name.split(' ')[0].toLowerCase();
        const input = formData.username.toLowerCase();
        return full === input || first === input;
      });

      // 2. Split Name
      const nameParts = formData.clientName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '-'; // Default last name if missing

      // 3. Construct Notes
      const notes = `Location: ${formData.clientLocation}\n\nNotes: ${formData.notes}`;

      // 4. Create Contact
      const contactResult = await addContact({
        first_name: firstName,
        last_name: lastName,
        phone: formData.clientPhone,
        notes: notes,
        owner_id: staffMember?.id, // Optional: if staff not found, owner is null
        email: '', // Not provided in quick form
        job_title: '',
        main_need: '',
        budget_range: '',
        decision_authority: ''
      });

      if (contactResult) {
        // 5. Create Deal if Platform Selected
        if (formData.platformId) {
          await addDeal({
            title: `${firstName} ${lastName} - New Deal`,
            value: 0,
            stage: 'lead',
            probability: 10,
            contact_id: contactResult.id,
            platform_id: formData.platformId,
            owner_id: staffMember?.id
          });
        }

        toast.success(`Lead "${formData.clientName}" added successfully!`);
        setFormData({
          username: '',
          clientName: '',
          clientPhone: '',
          clientLocation: '',
          platformId: '',
          notes: ''
        });
        setIsOpen(false);
      } else {
        toast.error('Failed to add lead. Please try again.');
      }
    } catch (error) {
      console.error('Quick add error:', error);
      toast.error('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="absolute bottom-8 right-8 z-[60] bg-[#FF4F00] hover:bg-[#e04500] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center group"
        title="Quick Add Lead"
      >
        <Zap size={24} className="group-hover:rotate-12 transition-transform" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Header */}
            <div className="bg-[#FF4F00] px-6 py-4 flex justify-between items-center text-white">
              <div>
                <h3 className="font-bold text-lg font-[Lexend]">Quick Access</h3>
                <p className="text-orange-100 text-xs">Add a new lead instantly</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    list="staff-list"
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#FF4F00] focus:border-transparent outline-none transition-all"
                    placeholder="Enter your username"
                  />
                  <datalist id="staff-list">
                    {staff.map(s => (
                      <option key={s.id} value={s.name.split(' ')[0]} label={s.name} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Client Details</label>
                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.clientName}
                      onChange={e => setFormData({...formData, clientName: e.target.value})}
                      className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#FF4F00] focus:border-transparent outline-none transition-all"
                      placeholder="Client Name"
                    />
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Phone size={16} />
                    </div>
                    <input
                      type="tel"
                      value={formData.clientPhone}
                      onChange={e => setFormData({...formData, clientPhone: e.target.value})}
                      className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#FF4F00] focus:border-transparent outline-none transition-all"
                      placeholder="Phone Number"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <MapPin size={16} />
                    </div>
                    <input
                      type="text"
                      value={formData.clientLocation}
                      onChange={e => setFormData({...formData, clientLocation: e.target.value})}
                      className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#FF4F00] focus:border-transparent outline-none transition-all"
                      placeholder="Location (e.g. Westlands)"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Layers size={16} />
                    </div>
                    <select
                      value={formData.platformId}
                      onChange={e => setFormData({...formData, platformId: e.target.value})}
                      className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#FF4F00] focus:border-transparent outline-none transition-all appearance-none text-gray-600"
                    >
                      <option value="">Select Platform...</option>
                      {platforms.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Initial Notes</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none text-gray-400">
                    <FileText size={16} />
                  </div>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#FF4F00] focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Enter any initial details..."
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FF4F00] hover:bg-[#e04500] text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    'Saving...'
                  ) : (
                    <>
                      <Zap size={18} fill="currentColor" />
                      Quick Save Lead
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}