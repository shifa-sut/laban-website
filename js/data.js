/* =====================================================================
   The Laban Spot — site content
   Everything here comes from The Laban Spot's own menu cards, product
   photos and thelabanspot.in. Edit this file to update the site.
   - To add a product photo: put it in assets/images/products/ and set
     `img` on that flavour (file name without the folder).
   - To add a review: add an object to REVIEWS (real guests only).
   - To add an outlet: add an object to OUTLETS.
   ===================================================================== */
window.LABAN = {
  phone: '+91 79940 59711',
  phoneRaw: '917994059711',
  instagram: 'https://www.instagram.com/the_laban_spot_official/',
  instagramHandle: '@the_laban_spot_official',

  /* Menu — from the printed menu card (prices are intentionally not shown on the site).
     img = clean studio photo (shown in the menu explorer), poster = ad poster */
  MENU: [
    { id: 'salankatia', name: 'Salankatia', ar: 'السالا نكاتيه', pack: 'Round cup',
      flavours: [
        { n: 'Nutella + Pistachio', img: 'salankatia-nutella-pistachio-studio.jpg', poster: 'salankatia-nutella-pistachio.jpg', ing: ['choc', 'pistachio', 'hazelnut'] },
        { n: 'Pistachio + Lotus', img: 'salankatia-pistachio-lotus-studio.jpg', ing: ['pistachio', 'lotus'] },
        { n: 'Lotus', img: 'salankatia-lotus-studio.jpg', ing: ['lotus'] },
        { n: 'Mango', img: 'salankatia-mango-studio.jpg', ing: ['mango'] },
        { n: 'Nutella + Lotus', img: 'salankatia-nutella-lotus-studio.jpg', ing: ['choc', 'lotus'] },
        { n: 'Nutella', ing: ['choc', 'hazelnut'] },
        { n: 'Pistachio', img: 'salankatia-pistachio-studio.jpg', ing: ['pistachio'] }
      ], menuImg: 'menu-page-1.jpg' },
    { id: 'koushri', name: 'Koushri', ar: 'كشري', pack: 'Round cup',
      flavours: [
        { n: 'Lotus', img: 'koushri-lotus-studio.jpg', ing: ['lotus'] },
        { n: 'Nutella Hazelnut', img: 'koushri-nutella-hazelnut-studio.jpg', ing: ['choc', 'hazelnut'] },
        { n: 'Pistachio', img: 'koushri-pistachio-studio.jpg', ing: ['pistachio'] }
      ], menuImg: 'menu-page-1.jpg' },
    { id: 'qashtuta', name: 'Qashtuta', ar: 'قشطوطة', pack: 'Tray',
      flavours: [
        { n: 'Strawberry + Banana', img: 'qashtuta-strawberry-banana-studio.jpg', poster: 'qashtuta-strawberry-banana.jpg', ing: ['strawberry', 'banana'] },
        { n: 'Mango', poster: 'qashtuta-mango.jpg', ing: ['mango'] },
        { n: 'Banana + Mango', img: 'qashtuta-banana-mango-studio.jpg', poster: 'qashtuta-banana-mango.jpg', ing: ['banana', 'mango'] },
        { n: 'Anar with Tender Coconut', img: 'qashtuta-anar-tender-coconut-studio.jpg', poster: 'qashtuta-anar-tender-coconut.jpg', ing: ['anar', 'coconut'] },
        { n: 'Mango + Strawberry', img: 'qashtuta-mango-strawberry-studio.jpg', poster: 'qashtuta-mango-strawberry.jpg', ing: ['mango', 'strawberry'] },
        { n: 'Lotus', img: 'qashtuta-lotus-studio.jpg', poster: 'qashtuta-lotus.jpg', ing: ['lotus'] },
        { n: 'Nutella Hazelnut', img: 'qashtuta-nutella-hazelnut-studio.jpg', poster: 'qashtuta-nutella-hazelnut.jpg', ing: ['choc', 'hazelnut'] },
        { n: 'Pistachio', img: 'qashtuta-pistachio-studio.jpg', poster: 'qashtuta-pistachio.jpg', ing: ['pistachio'] }
      ], menuImg: 'menu-page-2.jpg' },
    { id: 'bambooza', name: 'Bambooza', ar: 'البمبوطة', pack: 'Round cup',
      flavours: [
        { n: 'Lotus', img: 'bambooza-lotus-studio.jpg', ing: ['lotus'] },
        { n: 'Pistachio', img: 'bambooza-pistachio-studio.jpg', ing: ['pistachio'] },
        { n: 'Nutella', img: 'bambooza-nutella-studio.jpg', ing: ['choc'] },
        { n: 'Mango', img: 'bambooza-mango-studio.jpg', ing: ['mango'] }
      ], menuImg: 'menu-page-2.jpg' },
    { id: 'heba', name: 'Heba Cake', ar: 'كيكه الهبه', pack: 'Tray', rangeImg: 'heba-cake-studio.jpg',
      flavours: [{ n: 'Pistachio Belgium Chocolate', ing: ['pistachio', 'choc'] }, { n: 'Pistachio Kinder Chocolate', ing: ['pistachio', 'choc'] }],
      menuImg: 'menu-page-1.jpg' },
    { id: 'aseera', name: 'Aseera', ar: 'عصيرة', pack: 'Bottle',
      note: 'Creamy milk kunafa in a bottle. Shake well before use.',
      flavours: [
        { n: 'Aseerathul Nutella', img: 'aseera-nutella-studio.jpg', ing: ['choc', 'milk'] },
        { n: 'Aseerathul Pistachio', img: 'aseera-pistachio-studio.jpg', ing: ['pistachio', 'milk'] },
        { n: 'Aseerathul Lotus', img: 'aseera-lotus-studio.jpg', ing: ['lotus', 'milk'] }
      ], menuImg: 'menu-page-2.jpg' },
    { id: 'cheesebomb', name: 'Cheese Bomb', ar: '', pack: 'Gift box',
      flavours: [{ n: 'Cheese Bomb', img: 'cheese-bomb-open.jpg', ing: ['choc', 'milk'] }], menuImg: 'menu-page-2.jpg' }
  ],

  /* What's New — products photographed in their packaging but not on the
     printed menu card. Shown as a scroll showcase; each product carries the
     colours of its own packaging. */
  NEW: [
    { id: 'royal', name: 'Royal Salankatia', lead: 'Royal', accent: 'Salankatia', ar: 'رويال سالانكاتيا', cut: 'royal-salankatia.webp',
      text: 'Salankatia in its own royal-blue gift box, with a wooden spoon tucked in beside it.',
      colors: { bg: '#EEF6FC', panel: '#2F98DB', ring: '#BFDDF2', accent: '#0F6CB3', pill: 'rgba(255,255,255,.88)', pillText: '#0F5E9C', stroke: 'rgba(255,255,255,.6)' } },
    { id: 'khalifa', name: 'Choco Khalifa', lead: 'Choco', accent: 'Khalifa', ar: '', tag: 'Premium handmade torte cake', cut: 'choco-khalifa-box.webp',
      text: 'A premium handmade torte cake in a keepsake box. Made with love, baked to delight.',
      colors: { bg: '#F8F0E4', panel: '#6E3A22', ring: '#E5CFB4', accent: '#7A4024', pill: 'rgba(248,232,208,.92)', pillText: '#5A2C16', stroke: 'rgba(248,232,208,.55)' } },
    { id: 'mohabbat', name: 'Mohabbat', lead: '', accent: 'Mohabbat', ar: '', cut: 'mohabbat-open.webp',
      text: 'Mohabbat means love. A cake set in a gold tray, packed in a pink heart-print box and tied with ribbon.',
      colors: { bg: '#FDF1F4', panel: '#EE9DB6', ring: '#F7CFDB', accent: '#C2335F', pill: 'rgba(255,255,255,.86)', pillText: '#B02A55', stroke: 'rgba(255,255,255,.62)' } }
  ],


  /* Signature Creations scroll story — uses the official product posters */
  SIGNATURES: [
    { range: 'Salankatia', n: 'Nutella + Pistachio', img: 'salankatia-nutella-pistachio.jpg', ing: ['choc', 'pistachio', 'hazelnut'], tone: '#c9b29f' },
    { range: 'Qashtuta', n: 'Mango + Strawberry', img: 'qashtuta-mango-strawberry.jpg', ing: ['mango', 'strawberry'], tone: '#2a87ae' },
    { range: 'Qashtuta', n: 'Lotus', img: 'qashtuta-lotus.jpg', ing: ['lotus'], tone: '#0b4b78' },
    { range: 'Qashtuta', n: 'Anar with Tender Coconut', img: 'qashtuta-anar-tender-coconut.jpg', ing: ['anar', 'coconut'], tone: '#7cc4ef' },
    { range: 'Qashtuta', n: 'Nutella Hazelnut', img: 'qashtuta-nutella-hazelnut.jpg', ing: ['choc', 'hazelnut'], tone: '#2f8cc8' },
    { range: 'Qashtuta', n: 'Banana + Mango', img: 'qashtuta-banana-mango.jpg', ing: ['banana', 'mango'], tone: '#049fe0' },
    { range: 'Qashtuta', n: 'Pistachio', img: 'qashtuta-pistachio.jpg', ing: ['pistachio'], tone: '#4da1c4' },
    { range: 'Qashtuta', n: 'Mango', img: 'qashtuta-mango.jpg', ing: ['mango'], tone: '#e9edf0' },
    { range: 'Qashtuta', n: 'Strawberry + Banana', img: 'qashtuta-strawberry-banana.jpg', ing: ['strawberry', 'banana'], tone: '#1d6fd0' }
  ],

  /* Real guest reviews only. Example shape:
     { name: 'Guest name', text: 'What they said', source: 'Google', rating: 5 } */
  REVIEWS: [],

  OUTLETS: [
    { name: 'The Laban Spot', city: 'Calicut', state: 'Kerala', address: 'Hilite Business Park, Calicut, Kerala',
      phone: '+91 79940 59711', maps: 'https://www.google.com/maps/search/?api=1&query=The+Laban+Spot+Hilite+Business+Park+Calicut' }
  ]
};
