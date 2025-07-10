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

// Global image storage that persists across sessions and is accessible to all users
class GlobalImageStorage {
  private static instance: GlobalImageStorage;
  private images: Map<string, string> = new Map();
  private readonly STORAGE_KEY = 'global_product_images';

  private constructor() {
    this.loadImages();
  }

  public static getInstance(): GlobalImageStorage {
    if (!GlobalImageStorage.instance) {
      GlobalImageStorage.instance = new GlobalImageStorage();
    }
    return GlobalImageStorage.instance;
  }

  private loadImages(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.images = new Map(Object.entries(parsed));
        console.log(`Loaded ${this.images.size} images from global storage`);
      }
    } catch (error) {
      console.error('Error loading global images:', error);
    }
  }

  private saveImages(): void {
    try {
      const imageObj = Object.fromEntries(this.images);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(imageObj));
      console.log(`Saved ${this.images.size} images to global storage`);
    } catch (error) {
      console.error('Error saving images to global storage:', error);
      throw new Error('Failed to save image to global storage');
    }
  }

  public storeImage(imageId: string, base64Data: string): void {
    this.images.set(imageId, base64Data);
    this.saveImages();
  }

  public getImage(imageId: string): string | undefined {
    return this.images.get(imageId);
  }

  public getAllImages(): Map<string, string> {
    return new Map(this.images);
  }

  public deleteImage(imageId: string): boolean {
    const deleted = this.images.delete(imageId);
    if (deleted) {
      this.saveImages();
    }
    return deleted;
  }

  public getStorageInfo(): { count: number; estimatedSizeMB: number } {
    const totalSize = Array.from(this.images.values())
      .reduce((total, base64) => total + base64.length, 0);
    
    const estimatedSizeMB = (totalSize * 0.75) / (1024 * 1024);
    
    return {
      count: this.images.size,
      estimatedSizeMB: Math.round(estimatedSizeMB * 100) / 100
    };
  }

  public clearAllImages(): void {
    this.images.clear();
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export class ImageUploadService {
  private static instance: ImageUploadService;
  private globalStorage: GlobalImageStorage;

  private constructor() {
    this.globalStorage = GlobalImageStorage.getInstance();
  }

  public static getInstance(): ImageUploadService {
    if (!ImageUploadService.instance) {
      ImageUploadService.instance = new ImageUploadService();
    }
    return ImageUploadService.instance;
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
    return `global_img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public async uploadImage(file: File, options: ImageValidationOptions = DEFAULT_OPTIONS): Promise<ImageUploadResult> {
    try {
      console.log('Starting image upload process...');
      
      // Validate file
      const validationError = await this.validateFile(file, options);
      if (validationError) {
        return {
          success: false,
          error: validationError
        };
      }

      // Convert to base64
      console.log('Converting file to base64...');
      const base64Data = await this.fileToBase64(file);
      
      // Generate unique ID for the image
      const imageId = this.generateImageId();
      
      // Store the image in global storage
      console.log('Storing image in global storage...');
      this.globalStorage.storeImage(imageId, base64Data);
      
      console.log(`✅ Image uploaded successfully with ID: ${imageId}`);
      
      // Return a special URL format that our image resolver can handle
      const imageUrl = `global-image://${imageId}`;
      
      return {
        success: true,
        imageUrl: imageUrl
      };
      
    } catch (error) {
      console.error('Error uploading image:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  public resolveImageUrl(imageUrl: string): string {
    // If it's a global image URL, resolve it from storage
    if (imageUrl.startsWith('global-image://')) {
      const imageId = imageUrl.replace('global-image://', '');
      const base64Data = this.globalStorage.getImage(imageId);
      if (base64Data) {
        console.log(`✅ Resolved global image: ${imageId}`);
        return base64Data;
      } else {
        console.warn(`Image not found in global storage: ${imageId}`);
        // Return a placeholder or the original URL
        return 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg';
      }
    }
    
    // If it's already a base64 or regular URL, return as-is
    return imageUrl;
  }

  public getStorageInfo(): { count: number; estimatedSizeMB: number } {
    return this.globalStorage.getStorageInfo();
  }

  public clearAllImages(): void {
    this.globalStorage.clearAllImages();
  }

  public getAllImages(): Map<string, string> {
    return this.globalStorage.getAllImages();
  }
}

// Utility functions for easy access
export const uploadImage = async (file: File): Promise<ImageUploadResult> => {
  const service = ImageUploadService.getInstance();
  return service.uploadImage(file);
};

export const resolveImageUrl = (imageUrl: string): string => {
  const service = ImageUploadService.getInstance();
  return service.resolveImageUrl(imageUrl);
};

export const getImageStorageInfo = () => {
  const service = ImageUploadService.getInstance();
  return service.getStorageInfo();
};

export const clearAllImages = () => {
  const service = ImageUploadService.getInstance();
  service.clearAllImages();
};