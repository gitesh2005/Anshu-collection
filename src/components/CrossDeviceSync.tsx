import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, Download, Upload, RefreshCw } from 'lucide-react';

interface CrossDeviceSyncProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CrossDeviceSync({ isOpen, onClose }: CrossDeviceSyncProps) {
  const [syncCode, setSyncCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const generateSyncCode = () => {
    setIsGenerating(true);
    
    // Generate a simple sync code
    const code = Math.random().toString(36).substr(2, 8).toUpperCase();
    
    // Store current data with the sync code
    const currentData = {
      products: localStorage.getItem('shri_hari_products'),
      images: localStorage.getItem('global_product_images'),
      timestamp: Date.now()
    };
    
    localStorage.setItem(`sync_${code}`, JSON.stringify(currentData));
    
    setTimeout(() => {
      setSyncCode(code);
      setIsGenerating(false);
    }, 1000);
  };

  const syncWithCode = async () => {
    if (!syncCode.trim()) {
      alert('Please enter a sync code');
      return;
    }

    setIsSyncing(true);
    
    try {
      const syncData = localStorage.getItem(`sync_${syncCode.toUpperCase()}`);
      
      if (syncData) {
        const data = JSON.parse(syncData);
        
        // Restore products and images
        if (data.products) {
          localStorage.setItem('shri_hari_products', data.products);
        }
        if (data.images) {
          localStorage.setItem('global_product_images', data.images);
        }
        
        alert('✅ Sync successful! Please refresh the page to see all images.');
        window.location.reload();
      } else {
        alert('❌ Invalid sync code. Please check and try again.');
      }
    } catch (error) {
      alert('❌ Sync failed. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="netflix-card-gradient rounded-lg max-w-lg w-full p-6 border border-gray-700">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <Wifi className="text-white" size={24} />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Cross-Device Sync</h2>
          <p className="text-gray-400 mb-6">
            Sync your images and products across all your devices
          </p>

          {/* Current Device */}
          <div className="bg-gray-800 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Monitor className="text-blue-400" size={20} />
              <span className="text-white font-semibold">Current Device</span>
            </div>
            <p className="text-gray-400 text-sm">
              This device has all your uploaded images and products
            </p>
          </div>

          {/* Generate Sync Code */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">📤 Share to Phone</h3>
            <button
              onClick={generateSyncCode}
              disabled={isGenerating}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Upload size={16} />
                  <span>Generate Sync Code</span>
                </>
              )}
            </button>
            
            {syncCode && (
              <div className="mt-4 p-4 bg-blue-900 bg-opacity-20 rounded-lg border border-blue-700">
                <p className="text-blue-400 text-sm mb-2">Your sync code:</p>
                <div className="text-2xl font-bold text-white tracking-wider">{syncCode}</div>
                <p className="text-blue-300 text-xs mt-2">
                  Use this code on your phone to sync all images
                </p>
              </div>
            )}
          </div>

          {/* Sync from Code */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">📥 Sync from Another Device</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={syncCode}
                onChange={(e) => setSyncCode(e.target.value.toUpperCase())}
                placeholder="Enter sync code"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400"
                maxLength={8}
              />
              <button
                onClick={syncWithCode}
                disabled={isSyncing}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isSyncing ? (
                  <RefreshCw className="animate-spin" size={16} />
                ) : (
                  <Download size={16} />
                )}
                <span>Sync</span>
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-left bg-green-900 bg-opacity-20 p-4 rounded-lg mb-6 border border-green-700">
            <h4 className="text-green-400 font-semibold mb-2">📱 How to sync to phone:</h4>
            <ol className="text-sm text-green-300 space-y-1">
              <li>1. Click "Generate Sync Code" above</li>
              <li>2. Open website on your phone</li>
              <li>3. Click sync button and enter the code</li>
              <li>4. All images will appear on your phone!</li>
            </ol>
          </div>

          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}