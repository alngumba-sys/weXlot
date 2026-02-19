import { useState } from 'react';
import { uploadImage, IMAGE_KEYS, ImageKey } from '../../lib/supabase';
import { X, Upload, CheckCircle, AlertCircle, LayoutDashboard, Trello, Users, Calendar, Settings, Image as ImageIcon, LogOut } from 'lucide-react';
import { CRMProvider } from '../context/CRMContext';
import { CRMDashboard } from './crm/CRMDashboard';
import { CRMPipeline } from './crm/CRMPipeline';
import { CRMContacts } from './crm/CRMContacts';
import { CRMActivities } from './crm/CRMActivities';
import { CRMSettings } from './crm/CRMSettings';
import { QuickAddLead } from './crm/QuickAddLead';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onImagesUpdated: () => void;
}

const ADMIN_CREDENTIALS = {
  username: 'Admin',
  password: 'Wexlot@2026'
};

export function AdminPanel({ isOpen, onClose, onImagesUpdated }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pipeline' | 'contacts' | 'activities' | 'cms' | 'settings'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Image Upload State
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'idle' | 'uploading' | 'success' | 'error'>>({});

  const imageDescriptions: Record<ImageKey, string> = {
    logo: 'WeXlot Logo (67x67px recommended)',
    workspaceImage: 'Workspace Dashboard Image',
    scissorUpLogo: 'ScissorUp Platform Logo (199x79px)',
    smartLenderUpLogo: 'SmartLenderUp Platform Logo (161x79px)',
    tillsUpLogo: 'TillsUp Platform Logo (128x79px)',
    pillsUpLogo: 'PillsUp Platform Logo (161x79px)',
    philosophyImage: 'Philosophy Section Image (320px wide)',
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  const handleFileUpload = async (imageKey: ImageKey, file: File) => {
    setUploadStatus(prev => ({ ...prev, [imageKey]: 'uploading' }));
    
    const url = await uploadImage(file, imageKey);
    
    if (url) {
      setUploadStatus(prev => ({ ...prev, [imageKey]: 'success' }));
      onImagesUpdated();
      setTimeout(() => {
        setUploadStatus(prev => ({ ...prev, [imageKey]: 'idle' }));
      }, 3000);
    } else {
      setUploadStatus(prev => ({ ...prev, [imageKey]: 'error' }));
      setTimeout(() => {
        setUploadStatus(prev => ({ ...prev, [imageKey]: 'idle' }));
      }, 3000);
    }
  };

  const handleFileChange = (imageKey: ImageKey, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(imageKey, file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
      <CRMProvider>
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] overflow-hidden flex flex-col md:flex-row relative">
          
          {!isAuthenticated ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 p-8 relative">
              <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 px-[32px] py-[14px]">
                <div className="text-center mb-8">
                  <h2 className="font-[Lexend] text-[#FF4F00] text-[16px]">WeXlot Admin</h2>
                  <p className="text-gray-500 mt-2 font-[Mallanna]">Secure CRM Access</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block font-bold text-gray-700 mb-2 text-[13px]">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] transition-all px-[16px] py-[7px]"
                      placeholder="Enter username"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-2 text-[13px]">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] transition-all px-[16px] py-[7px]"
                      placeholder="Enter password"
                    />
                  </div>
                  
                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    className="w-full bg-[#FF4F00] hover:bg-[#E04500] text-white rounded-lg font-[Lexend] transition-colors shadow-md hover:shadow-lg px-[0px] py-[7px] text-[14px]"
                  >
                    Login to Dashboard
                  </button>
                </form>
                
                <button 
                  onClick={onClose}
                  className="w-full mt-4 text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
                >
                  Cancel and return to site
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Mobile Header */}
              <div className="md:hidden bg-gray-900 text-white p-4 flex justify-between items-center">
                <span className="font-bold text-lg font-[Lexend]">WeXlot CRM</span>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  {isMobileMenuOpen ? <X size={24} /> : <div className="space-y-1.5"><div className="w-6 h-0.5 bg-white"></div><div className="w-6 h-0.5 bg-white"></div><div className="w-6 h-0.5 bg-white"></div></div>}
                </button>
              </div>

              {/* Sidebar Navigation */}
              <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex w-full md:w-64 bg-gray-900 text-white flex-col h-full flex-shrink-0 absolute md:relative z-50 md:z-0`}>
                <div className="p-6 border-b border-gray-800 flex items-center gap-3 hidden md:flex">
                  <div className="w-8 h-8 bg-[#FF4F00] rounded-lg flex items-center justify-center font-bold text-white">W</div>
                  <span className="font-[Lexend] text-[16px]">WeXlot CRM</span>
                </div>
                
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  <button 
                    onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-[#FF4F00] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                  >
                    <LayoutDashboard size={20} />
                    <span className="font-medium text-[15px]">Dashboard</span>
                  </button>
                  
                  <button 
                    onClick={() => { setActiveTab('pipeline'); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'pipeline' ? 'bg-[#FF4F00] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                  >
                    <Trello size={20} />
                    <span className="font-medium text-[15px]">Pipeline</span>
                  </button>
                  
                  <button 
                    onClick={() => { setActiveTab('contacts'); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'contacts' ? 'bg-[#FF4F00] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                  >
                    <Users size={20} />
                    <span className="font-medium text-[15px]">Contacts</span>
                  </button>
                  
                  <button 
                    onClick={() => { setActiveTab('activities'); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'activities' ? 'bg-[#FF4F00] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                  >
                    <Calendar size={20} />
                    <span className="font-medium text-[15px]">Activities</span>
                  </button>

                  <div className="pt-4 mt-4 border-t border-gray-800">
                    <p className="px-4 text-xs font-bold text-gray-500 uppercase mb-2">System</p>
                    
                    <button 
                      onClick={() => { setActiveTab('cms'); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'cms' ? 'bg-[#FF4F00] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                      <ImageIcon size={20} />
                      <span className="font-medium text-[15px] text-[#3b424e]">Website Images</span>
                    </button>
                    
                    <button 
                      onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-[#FF4F00] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                      <Settings size={20} />
                      <span className="font-medium text-[15px]">Settings</span>
                    </button>
                  </div>
                </nav>
                
                <div className="p-4 border-t border-gray-800">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 overflow-hidden relative bg-gray-50">
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 z-50 p-2 bg-white rounded-full shadow-md text-gray-500 hover:text-red-500 transition-colors"
                >
                  <X size={24} />
                </button>

                {activeTab === 'dashboard' && <CRMDashboard />}
                {activeTab === 'pipeline' && <CRMPipeline />}
                {activeTab === 'contacts' && <CRMContacts />}
                {activeTab === 'activities' && <CRMActivities />}
                {activeTab === 'settings' && <CRMSettings />}
                
                {activeTab === 'cms' && (
                  <div className="h-full overflow-y-auto p-8">
                    <h2 className="text-2xl font-bold font-[Lexend] text-gray-800 mb-6">Website Image Management</h2>
                    
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6">
                      <p className="text-sm font-[Mallanna]">
                        <strong>Note:</strong> Upload images to replace the current placeholders. Recommended formats: PNG, JPG, SVG. 
                        Keep file sizes under 2MB for optimal performance.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {(Object.keys(IMAGE_KEYS) as ImageKey[]).map((imageKey) => {
                        const status = uploadStatus[imageKey] || 'idle';
                        
                        return (
                          <div
                            key={imageKey}
                            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="font-bold font-[Lexend] text-gray-800">
                                  {imageKey.replace(/([A-Z])/g, ' $1').trim()}
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">
                                  {imageDescriptions[imageKey]}
                                </p>
                              </div>
                              {status === 'success' && <CheckCircle className="w-6 h-6 text-green-500" />}
                              {status === 'error' && <AlertCircle className="w-6 h-6 text-red-500" />}
                            </div>

                            <label
                              htmlFor={`upload-${imageKey}`}
                              className={`
                                block w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                                transition-all
                                ${status === 'uploading' 
                                  ? 'border-[#FF4F00] bg-orange-50' 
                                  : 'border-gray-200 hover:border-[#FF4F00] hover:bg-gray-50'
                                }
                              `}
                            >
                              <input
                                type="file"
                                id={`upload-${imageKey}`}
                                accept="image/*"
                                onChange={(e) => handleFileChange(imageKey, e)}
                                className="hidden"
                                disabled={status === 'uploading'}
                              />
                              <Upload className={`w-8 h-8 mx-auto mb-3 ${status === 'uploading' ? 'text-[#FF4F00] animate-pulse' : 'text-gray-400'}`} />
                              <p className="text-sm font-medium text-gray-700">
                                {status === 'uploading' ? 'Uploading...' : 'Click to upload image'}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG up to 2MB</p>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Quick Add Button - Always Visible in Admin Panel */}
          <QuickAddLead />
        </div>
      </CRMProvider>
    </div>
  );
}