import { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Search, Plus } from 'lucide-react';
import { Contact } from '../../../types/crm';

export function CRMContacts() {
  // Safely handle context - return null if not available (during hot reload)
  let crmContext;
  try {
    crmContext = useCRM();
  } catch {
    return null;
  }
  
  const { contacts, addContact } = crmContext;
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [newContact, setNewContact] = useState<Partial<Contact>>({});

  const filteredContacts = contacts.filter(c => 
    c.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location?.toLowerCase().includes(searchTerm.toLowerCase())
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
      location: newContact.location,
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
      {/* Contact Table */}
      <div className="w-full flex-col">
        <div className="p-4 border-b border-gray-200 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold font-[Lexend]">Contacts</h2>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-[#FF4F00] text-white rounded-lg hover:bg-[#e04500] transition-colors flex items-center gap-2"
            >
              <Plus size={18} /> Add Contact
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
        
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Business Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Pain Point / Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredContacts.map(contact => (
                <tr 
                  key={contact.id}
                  className="hover:bg-orange-50 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{contact.first_name} {contact.last_name}</div>
                    <div className="text-xs text-gray-500">{contact.budget_range || 'N/A'}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {contact.company?.name || 'No Company'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {contact.phone || 'N/A'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {contact.location || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div className="max-w-xs truncate">
                      {contact.main_need || contact.notes || 'N/A'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredContacts.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No contacts found.
            </div>
          )}
        </div>
      </div>

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
                <label className="block text-xs font-bold text-gray-500 mb-1">Location</label>
                <input 
                  value={newContact.location || ''}
                  onChange={e => setNewContact({...newContact, location: e.target.value})}
                  className="w-full p-2 border border-gray-200 rounded-lg" 
                  placeholder="e.g. Nairobi, Kenya"
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
