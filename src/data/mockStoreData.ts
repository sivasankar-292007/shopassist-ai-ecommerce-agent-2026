import type { Product, Order, PromoCode } from '../types.ts';

export const STORE_INFO = {
  name: 'Lumina Lifestyle & Gear',
  tagline: 'Modern essentials crafted for daily performance & urban travel',
  currency: 'USD',
  freeShippingThreshold: 50,
  returnWindowDays: 30,
  supportEmail: 'care@luminalifestyle.com',
  supportHours: '24/7 AI-Powered Support, Human Specialist Desk Mon-Fri 8am-8pm EST',
  phone: '+1 (800) 555-0199',
};

export const PROMO_CODES: PromoCode[] = [
  {
    code: 'WELCOME15',
    discountType: 'percentage',
    discountValue: 15,
    minOrder: 0,
    description: '15% off your first purchase for new customers'
  },
  {
    code: 'SAVENOW20',
    discountType: 'fixed',
    discountValue: 20,
    minOrder: 100,
    description: '$20 off any purchase over $100'
  },
  {
    code: 'FREESHIP',
    discountType: 'percentage',
    discountValue: 0,
    minOrder: 0,
    description: 'Free express shipping on all orders'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Aerolite Daily Backpack 24L',
    tagline: 'Weatherproof urban commuter pack with dedicated 16" tech sleeve',
    category: 'Tech & EDC',
    price: 139,
    originalPrice: 165,
    rating: 4.9,
    reviewsCount: 342,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 28,
    colors: ['Obsidian Black', 'Mineral Olive', 'Storm Grey'],
    description: 'Constructed from recycled 840D ballistic nylon with YKK AquaGuard zippers. Engineered with ergonomic airmesh back padding and luggage pass-through for seamless transit.',
    highlights: [
      'Padded dual-compartment for 16" laptop & 11" tablet',
      'Magnetic Fidlock sternum strap & quick-access passport pocket',
      'Water-repellent DWR coating withstands heavy downpours',
      'Hidden AirTag / tracker stealth pocket'
    ],
    sizingAdvice: 'One size fits all body frames (dimensions: 18.5" H x 12" W x 6.5" D). Capacity is 24 liters, ideal for day commutes or 2-day weekend travel.',
    materialsCare: 'Spot clean with lukewarm water and mild organic soap. Do not machine wash or dry clean.',
    sku: 'LUM-EDC-010'
  },
  {
    id: 'prod-2',
    name: 'Merino Wool Minimalist Overshirt',
    tagline: 'Ultra-fine 18.5 micron Australian merino wool with thermo-regulation',
    category: 'Apparel',
    price: 148,
    originalPrice: 175,
    rating: 4.8,
    reviewsCount: 189,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 14,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Oatmeal Heather', 'Deep Navy', 'Charcoal'],
    description: 'Naturally odor-resistant, temperature-regulating merino wool shirt jacket. Heavyweight 280 GSM knit with corozo nut buttons, tailored for effortless layering.',
    highlights: [
      '100% natural 18.5 micron superfine merino wool',
      'Naturally antibacterial — wear multiple days without washing',
      'Dual chest pockets with hidden sunglass loop',
      'Pre-shrunk double-faced knit construction'
    ],
    sizingAdvice: 'Regular tailored fit. Fits true to size. If you plan to wear thick hoodies or sweaters underneath, we recommend sizing up one size.',
    materialsCare: 'Hand wash cold or gentle wool cycle. Lay flat on towel to dry. Do not tumble dry.',
    sku: 'LUM-APP-044'
  },
  {
    id: 'prod-3',
    name: 'SoundPulse Active Noise Canceling Headphones',
    tagline: 'Hybrid ANC with 45-hour battery and Hi-Res LDAC audio streaming',
    category: 'Tech & EDC',
    price: 189,
    originalPrice: 220,
    rating: 4.9,
    reviewsCount: 512,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 42,
    colors: ['Matte Black', 'Silver Cloud', 'Desert Gold'],
    description: 'Custom 40mm titanium diaphragm drivers tuned for deep sub-bass and crystalline highs. Active noise cancellation filters out 98% of ambient noise with 6 beamforming microphones for crystal-clear calls.',
    highlights: [
      '45 hours of playtime with ANC enabled (60 hrs standard)',
      '10-minute quick charge yields 5 hours of listening',
      'Multipoint Bluetooth 5.3 connects two devices simultaneously',
      'Memory foam vegan leather earcups for all-day cloud comfort'
    ],
    sizingAdvice: 'Adjustable aluminum headband comfortably fits all head sizes. Plush earcups swivel flat for compact travel case.',
    materialsCare: 'Wipe ear cushions with dry microfiber cloth. Includes hard shell carrying case and 3.5mm braided aux cable.',
    sku: 'LUM-AUD-092'
  },
  {
    id: 'prod-4',
    name: 'Vanguard All-Weather Low Sneakers',
    tagline: 'Water-resistant ripstop & suede hybrid with Vibram Megagrip traction',
    category: 'Footwear',
    price: 155,
    originalPrice: 180,
    rating: 4.7,
    reviewsCount: 228,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 19,
    sizes: ['US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    colors: ['Sand / Sage', 'Blackout', 'Clay Stone'],
    description: 'The definitive hybrid sneaker for wet city streets and light outdoor trails. Ortholite bounce insole, Cordura upper, and Vibram rubber compound ensure zero slip.',
    highlights: [
      'Vibram Megagrip rubber lugs deliver maximum wet-surface traction',
      'Hydrophobic Cordura mesh repels light rain and mud splashes',
      'Ergonomic footbed with high-rebound cushioning',
      'Reflective 3M heel tab for nighttime visibility'
    ],
    sizingAdvice: 'Slightly snug athletic fit. For wider feet or wearing thicker athletic wool socks, consider ordering half a size up.',
    materialsCare: 'Brush off dried dirt with soft bristle brush. Wipe clean with damp cloth.',
    sku: 'LUM-FTW-018'
  },
  {
    id: 'prod-5',
    name: 'HydroLock Vacuum Insulated Bottle 32oz',
    tagline: 'Triple-wall 18/8 food-grade stainless steel keeps cold for 36 hours',
    category: 'Accessories',
    price: 42,
    originalPrice: 50,
    rating: 4.9,
    reviewsCount: 670,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 85,
    colors: ['Matte Dune', 'Slate Blue', 'Forest Green', 'Matte Carbon'],
    description: 'Double-wall vacuum insulation with a copper radiant layer keeps drinks icy cold up to 36 hours or piping hot for 18 hours. Leakproof 2-in-1 chug and straw cap included.',
    highlights: [
      '100% BPA-free, lead-free food grade 18/8 pro stainless steel',
      'Condensation-free powder coated exterior with durable grip',
      'Cup holder friendly base with silicone quiet bumper',
      'Lifetime warranty against manufacturer insulation defects'
    ],
    sizingAdvice: 'Standard 32oz capacity (approx. 950ml). Diameter is 3.5 inches, fits standard backpack side bottle pockets.',
    materialsCare: 'Lid and straw are top-rack dishwasher safe. Hand washing body recommended to preserve exterior powder coat.',
    sku: 'LUM-ACC-077'
  },
  {
    id: 'prod-6',
    name: 'Titanium Slim EDC Pen & Stylus',
    tagline: 'Precision machined Grade 5 titanium with German Schmidt Schmidt refill',
    category: 'Tech & EDC',
    price: 68,
    originalPrice: 85,
    rating: 4.9,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 36,
    colors: ['Stonewashed Titanium', 'Matte Midnight DLC'],
    description: 'Machined from a solid billet of Grade 5 aerospace titanium. Features a satisfying bolt-action deployment mechanism, deep-carry pocket clip, and conductive silicon stylus nib.',
    highlights: [
      'Solid Grade 5 aerospace titanium body weighing only 28 grams',
      'Smooth bolt-action retraction mechanism tested for 100,000 clicks',
      'Compatible with universal Parker-style G2 ink cartridges',
      'Integrated rear touch-stylus for tablets and digital signatures'
    ],
    sizingAdvice: 'Compact 5.1" length and 0.4" diameter. Comfortable for both everyday journaling and rapid signature signing.',
    materialsCare: 'Titanium is impervious to rust or corrosion. Swap ink cartridges by unscrewing the front cone.',
    sku: 'LUM-EDC-099'
  },
  {
    id: 'prod-7',
    name: 'Everyday Tech Folio & Cable Organizer',
    tagline: 'Origami fold storage for chargers, powerbanks, SSDs, and cables',
    category: 'Tech & EDC',
    price: 54,
    originalPrice: 65,
    rating: 4.8,
    reviewsCount: 310,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 50,
    colors: ['Graphite Black', 'Sand Khaki'],
    description: 'Keep your digital essentials sorted without tangles. Accordion-style interior pockets expand to hold bulky laptop power bricks, mice, earbuds, and portable hard drives.',
    highlights: [
      'Elastic cord organizers prevent cable tangling',
      'Weather-resistant exterior shell with padded EVA foam protection',
      'Clamshell 180-degree lay-flat opening for instant desk access',
      'External grab handle & pen loop'
    ],
    sizingAdvice: 'Dimensions: 9.5" W x 6.0" H x 3.2" D. Fits inside all standard backpacks and messenger bags.',
    materialsCare: 'Spot clean with mild damp cloth. Air dry.',
    sku: 'LUM-EDC-032'
  },
  {
    id: 'prod-8',
    name: 'CloudKnit Heavyweight Organic Hoodie',
    tagline: '480 GSM French Terry cotton with brushed fleece interior',
    category: 'Apparel',
    price: 110,
    originalPrice: 130,
    rating: 4.9,
    reviewsCount: 440,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    stockCount: 22,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Vintage Bone', 'Washed Pine', 'Charcoal Heather'],
    description: 'Custom-milled 100% GOTS certified organic cotton French Terry. Substantial 480 GSM weight with a relaxed drop-shoulder cut, double-layered hood, and hidden kangaroo coin pocket.',
    highlights: [
      'Heavyweight 480 GSM organic cotton knit holds structured drape',
      'No front drawstrings for a sleek minimalist look',
      'Flatlock stitched seams resist fraying and skin friction',
      'Ribbed side gussets provide flexible ease of movement'
    ],
    sizingAdvice: 'Modern relaxed boxy cut. True to size for a streetwear relaxed look. Size down if you prefer a slim athletic fit.',
    materialsCare: 'Machine wash cold with like colors inside out. Tumble dry low or hang dry to preserve softness.',
    sku: 'LUM-APP-088'
  }
];

export const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ORD-9421',
    customerName: 'Alex Morgan',
    customerEmail: 'alex.morgan@example.com',
    date: 'Yesterday at 3:15 PM',
    status: 'Shipped',
    items: [
      {
        productId: 'prod-1',
        productName: 'Aerolite Daily Backpack 24L',
        quantity: 1,
        price: 139,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80',
        size: 'One Size'
      }
    ],
    total: 139,
    carrier: 'FedEx Priority',
    trackingNumber: 'FX-84920192',
    estimatedDelivery: 'Tomorrow by 2:30 PM',
    shippingAddress: '742 Evergreen Terrace, Suite 4B, Springfield, OR 97477',
    timeline: [
      { title: 'Order Confirmed', time: 'Yesterday 3:15 PM', completed: true, current: false },
      { title: 'Picked & Packed', time: 'Yesterday 7:40 PM', completed: true, current: false },
      { title: 'Shipped via FedEx', time: 'Today 5:20 AM', completed: true, current: true, location: 'Memphis Sorting Hub' },
      { title: 'Out for Delivery', time: 'Estimated Tomorrow morning', completed: false, current: false },
      { title: 'Delivered', time: 'Estimated Tomorrow 2:30 PM', completed: false, current: false }
    ],
    returnEligibleUntil: '30 days after delivery'
  },
  {
    id: 'ORD-8812',
    customerName: 'Alex Morgan',
    customerEmail: 'alex.morgan@example.com',
    date: '10 days ago',
    status: 'Delivered',
    items: [
      {
        productId: 'prod-2',
        productName: 'Merino Wool Minimalist Overshirt',
        quantity: 1,
        price: 148,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80',
        size: 'M'
      }
    ],
    total: 148,
    carrier: 'UPS Ground',
    trackingNumber: '1Z9999999999999999',
    estimatedDelivery: 'Delivered on front porch',
    shippingAddress: '742 Evergreen Terrace, Suite 4B, Springfield, OR 97477',
    timeline: [
      { title: 'Order Placed', time: '10 days ago', completed: true, current: false },
      { title: 'Shipped via UPS', time: '8 days ago', completed: true, current: false },
      { title: 'Delivered', time: '5 days ago at 11:24 AM', completed: true, current: true, location: 'Front Porch / Handed to resident' }
    ],
    returnEligibleUntil: '25 days remaining (eligible for free return or exchange)'
  },
  {
    id: 'ORD-7305',
    customerName: 'Alex Morgan',
    customerEmail: 'alex.morgan@example.com',
    date: '3 hours ago',
    status: 'Processing',
    items: [
      {
        productId: 'prod-3',
        productName: 'SoundPulse Active Noise Canceling Headphones',
        quantity: 1,
        price: 189,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
        size: 'Matte Black'
      }
    ],
    total: 189,
    carrier: 'DHL Express',
    trackingNumber: 'Pending fulfillment scan',
    estimatedDelivery: 'Ships within 12 hours',
    shippingAddress: '742 Evergreen Terrace, Suite 4B, Springfield, OR 97477',
    timeline: [
      { title: 'Payment Authorized', time: '3 hours ago', completed: true, current: false },
      { title: 'Sent to Warehouse', time: '2 hours ago', completed: true, current: true, location: 'Reno Fulfillment Center' },
      { title: 'Carrier Hand-off', time: 'Pending', completed: false, current: false },
      { title: 'Delivered', time: 'Estimated 2 business days', completed: false, current: false }
    ],
    returnEligibleUntil: '30 days after delivery'
  }
];

