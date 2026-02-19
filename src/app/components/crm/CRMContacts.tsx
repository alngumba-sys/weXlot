import { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Search, Plus, Filter, MoreHorizontal, Phone, Mail, MapPin, Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { Contact, Interaction } from '../../../types/crm';

export function CRMContacts() {
  const { contacts, addContact, interactions, addInteraction, loading } = useCRM();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [newContact, setNewContact] = useState<Partial<Contact>>({});

  const filteredContacts = contacts.filter(c => 
    c.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.first_name || !newContact.last_name) return;

    await addContact({
      first_name: newContact.first_name,
      last_name: newContact.last_name,
      email: newContact.email,
      phone: newContact.phone,
      job_title: newContact.job_title,
      main_need: newContact.main_need,
      budget_range: newContact.budget_range,
      decision_authority: newContact.decision_authority,
      notes: newContact.notes
    });
    setIsAddModalOpen(false);
    setNewContact({});
  };

  return (
    <div className="flex h-full bg-white">
      {/* Contact List */}
      <div className={`${selectedContact ? 'hidden md:flex md:w-1/3' : 'w-full'} flex-col border-r border-gray-200`}>
        <div className="p-4 border-b border-gray-200 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold font-[Lexend]">Contacts</h2>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="p-2 bg-[#FF4F00] text-white rounded-lg hover:bg-[#e04500] transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search contacts..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map(contact => (
            <div 
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-orange-50 transition-colors ${selectedContact?.id === contact.id ? 'bg-orange-50 border-l-4 border-l-[#FF4F00]' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{contact.first_name} {contact.last_name}</h3>
                  <p className="text-sm text-gray-500">{contact.job_title} at {contact.company?.name || 'No Company'}</p>
                </div>
                {contact.main_need && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{contact.main_need}</span>
                )}
              </div>
            </div>
          ))}
          {filteredContacts.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No contacts found.
            </div>
          )}
        </div>
      </div>

      {/* Contact Details */}
      {selectedContact ? (
        <div className="flex-1 flex flex-col h-full bg-gray-50 overflow-hidden">
          <div className="p-6 bg-white border-b border-gray-200 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedContact(null)}
                className="md:hidden text-gray-500 hover:text-gray-900"
              >
                ← Back
              </button>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-[#FF4F00] font-bold text-xl">
                {selectedContact.first_name[0]}{selectedContact.last_name[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedContact.first_name} {selectedContact.last_name}</h2>
                <p className="text-gray-500 flex items-center gap-2">
                  {selectedContact.job_title} • {selectedContact.company?.name}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-gray-400 hover:text-[#FF4F00] hover:bg-orange-50 rounded-lg transition-colors">
                <MoreHorizontal />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
                <h3 className="font-semibold text-gray-900 mb-2 border-b pb-2">Contact Info</h3>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail size={16} className="text-gray-400" />
                  <a href={`mailto:${selectedContact.email}`} className="hover:text-[#FF4F00]">{selectedContact.email || 'N/A'}</a>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone size={16} className="text-gray-400" />
                  <a href={`tel:${selectedContact.phone}`} className="hover:text-[#FF4F00]">{selectedContact.phone || 'N/A'}</a>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
                <h3 className="font-semibold text-gray-900 mb-2 border-b pb-2">Sales Intel</h3>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Pain Point</p>
                  <p className="text-sm text-gray-700">{selectedContact.main_need || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Budget</p>
                  <p className="text-sm text-gray-700">{selectedContact.budget_range || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Authority</p>
                  <p className="text-sm text-gray-700">{selectedContact.decision_authority || 'Unknown'}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
                <h3 className="font-semibold text-gray-900 mb-2 border-b pb-2">Notes</h3>
                <p className="text-sm text-gray-600 italic">
                  "{selectedContact.notes || 'No notes added yet.'}"
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold font-[Lexend] mb-4">Activity Timeline</h3>
              <div className="space-y-6 relative pl-4 border-l-2 border-gray-100">
                {interactions.filter(i => i.contact_id === selectedContact.id).map(interaction => (
                  <div key={interaction.id} className="relative">
                    <div className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 border-white ${
                      interaction.type === 'call' ? 'bg-green-500' :
                      interaction.type === 'email' ? 'bg-blue-500' :
                      interaction.type === 'meeting' ? 'bg-purple-500' : 'bg-gray-400'
                    }`} />
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-gray-800 capitalize">{interaction.type}</span>
                      <span className="text-xs text-gray-400">{format(new Date(interaction.date), 'MMM d, yyyy h:mm a')}</span>
                    </div>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {interaction.notes}
                    </p>
                  </div>
                ))}
                
                {/* Add Interaction */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Log Interaction</h4>
                  <div className="flex gap-2 mb-2">
                    {['call', 'email', 'meeting', 'note'].map(type => (
                      <button 
                        key={type}
                        className="px-3 py-1 text-xs rounded-full border border-gray-200 hover:border-[#FF4F00] hover:text-[#FF4F00] transition-colors"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <textarea 
                    className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF4F00]"
                    placeholder="Log a call, email, or meeting note..."
                    rows={2}
                  />
                  <button className="mt-2 px-4 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-black transition-colors">
                    Log Activity
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50 text-gray-400 flex-col gap-4">
          <User size={48} className="opacity-20" />
          <p>Select a contact to view details</p>
        </div>
      )}

      {/* Add Contact Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Add New Contact</h3>
              <button onClick={() => setIsAddModalOpen(false)}><span className="text-2xl">&times;</span></button>
            </div>
            <form onSubmit={handleAddContact} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">First Name</label>
                  <input 
                    required
                    value={newContact.first_name || ''}
                    onChange={e => setNewContact({...newContact, first_name: e.target.value})}
                    className="w-full p-2 border border-gray-200 rounded-lg" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Last Name</label>
                  <input 
                    required
                    value={newContact.last_name || ''}
                    onChange={e => setNewContact({...newContact, last_name: e.target.value})}
                    className="w-full p-2 border border-gray-200 rounded-lg" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Email</label>
                <input 
                  type="email"
                  value={newContact.email || ''}
                  onChange={e => setNewContact({...newContact, email: e.target.value})}
                  className="w-full p-2 border border-gray-200 rounded-lg" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Phone</label>
                <input 
                  type="tel"
                  value={newContact.phone || ''}
                  onChange={e => setNewContact({...newContact, phone: e.target.value})}
                  className="w-full p-2 border border-gray-200 rounded-lg" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Company</label>
                <input 
                  value={newContact.company_id || ''} // Should be a dropdown ideally
                  onChange={e => setNewContact({...newContact, company_id: e.target.value})} // Placeholder for ID
                  className="w-full p-2 border border-gray-200 rounded-lg" 
                  placeholder="Company Name (Text for now)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Main Pain Point</label>
                <input 
                  value={newContact.main_need || ''}
                  onChange={e => setNewContact({...newContact, main_need: e.target.value})}
                  className="w-full p-2 border border-gray-200 rounded-lg" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Budget Range</label>
                  <select 
                    value={newContact.budget_range || ''}
                    onChange={e => setNewContact({...newContact, budget_range: e.target.value})}
                    className="w-full p-2 border border-gray-200 rounded-lg"
                  >
                    <option value="">Select...</option>
                    <option value="< $1k">Under $1k</option>
                    <option value="$1k - $5k">$1k - $5k</option>
                    <option value="$5k - $20k">$5k - $20k</option>
                    <option value="$20k+">$20k+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Authority</label>
                  <select 
                    value={newContact.decision_authority || ''}
                    onChange={e => setNewContact({...newContact, decision_authority: e.target.value})}
                    className="w-full p-2 border border-gray-200 rounded-lg"
                  >
                    <option value="">Select...</option>
                    <option value="Decision Maker">Decision Maker</option>
                    <option value="Influencer">Influencer</option>
                    <option value="Gatekeeper">Gatekeeper</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Initial Notes</label>
                <textarea 
                  value={newContact.notes || ''}
                  onChange={e => setNewContact({...newContact, notes: e.target.value})}
                  className="w-full p-2 border border-gray-200 rounded-lg" 
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
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
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
