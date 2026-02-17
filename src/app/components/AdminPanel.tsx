import { useState } from 'react';
import { uploadImage, IMAGE_KEYS, ImageKey } from '../../lib/supabase';
import { X, Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onImagesUpdated: () => void;
}

const ADMIN_PASSWORD = 'Wexlot@1234';

export function AdminPanel({ isOpen, onClose, onImagesUpdated }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleFileUpload = async (imageKey: ImageKey, file: File) => {
    setUploadStatus(prev => ({ ...prev, [imageKey]: 'uploading' }));
    
    const url = await uploadImage(file, imageKey);
    
    if (url) {
      setUploadStatus(prev => ({ ...prev, [imageKey]: 'success' }));
      // Immediately update the images
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
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF4F00] to-[#FF6B35] text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold font-[Lexend]">Admin Panel - Image Management</h2>
          <button
            onClick={onClose}
            className="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto mt-8">
              <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                <h3 className="text-xl font-bold font-[Lexend] text-[#333] mb-4 text-center">
                  Admin Authentication
                </h3>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-[Lexend] text-[#666] mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4F00] font-[Mallanna]"
                      placeholder="Enter admin password"
                    />
                  </div>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-[Mallanna]">{error}</span>
                    </div>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-[#FF4F00] hover:bg-[#E04500] text-white py-2 px-4 rounded-lg font-[Lexend] font-semibold transition-colors"
                  >
                    Login
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
                <p className="text-sm font-[Mallanna]">
                  <strong>Note:</strong> Upload images to replace the current placeholders. Recommended formats: PNG, JPG, SVG. 
                  Keep file sizes under 2MB for optimal performance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(Object.keys(IMAGE_KEYS) as ImageKey[]).map((imageKey) => {
                  const status = uploadStatus[imageKey] || 'idle';
                  
                  return (
                    <div
                      key={imageKey}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:border-[#FF4F00] transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold font-[Lexend] text-[#333] text-sm">
                            {imageKey.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          <p className="text-xs text-[#999] font-[Mallanna] mt-1">
                            {imageDescriptions[imageKey]}
                          </p>
                        </div>
                        {status === 'success' && (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        )}
                        {status === 'error' && (
                          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                      </div>

                      <label
                        htmlFor={`upload-${imageKey}`}
                        className={`
                          block w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                          transition-all
                          ${status === 'uploading' 
                            ? 'border-[#FF4F00] bg-orange-50' 
                            : 'border-gray-300 hover:border-[#FF4F00] hover:bg-gray-50'
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
                        <Upload className={`w-8 h-8 mx-auto mb-2 ${status === 'uploading' ? 'text-[#FF4F00] animate-pulse' : 'text-gray-400'}`} />
                        <p className="text-sm font-[Mallanna] text-[#666]">
                          {status === 'uploading' ? 'Uploading...' : 'Click to upload'}
                        </p>
                        {status === 'success' && (
                          <p className="text-xs text-green-600 font-[Mallanna] mt-1">
                            Upload successful!
                          </p>
                        )}
                        {status === 'error' && (
                          <p className="text-xs text-red-600 font-[Mallanna] mt-1">
                            Upload failed. Try again.
                          </p>
                        )}
                      </label>
                    </div>
                  );
                })}
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
                <h4 className="font-bold font-[Lexend] text-[#333] text-sm mb-2">
                  Storage Information
                </h4>
                <p className="text-xs text-[#666] font-[Mallanna]">
                  Images are stored in Supabase Storage bucket: <code className="bg-white px-2 py-1 rounded">images/platform-images/</code>
                </p>
                <p className="text-xs text-[#666] font-[Mallanna] mt-2">
                  After uploading, refresh the page to see your new images on the platform.
                </p>
              </div>
            </div>
          )}
        </div>

        {isAuthenticated && (
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-lg font-[Lexend] font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}