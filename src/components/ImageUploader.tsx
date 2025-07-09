import React, { useState, useRef } from 'react';
import { Upload, X, Image, AlertCircle, CheckCircle, FileImage } from 'lucide-react';
import { uploadImage, ImageUploadResult } from '../utils/imageUpload';

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  onError?: (error: string) => void;
  className?: string;
  multiple?: boolean;
}

export function ImageUploader({ onImageUploaded, onError, className = '', multiple = false }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadStatus('idle');

    try {
      const file = files[0]; // Handle single file for now
      const result: ImageUploadResult = await uploadImage(file);

      if (result.success && result.imageUrl) {
        setUploadStatus('success');
        setStatusMessage(`Image uploaded successfully! (${file.name})`);
        onImageUploaded(result.imageUrl);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setUploadStatus('idle');
          setStatusMessage('');
        }, 3000);
      } else {
        setUploadStatus('error');
        setStatusMessage(result.error || 'Upload failed');
        if (onError) {
          onError(result.error || 'Upload failed');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setUploadStatus('error');
      setStatusMessage(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 cursor-pointer ${
          dragActive
            ? 'border-red-500 bg-red-900 bg-opacity-10'
            : isUploading
            ? 'border-yellow-500 bg-yellow-900 bg-opacity-10'
            : uploadStatus === 'success'
            ? 'border-green-500 bg-green-900 bg-opacity-10'
            : uploadStatus === 'error'
            ? 'border-red-500 bg-red-900 bg-opacity-10'
            : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800 hover:bg-opacity-20'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.gif"
          onChange={handleInputChange}
          multiple={multiple}
          className="hidden"
        />

        {isUploading ? (
          <div className="space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="text-yellow-400 font-medium">Uploading image...</p>
          </div>
        ) : uploadStatus === 'success' ? (
          <div className="space-y-3">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <p className="text-green-400 font-medium">Upload successful!</p>
          </div>
        ) : uploadStatus === 'error' ? (
          <div className="space-y-3">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <p className="text-red-400 font-medium">Upload failed</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-center">
              <div className="p-3 bg-gray-800 rounded-full">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <div>
              <p className="text-white font-medium mb-1">
                {dragActive ? 'Drop image here' : 'Upload Product Image'}
              </p>
              <p className="text-gray-400 text-sm">
                Drag & drop or click to select
              </p>
            </div>
          </div>
        )}
      </div>

      {/* File Requirements */}
      <div className="bg-blue-900 bg-opacity-20 rounded-lg p-4 border border-blue-700">
        <div className="flex items-start space-x-3">
          <FileImage className="text-blue-400 mt-0.5" size={16} />
          <div className="text-sm text-blue-300">
            <p className="font-semibold mb-2">Image Requirements:</p>
            <ul className="space-y-1 text-xs">
              <li>• Formats: JPG, JPEG, PNG, GIF</li>
              <li>• Max size: 5MB</li>
              <li>• Dimensions: 200x200px to 2000x2000px</li>
              <li>• High quality images recommended</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div className={`p-3 rounded-lg border animate-fadeIn ${
          uploadStatus === 'success'
            ? 'bg-green-900 bg-opacity-20 border-green-700 text-green-300'
            : 'bg-red-900 bg-opacity-20 border-red-700 text-red-300'
        }`}>
          <div className="flex items-center space-x-2">
            {uploadStatus === 'success' ? (
              <CheckCircle size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span className="text-sm">{statusMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}