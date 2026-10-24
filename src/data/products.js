// Real product photos from Unsplash (photo ids). The first photo of each product is its main image.
const photos = {
  'classic-sneakers': ['1542291026-7eec264c27ff', '1549298916-b41d501d3772', '1491553895911-0055eca6402d', '1595950653106-6c9ebd614d3a'],
  'denim-jacket': ['1551537482-f2075a1d41f2', '1576995853123-5a10305d93c0'],
  'leather-backpack': ['1622560480605-d83c853bc5c3', '1491637639811-60e2756cc1c7', '1553062407-98eeb64c6a62'],
  'summer-dress': ['1572804013309-59a88b7e92f1', '1496747611176-843222e1e57c', '1515372039744-b8f02a3ae446'],
  'wireless-headphones': ['1505740420928-5e560c06d30e', '1583394838336-acd977736f90', '1484704849700-f032a568e944'],
  'smart-watch': ['1546868871-7041f2a55e12', '1579586337278-3befd40fd17a', '1523275335684-37898b6baf30'],
  'bluetooth-speaker': ['1608043152269-423dbba4e7e1', '1589003077984-894e133dabab', '1545454675-3531b543be5d'],
  'mechanical-keyboard': ['1618384887929-16ec33fab9ef', '1595225476474-87563907a212'],
  'ceramic-vase': ['1612196808214-b8e1d6145a8c', '1578500494198-246f612d3b3d'],
  'table-lamp': ['1534105615256-13940a56ff44', '1507473885765-e6ed057f782c'],
  'linen-bedding': ['1522771739844-6a9f6d5f14af', '1616594039964-ae9021a400a0', '1505693416388-ac5ce068fe85'],
  'scented-candle': ['1603006905003-be475563bc59', '1602874801007-bd458bb1b8b6'],
  'skincare-set': ['1571781926291-c477ebfd024b', '1556228720-195a672e8a03', '1620916566398-39f1143ab7be'],
  perfume: ['1541643600914-78b084683601', '1592945403244-b3fbafd7f539', '1594035910387-fea47794261f'],
  'yoga-mat': ['1601925260368-ae2f83cf8b7f', '1518611012118-696072aa579a', '1544367567-0f2fcb009e0b'],
  'running-shoes': ['1606107557195-0e29a4b5b4aa', '1460353581641-37baddab0fa2', '1539185441755-769473a23570'],
  'water-bottle': ['1602143407151-7111542de6e8', '1610824352934-c10d87b700cc'],
  'dumbbell-set': ['1583454110551-21f2fa2afe61', '1534438327276-14e5300c3a48'],

  'cotton-tshirt': ['1521572163474-6864f9cf17ab', '1583743814966-8936f5b7be1a', '1503341504253-dff4815485f1'],
  'retro-sunglasses': ['1572635196237-14b3f281503f', '1511499767150-a48a237f0083', '1473496169904-658ba7c44d8a'],
  'analog-watch': ['1524592094714-0f0654e20314', '1522312346375-d1a52e2b99b3', '1542496658-e33a6d0d50f6'],
  'pullover-hoodie': ['1556821840-3a63f95609a7', '1578768079052-aa76e52ff62e', '1620799140408-edc6dcb6d633'],
  'leather-handbag': ['1584917865442-de89df76afd3', '1548036328-c9fa89d128fa', '1590874103328-eac38a683ce7'],
  'slim-jeans': ['1542272604-787c3835535d', '1582552938357-32b906df40cb', '1541099649105-f69ad21f3246'],
  'ultrabook-laptop': ['1496181133206-80ce9b88a853', '1517336714731-489689fd1ca8', '1525547719571-a2d4ac8945e2'],
  smartphone: ['1511707171634-5f897ff02aa9', '1598327105666-5b89351aff97', '1592899677977-9c10ca588bbd'],
  'true-wireless-earbuds': ['1572569511254-d8f925fe2cbb', '1590658268037-6bf12165a8df', '1606220588913-b3aacb4d2f46'],
  'digital-camera': ['1516035069371-29a1b244cc32', '1502920917128-1aa500764cbd', '1526170375885-4d8ecf77b99f'],
  'gaming-mouse': ['1615663245857-ac93bb7c39e7', '1563297007-0686b7003af7', '1527864550417-7fd91fc51a46'],
  'coffee-mug': ['1514228742587-6b1558fcca3d', '1517256064527-09c73fc73e38', '1495474472287-4d71bcdd2085'],
  'succulent-plant': ['1485955900006-10f4d324d411', '1459156212016-c812468e2115'],
  'velvet-sofa': ['1555041469-a586c61ea9bc', '1540574163026-643ea20ade25'],
  'makeup-brush-set': ['1596462502278-27bfdc403348', '1583241800698-e8ab01830a07'],
  'lip-colour-duo': ['1586495777744-4413f21062fa', '1522335789203-aabd1fc54bc9'],
  'hair-mask': ['1608248543803-ba4f8c70ae0b'],
  basketball: ['1519861531473-9200262188bf', '1546519638-68e109498ffc', '1608245449230-4ac19066d2d0'],
  'soccer-ball': ['1575361204480-aadea25e6e68', '1614632537190-23e4146777db', '1579952363873-27f3bade9f55'],
  'city-bicycle': ['1485965120184-e220f721d03e', '1532298229144-0ec0c57515c7', '1507035895480-2b3156c31fc8'],
  'barbell-set': ['1517836357463-d25dfeac3438', '1590487988256-9ed24133863e'],
}

