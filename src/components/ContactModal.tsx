import React, { useState } from 'react';
import { X, MessageCircle, Phone, Mail, MapPin, Send } from 'lucide-react';
import { Product } from '../types/Product';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct?: Product | null;
}

export function ContactModal({ isOpen, onClose, selectedProduct }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  // Business contact information
  const businessInfo = {
    whatsappNumber: '+918816831181',
    phoneNumber: '8816831181',
    businessName: 'Shri Hari Collection',
    email: 'giteshsorout@gmail.com',
    address: 'Shekh Pura, Kithwari Chowk, Pawal, Haryana, India'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let whatsappMessage = `Hello! I'm interested in your products.\n\n`;
    whatsappMessage += `Name: ${formData.name}\n`;
    whatsappMessage += `Phone: ${formData.phone}\n`;
    whatsappMessage += `Email: ${formData.email}\n`;
    
    if (selectedProduct) {
      whatsappMessage += `\nProduct: ${selectedProduct.name}\n`;
      whatsappMessage += `Price: ₹${selectedProduct.price}\n`;
    }
    
    whatsappMessage += `\nMessage: ${formData.message}`;
    
    const whatsappUrl = `https://wa.me/${businessInfo.whatsappNumber.replace('+', '')}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    setFormData({ name: '', phone: '', email: '', message: '' });
    onClose();
  };

  const handleDirectWhatsApp = () => {
    let message = `Hello! I'm interested in your collection.`;
    if (selectedProduct) {
      message += ` Specifically, I'd like to know more about "${selectedProduct.name}" (₹${selectedProduct.price}).`;
    }
    
    const whatsappUrl = `https://wa.me/${businessInfo.whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="netflix-card-gradient rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Contact Us</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {selectedProduct && (
            <div className="mb-6 p-4 bg-red-900 bg-opacity-20 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-400 mb-2">Inquiring about:</h3>
              <div className="flex items-center space-x-3">
                <img
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <p className="font-medium text-white">{selectedProduct.name}</p>
                  <p className="text-red-400 font-semibold">₹{selectedProduct.price}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Contact Form */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Send us a message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white"
                    placeholder="Tell us about your requirements..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors netflix-glow"
                >
                  <Send size={16} />
                  <span>Send WhatsApp Message</span>
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Get in touch</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MessageCircle className="text-green-500 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-white">WhatsApp</p>
                    <p className="text-gray-400">{businessInfo.whatsappNumber}</p>
                    <button
                      onClick={handleDirectWhatsApp}
                      className="text-green-500 hover:text-green-400 text-sm font-medium"
                    >
                      Chat with us →
                    </button>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="text-blue-500 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-white">Phone</p>
                    <p className="text-gray-400">{businessInfo.phoneNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail className="text-red-500 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-white">Email</p>
                    <p className="text-gray-400">{businessInfo.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="text-purple-500 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-white">Address</p>
                    <p className="text-gray-400">{businessInfo.address}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-900 bg-opacity-20 rounded-lg border border-green-700">
                <h4 className="font-semibold text-green-400 mb-2">Quick Contact</h4>
                <p className="text-green-300 text-sm mb-3">
                  For immediate assistance, click below to start a WhatsApp conversation
                </p>
                <button
                  onClick={handleDirectWhatsApp}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors netflix-glow"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}