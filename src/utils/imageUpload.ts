export interface ImageUploadResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export interface ImageValidationOptions {
  maxSizeBytes: number;
  allowedTypes: string[];
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
}

const DEFAULT_OPTIONS: ImageValidationOptions = {
  maxSizeBytes: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  minWidth: 200,
  minHeight: 200,
  maxWidth: 2000,
  maxHeight: 2000
};

export class ImageUploadService {
  private static instance: ImageUploadService;
  private uploadedImages: Map<string, string> = new Map();

  private constructor() {
    // Load existing images from localStorage
    this.loadStoredImages();
  }

  public static getInstance(): ImageUploadService {
    if (!ImageUploadService.instance) {
      ImageUploadService.instance = new ImageUploadService();
    }
    return ImageUploadService.instance;
  }

  private loadStoredImages(): void {
    try {
      const stored = localStorage.getItem('uploaded_images');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.uploadedImages = new Map(Object.entries(parsed));
      }
    } catch (error) {
      console.error('Error loading stored images:', error);
    }
  }

  private saveStoredImages(): void {
    try {
      const imageObj = Object.fromEntries(this.uploadedImages);
      localStorage.setItem('uploaded_images', JSON.stringify(imageObj));
    } catch (error) {
      console.error('Error saving images to storage:', error);
      throw new Error('Failed to save image to storage');
    }
  }

  private validateFile(file: File, options: ImageValidationOptions = DEFAULT_OPTIONS): Promise<string | null> {
    return new Promise((resolve) => {
      // Check file type
      if (!options.allowedTypes.includes(file.type)) {
        resolve(`Invalid file type. Allowed types: ${options.allowedTypes.join(', ')}`);
        return;
      }

      // Check file size
      if (file.size > options.maxSizeBytes) {
        const maxSizeMB = (options.maxSizeBytes / (1024 * 1024)).toFixed(1);
        resolve(`File size too large. Maximum size: ${maxSizeMB}MB`);
        return;
      }

      // Check image dimensions
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        
        if (img.width < options.minWidth || img.height < options.minHeight) {
          resolve(`Image dimensions too small. Minimum: ${options.minWidth}x${options.minHeight}px`);
          return;
        }
        
        if (img.width > options.maxWidth || img.height > options.maxHeight) {
          resolve(`Image dimensions too large. Maximum: ${options.maxWidth}x${options.maxHeight}px`);
          return;
        }
        
        resolve(null); // No errors
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve('Invalid image file');
      };
      
      img.src = url;
    });
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsDataURL(file);
    });
  }

  private generateImageId(): string {
    return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public async uploadImage(file: File, options: ImageValidationOptions = DEFAULT_OPTIONS): Promise<ImageUploadResult> {
    try {
      // Validate file
      const validationError = await this.validateFile(file, options);
      if (validationError) {
        return {
          success: false,
          error: validationError
        };
      }

      // Convert to base64
      const base64Data = await this.fileToBase64(file);
      
      // Generate unique ID for the image
      const imageId = this.generateImageId();
      
      // Store the image
      this.uploadedImages.set(imageId, base64Data);
      this.saveStoredImages();
      
      // Return the image URL (which is the base64 data)
      return {
        success: true,
        imageUrl: base64Data
      };
      
    } catch (error) {
      console.error('Error uploading image:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  public getStorageInfo(): { count: number; estimatedSizeMB: number } {
    const totalSize = Array.from(this.uploadedImages.values())
      .reduce((total, base64) => total + base64.length, 0);
    
    // Rough estimate: base64 is ~33% larger than original
    const estimatedSizeMB = (totalSize * 0.75) / (1024 * 1024);
    
    return {
      count: this.uploadedImages.size,
      estimatedSizeMB: Math.round(estimatedSizeMB * 100) / 100
    };
  }

  public clearAllImages(): void {
    this.uploadedImages.clear();
    localStorage.removeItem('uploaded_images');
  }
}

// Utility function for easy access
export const uploadImage = async (file: File): Promise<ImageUploadResult> => {
  const service = ImageUploadService.getInstance();
  return service.uploadImage(file);
};

export const resolveImageUrl = (imageUrl: string): string => {
  // Just return the URL as-is since we're back to simple base64/URL storage
  return imageUrl;
};

export const getImageStorageInfo = () => {
  const service = ImageUploadService.getInstance();
  return service.getStorageInfo();
};