const img = (id) =>
  (photos[id] ?? []).map((p) => `https://images.unsplash.com/photo-${p}?w=800&h=800&fit=crop&q=80`)

const make = (id, name, category, price, description, extra = {}) => ({
  id,
  name,
  category,
  price,
  description,
  images: img(id),
  stock: 8 + ((id.length * 7) % 40),
  active: true,
  rating: 4 + ((id.length * 3) % 10) / 10,
  reviews: 20 + ((id.length * 37) % 200),
  ...extra,
})

export const categories = ['All', 'Fashion', 'Electronics', 'Home', 'Beauty', 'Sports']

export const products = [
  make('classic-sneakers', 'Classic Sneakers', 'Fashion', 79, 'Comfortable everyday sneakers with a cushioned sole and breathable upper.', { oldPrice: 99, sizes: ['40', '41', '42', '43', '44'] }),
  make('denim-jacket', 'Denim Jacket', 'Fashion', 89, 'A timeless denim jacket with a relaxed fit that goes with everything.', { sizes: ['S', 'M', 'L', 'XL'] }),
  make('leather-backpack', 'Leather Backpack', 'Fashion', 120, 'Handcrafted leather backpack with a padded laptop sleeve.', { oldPrice: 150 }),
  make('summer-dress', 'Summer Dress', 'Fashion', 59, 'Light flowing dress made from soft breathable cotton.', { sizes: ['S', 'M', 'L'] }),
  make('wireless-headphones', 'Wireless Headphones', 'Electronics', 149, 'Noise-cancelling over-ear headphones with 40 hours of battery life.', { oldPrice: 199 }),
  make('smart-watch', 'Smart Watch', 'Electronics', 199, 'Track fitness, sleep and notifications from your wrist.', { stock: 3 }),
  make('bluetooth-speaker', 'Bluetooth Speaker', 'Electronics', 65, 'Portable waterproof speaker with deep bass and 12-hour playtime.'),
  make('mechanical-keyboard', 'Mechanical Keyboard', 'Electronics', 95, 'Hot-swappable mechanical keyboard with RGB backlighting.', { oldPrice: 115 }),
  make('ceramic-vase', 'Ceramic Vase', 'Home', 42, 'Hand-glazed ceramic vase, perfect for fresh or dried flowers.'),
  make('table-lamp', 'Modern Table Lamp', 'Home', 55, 'Minimal table lamp with a warm, dimmable light.'),
  make('linen-bedding', 'Linen Bedding Set', 'Home', 130, 'Stonewashed linen duvet cover and two pillowcases.', { oldPrice: 160 }),
  make('scented-candle', 'Scented Candle', 'Beauty', 24, 'Soy wax candle with notes of vanilla and sandalwood.'),
  make('skincare-set', 'Skincare Set', 'Beauty', 78, 'Cleanser, toner and moisturiser for a complete daily routine.', { oldPrice: 95 }),
  make('perfume', 'Eau de Parfum', 'Beauty', 110, 'A fresh floral fragrance that lasts all day.', { stock: 0 }),
  make('yoga-mat', 'Yoga Mat', 'Sports', 35, 'Non-slip eco-friendly mat, 6mm thick for joint support.'),
  make('running-shoes', 'Running Shoes', 'Sports', 105, 'Lightweight running shoes with responsive cushioning.', { oldPrice: 130, sizes: ['40', '41', '42', '43', '44'] }),
  make('water-bottle', 'Insulated Bottle', 'Sports', 28, 'Keeps drinks cold for 24 hours or hot for 12.'),
  make('dumbbell-set', 'Dumbbell Set', 'Sports', 85, 'Adjustable dumbbell pair for home workouts.'),

  // Fashion
  make('cotton-tshirt', 'Cotton T-Shirt', 'Fashion', 25, 'Soft everyday t-shirt in 100% combed cotton with a classic fit.', { sizes: ['S', 'M', 'L', 'XL'] }),
  make('retro-sunglasses', 'Retro Sunglasses', 'Fashion', 45, 'UV-protected polarised lenses in a timeless frame.', { oldPrice: 60 }),
  make('analog-watch', 'Classic Analog Watch', 'Fashion', 140, 'Minimal analog watch with a genuine leather strap and sapphire-style glass.', { oldPrice: 180 }),
  make('pullover-hoodie', 'Pullover Hoodie', 'Fashion', 55, 'Heavyweight fleece hoodie with a roomy hood and kangaroo pocket.', { sizes: ['S', 'M', 'L', 'XL'] }),
  make('leather-handbag', 'Leather Handbag', 'Fashion', 135, 'Structured leather handbag with a detachable shoulder strap.', { oldPrice: 170 }),
  make('slim-jeans', 'Slim Fit Jeans', 'Fashion', 70, 'Stretch denim jeans with a modern slim cut and a comfortable mid rise.', { sizes: ['30', '32', '34', '36'] }),

  // Electronics
  make('ultrabook-laptop', 'Ultrabook Laptop', 'Electronics', 899, 'Thin and light 14-inch laptop with a sharp display and all-day battery.', { oldPrice: 999, stock: 6 }),
  make('smartphone', 'Smartphone 128GB', 'Electronics', 599, 'Bright OLED screen, dual cameras and a fast, smooth processor.', { oldPrice: 649 }),
  make('true-wireless-earbuds', 'True Wireless Earbuds', 'Electronics', 79, 'Compact earbuds with active noise cancelling and a charging case.', { oldPrice: 99 }),
  make('digital-camera', 'Digital Camera', 'Electronics', 549, 'Mirrorless-style camera with interchangeable lens and 4K video.'),
  make('gaming-mouse', 'Gaming Mouse', 'Electronics', 49, 'Ergonomic wired mouse with a 16,000 DPI sensor and programmable buttons.'),

  // Home
  make('coffee-mug', 'Ceramic Coffee Mug', 'Home', 14, 'Hand-finished ceramic mug that keeps your coffee warm longer.'),
  make('succulent-plant', 'Succulent in Pot', 'Home', 22, 'Low-maintenance live succulent in a modern ceramic pot.'),
  make('velvet-sofa', 'Modern Sofa', 'Home', 649, 'Three-seater sofa with soft upholstery and solid wood legs.', { oldPrice: 799, stock: 4 }),

  // Beauty
  make('makeup-brush-set', 'Makeup Brush Set', 'Beauty', 34, 'Soft synthetic brushes for face and eyes, in a travel pouch.'),
  make('lip-colour-duo', 'Lip & Nail Colour Duo', 'Beauty', 26, 'Matching lipstick and nail polish in a bold, long-wearing red.'),
  make('hair-mask', 'Restorative Hair Mask', 'Beauty', 32, 'Deep-conditioning mask that repairs dry and damaged hair.'),

  // Sports
  make('basketball', 'Official Basketball', 'Sports', 29, 'Durable outdoor basketball with deep channels for a better grip.'),
  make('soccer-ball', 'Soccer Ball', 'Sports', 32, 'Size 5 match ball with a stitched cover and a stable flight.'),
  make('city-bicycle', 'City Bicycle', 'Sports', 349, 'Lightweight fixed-gear style bike, great for commuting and weekends.', { oldPrice: 420, stock: 5 }),
  make('barbell-set', 'Barbell & Plates Set', 'Sports', 120, 'Olympic-style barbell with weight plates for serious home training.'),
]

export const getProduct = (id) => products.find((p) => p.id === id)