export const STORE_POLICIES_FAQ = `
STORE POLICIES & KNOWLEDGE BASE FOR LUMINA LIFESTYLE & GEAR:

1. SHIPPING & DELIVERY:
- Standard Shipping: Free for all orders over $50. Under $50, flat shipping is $8. Delivery time is 3-5 business days.
- Express Shipping: $15 flat rate or free with code 'FREESHIP'. Delivery time is 1-2 business days.
- International Shipping: We ship to over 45 countries with prepaid duties (DDP). Delivery typically takes 5-9 business days.
- Processing time: Orders placed before 2:00 PM EST ship same business day.

2. RETURNS & EXCHANGES:
- Hassle-Free 30-Day Window: Any unworn, undamaged item with original tags can be returned or exchanged within 30 days of delivery.
- Free Domestic Return Shipping: We provide an instant prepaid printable QR/shipping label. No printer needed (USPS/FedEx can scan your QR code).
- Exchanges: If an item doesn't fit or you prefer another color, exchanges are 100% free with priority replacement shipment.
- Refund Timeline: Refunds are issued back to the original payment method within 2-3 business days after our warehouse scans the returned package.

3. DISCOUNTS & PROMOTIONS:
- 'WELCOME15': 15% off first order for new customers.
- 'SAVENOW20': $20 off any purchase over $100.
- 'FREESHIP': Free express delivery on any order.
- Promo codes can be applied in the cart or automatically by Lumi in the chat. Only one promo code can be combined per checkout.

4. SIZING & FIT GUARANTEE:
- Sizing charts are available for all apparel and footwear.
- If an item doesn't fit properly, our Fit Guarantee allows instant 1-click exchange with zero return shipping fees.

5. WARRANTY & SUSTAINABILITY:
- All Lumina bags, EDC gear, and electronics carry a 1-Year Comprehensive Manufacturer Warranty against defects.
- All apparel uses GOTS-certified organic cotton or ethical non-mulesed Australian merino wool.
- 100% plastic-free, recyclable FSC-certified packaging.

6. ESCALATION & HUMAN SUPPORT:
- If a shopper has a complex inquiry, dispute, or explicitly requests to speak with a human support specialist, Lumi can instantly create an Escalation Ticket with a dedicated reference ID and notify our tier-2 human desk.
`;
