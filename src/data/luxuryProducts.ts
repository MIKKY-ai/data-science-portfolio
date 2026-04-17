// Luxury Products Data - Curated collection of high-end fashion items
// Replaces generic Fake Store API products with luxury brand products
// Categories: Bags, Shoes, Watches, Clothing (inspired by Prada, Louis Vuitton, Gucci etc.)

import { Product } from '../types';

export const luxuryProducts: Product[] = [
  // ───── BAGS ─────
  {
    id: 1,
    title: 'Prada Re-Edition 2005 Saffiano Leather Bag',
    price: 1850,
    description:
      'Iconic Prada Re-Edition crafted in premium Saffiano leather with gold-tone hardware. Features removable nylon pouch and adjustable chain-link strap. Embossed Prada triangle logo. Made in Italy.',
    category: 'bags',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
    rating: { rate: 4.8, count: 312 },
  },
  {
    id: 2,
    title: 'Louis Vuitton Neverfull MM Monogram',
    price: 2030,
    description:
      'The iconic Neverfull MM in signature Monogram canvas. Spacious interior with removable zippered clutch. Natural cowhide leather trim with golden brass hardware. Side laces adjust for a sleek or casual silhouette.',
    category: 'bags',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
    rating: { rate: 4.9, count: 587 },
  },
  {
    id: 3,
    title: 'Gucci GG Marmont Small Shoulder Bag',
    price: 2490,
    description:
      'Matelassé chevron leather shoulder bag with signature Double G hardware in antique gold-tone. Chain shoulder strap, heart detail on back. Silk lining with internal slip pocket.',
    category: 'bags',
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop',
    rating: { rate: 4.7, count: 245 },
  },
  {
    id: 4,
    title: 'Hermès Birkin 25 Togo Leather',
    price: 12500,
    description:
      'The most coveted bag in the world. Birkin 25 in Togo calfskin with palladium-plated hardware. Turn-lock closure with padlock and clochette. Hand-stitched by a single artisan in France.',
    category: 'bags',
    image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=400&h=400&fit=crop',
    rating: { rate: 5.0, count: 89 },
  },

  // ───── SHOES ─────
  {
    id: 5,
    title: 'Christian Louboutin So Kate 120mm Pumps',
    price: 795,
    description:
      'The ultimate stiletto. So Kate features a daring 120mm heel and pointed toe in patent leather with the iconic red lacquered sole. Handmade in Italy.',
    category: 'shoes',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop',
    rating: { rate: 4.6, count: 198 },
  },
  {
    id: 6,
    title: 'Gucci Ace Embroidered Sneakers',
    price: 690,
    description:
      'Signature Gucci Ace low-top sneakers in white leather with embroidered bee motif. Green-red-green web detail along the sides. Rubber sole with excellent cushioning.',
    category: 'shoes',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop',
    rating: { rate: 4.5, count: 431 },
  },
  {
    id: 7,
    title: 'Louis Vuitton LV Trainer Sneakers',
    price: 1340,
    description:
      'Virgil Abloh-designed LV Trainer in calf leather and suede. Hand-finished details with LV initials on the side. Monogram flower on the outsole. Comes in signature LV orange box.',
    category: 'shoes',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop',
    rating: { rate: 4.7, count: 356 },
  },
  {
    id: 8,
    title: 'Prada Monolith Brushed Leather Chelsea Boots',
    price: 1290,
    description:
      'Chunky Chelsea boots in brushed leather with oversized platform sole featuring the Prada triangle logo. Elastic side panels for easy on-off. Leather lining.',
    category: 'shoes',
    image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=400&h=400&fit=crop',
    rating: { rate: 4.4, count: 167 },
  },

  // ───── WATCHES ─────
  {
    id: 9,
    title: 'Rolex Submariner Date 41mm',
    price: 14150,
    description:
      'The reference among diving watches. Oystersteel case with unidirectional rotatable Cerachrom bezel insert in black ceramic. Water-resistant to 300 metres. Self-winding Calibre 3235 movement.',
    category: 'watches',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop',
    rating: { rate: 4.9, count: 723 },
  },
  {
    id: 10,
    title: 'Cartier Santos de Cartier Medium',
    price: 7650,
    description:
      'The first modern wristwatch, redesigned. Medium model in steel with 18K yellow gold bezel. Blue cabochon set crown, silvered opaline dial. QuickSwitch interchangeable bracelet/strap system.',
    category: 'watches',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop',
    rating: { rate: 4.8, count: 289 },
  },
  {
    id: 11,
    title: 'Audemars Piguet Royal Oak 37mm',
    price: 29800,
    description:
      'Gerald Genta-designed masterpiece. Stainless steel case with signature octagonal bezel and eight hexagonal screws. "Grande Tapisserie" dial. Self-winding Calibre 3120.',
    category: 'watches',
    image: 'https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?w=400&h=400&fit=crop',
    rating: { rate: 4.9, count: 156 },
  },
  {
    id: 12,
    title: 'Omega Speedmaster Moonwatch Professional',
    price: 6550,
    description:
      'The watch worn on the moon. 42mm Hesalite crystal, hand-wound Calibre 321 movement. Tachymeter bezel, 3 sub-dials chronograph. Comes on stainless steel bracelet with NASA-certified heritage.',
    category: 'watches',
    image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=400&h=400&fit=crop',
    rating: { rate: 4.7, count: 498 },
  },

  // ───── CLOTHING ─────
  {
    id: 13,
    title: 'Prada Re-Nylon Cropped Jacket',
    price: 2150,
    description:
      'Sustainable luxury meets Italian craftsmanship. Re-Nylon regenerated fabric jacket with triangle logo plaque, stand-up collar, and concealed zip closure. Recycled from ocean plastic.',
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    rating: { rate: 4.5, count: 134 },
  },
  {
    id: 14,
    title: 'Louis Vuitton Monogram Silk Shirt',
    price: 1680,
    description:
      'Relaxed-fit silk shirt with tonal Monogram jacquard weave throughout. Mother-of-pearl buttons, spread collar. Made from 100% mulberry silk in France.',
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&h=400&fit=crop',
    rating: { rate: 4.6, count: 87 },
  },
  {
    id: 15,
    title: 'Burberry Kensington Heritage Trench Coat',
    price: 2290,
    description:
      'The definitive trench coat. Cotton gabardine with signature Burberry check lining, heritage details including epaulettes, gun flap, and belted cuffs. Water-resistant. Made in England.',
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop',
    rating: { rate: 4.8, count: 412 },
  },
  {
    id: 16,
    title: 'Versace Barocco Print Silk Blazer',
    price: 3200,
    description:
      'Statement blazer in pure silk with iconic Barocco print in gold and black. Single-breasted, two-button closure with Medusa head buttons. Fully lined.',
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    rating: { rate: 4.4, count: 65 },
  },
  {
    id: 17,
    title: 'Dior Oblique Jacquard Hoodie',
    price: 1950,
    description:
      'Relaxed-fit hoodie in navy blue Dior Oblique jacquard technical cotton. Kangaroo pocket, ribbed cuffs and hem. Christian Dior Couture signature on chest.',
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
    rating: { rate: 4.6, count: 203 },
  },
  {
    id: 18,
    title: 'Balenciaga Track Sneakers',
    price: 1050,
    description:
      'Multi-layered sneakers combining mesh, nylon, and rubber. Features 176 individual pieces assembled by hand. Balenciaga logo embossed on the side. Ultra-lightweight EVA sole.',
    category: 'shoes',
    image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&h=400&fit=crop',
    rating: { rate: 4.3, count: 289 },
  },
  {
    id: 19,
    title: 'Chanel Classic Flap Medium Lambskin',
    price: 10800,
    description:
      'The Chanel Classic Flap in quilted lambskin with gold-tone CC turn-lock. Interwoven chain and leather strap. Burgundy leather interior with multiple compartments. Made in France.',
    category: 'bags',
    image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=400&h=400&fit=crop',
    rating: { rate: 4.9, count: 445 },
  },
  {
    id: 20,
    title: 'Patek Philippe Nautilus 5711/1A',
    price: 35000,
    description:
      'The ultimate luxury sports watch. Stainless steel with blue-black gradient dial. Self-winding Calibre 26-330 S C movement. Water-resistant to 120m. Transparent sapphire caseback.',
    category: 'watches',
    image: 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=400&h=400&fit=crop',
    rating: { rate: 5.0, count: 67 },
  },
];
