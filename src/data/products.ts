import { Product } from '../types/Product';

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Elegant Silk Saree',
    description: 'Beautiful handwoven silk saree with traditional motifs and gold border. Perfect for weddings and special occasions.',
    price: 2499,
    originalPrice: 3499,
    images: [
      'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg',
      'https://images.pexels.com/photos/8566474/pexels-photo-8566474.jpeg'
    ],
    category: 'sarees',
    subcategory: 'Silk Sarees',
    sizes: ['Free Size'],
    colors: ['Red', 'Gold'],
    inStock: true,
    featured: true,
    tags: ['wedding', 'silk', 'traditional', 'handwoven'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Designer Anarkali Suit',
    description: 'Stunning designer Anarkali suit with intricate embroidery and comfortable fit. Includes matching dupatta.',
    price: 1899,
    originalPrice: 2599,
    images: [
      'https://images.pexels.com/photos/8148577/pexels-photo-8148577.jpeg',
      'https://images.pexels.com/photos/8148579/pexels-photo-8148579.jpeg'
    ],
    category: 'suits',
    subcategory: 'Anarkali Suits',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue', 'Silver'],
    inStock: true,
    featured: true,
    tags: ['designer', 'anarkali', 'embroidery', 'party wear'],
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '3',
    name: 'Royal Lehenga Set',
    description: 'Magnificent lehenga set with heavy work and premium fabric. Perfect for bridal wear and grand celebrations.',
    price: 4999,
    originalPrice: 6999,
    images: [
      'https://images.pexels.com/photos/8148585/pexels-photo-8148585.jpeg',
      'https://images.pexels.com/photos/8148586/pexels-photo-8148586.jpeg'
    ],
    category: 'lehengas',
    subcategory: 'Bridal Lehengas',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Maroon', 'Gold'],
    inStock: true,
    featured: true,
    tags: ['bridal', 'heavy work', 'royal', 'premium'],
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13')
  },
  {
    id: '4',
    name: 'Cotton Kurti Set',
    description: 'Comfortable cotton kurti with matching palazzo pants. Perfect for daily wear and casual occasions.',
    price: 899,
    images: [
      'https://images.pexels.com/photos/8148578/pexels-photo-8148578.jpeg'
    ],
    category: 'kurtis',
    subcategory: 'Cotton Kurtis',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Pink', 'Yellow'],
    inStock: true,
    featured: false,
    tags: ['cotton', 'casual', 'comfortable', 'daily wear'],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '5',
    name: 'Festive Silk Saree',
    description: 'Gorgeous silk saree with intricate zari work. Perfect for festivals and celebrations.',
    price: 1999,
    originalPrice: 2799,
    images: [
      'https://images.pexels.com/photos/8566475/pexels-photo-8566475.jpeg'
    ],
    category: 'sarees',
    subcategory: 'Festive Sarees',
    sizes: ['Free Size'],
    colors: ['Green', 'Gold', 'Red'],
    inStock: true,
    featured: false,
    tags: ['festive', 'silk', 'zari work', 'celebration'],
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11')
  },
  {
    id: '6',
    name: 'Embroidered Kurti',
    description: 'Beautiful embroidered kurti with modern design. Perfect for office wear and casual outings.',
    price: 1299,
    images: [
      'https://github.com/gitesh2005/Anshu-collection/blob/main/pics/IMG-20250702-WA0027.jpg'
    ],
    category: 'kurtis',
    subcategory: 'Embroidered Kurtis',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy', 'White', 'Cream'],
    inStock: true,
    featured: false,
    tags: ['embroidered', 'modern', 'office wear', 'casual'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  }
];
