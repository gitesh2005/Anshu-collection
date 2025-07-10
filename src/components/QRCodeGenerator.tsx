import React, { useState } from 'react';
import { QrCode, Copy, Check, Smartphone } from 'lucide-react';

interface QRCodeGeneratorProps {
  websiteUrl: string;
  onClose: () => void;
}

export function QRCodeGenerator({ websiteUrl, onClose }: QRCodeGeneratorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(websiteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  // Generate QR code URL using a free service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(websiteUrl)}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="netflix-card-gradient rounded-lg max-w-md w-full p-6 border border-gray-700">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Smartphone className="text-white" size={24} />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Access on Phone</h2>
          <p className="text-gray-400 mb-6">
            Scan this QR code with your phone to access the website with all images
          </p>

          {/* QR Code */}
          <div className="bg-white p-4 rounded-lg mb-6 inline-block">
            <img 
              src={qrCodeUrl} 
              alt="QR Code" 
              className="w-48 h-48 mx-auto"
            />
          </div>

          {/* URL */}
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-2">Or copy this URL:</p>
            <div className="flex items-center space-x-2 bg-gray-800 p-3 rounded-lg">
              <input
                type="text"
                value={websiteUrl}
                readOnly
                className="flex-1 bg-transparent text-white text-sm"
              />
              <button
                onClick={handleCopyUrl}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-left bg-blue-900 bg-opacity-20 p-4 rounded-lg mb-6 border border-blue-700">
            <h4 className="text-blue-400 font-semibold mb-2">📱 How to access on phone:</h4>
            <ol className="text-sm text-blue-300 space-y-1">
              <li>1. Open camera app on your phone</li>
              <li>2. Point camera at the QR code above</li>
              <li>3. Tap the notification to open website</li>
              <li>4. All images will be visible on your phone!</li>
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