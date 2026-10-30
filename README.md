# The Laban Spot website

Open `index.html` in a browser, or upload the whole folder to your web host.

## Folders
- `index.html` – the page
- `css/style.css` – all styles
- `js/data.js` – menu, signature products, reviews and outlets (edit this to update content)
- `js/loader.js` – the chocolate cup loading animation (shows once per visit)
- `js/main.js` – scroll-based shop entrance, gallery, reveals, menu panel, forms
- `assets/images/brand/` – official logo (unchanged)
- `assets/images/outlets/` – the four outlet renders
- `assets/images/products/` – product photos
- `assets/images/menu/` – menu card pages and mockups
- `assets/images/cutouts/` – transparent product cut-outs
- `assets/video/` – the shop entrance video: `shop-entrance-landscape.mp4` (1280×720, desktops, laptops, landscape tablets) and `shop-entrance-portrait.mp4` (720×1280, phones and portrait tablets), each with a first-frame poster. The site picks one by screen orientation. Scrolling controls the video; it never autoplays. `shop-entrance-1280.mp4` and `shop-entrance-854.mp4` are the older, softer encodes and are no longer used; you can delete them.

## Common updates
- New product photo: copy it into `assets/images/products/`, then in `js/data.js` add `img: 'file-name.jpg'` to that flavour.
- Real guest review: add `{ name: '...', text: '...', source: 'Google', rating: 5 }` to `REVIEWS` in `js/data.js`.
- New outlet: add an entry to `OUTLETS` in `js/data.js`.
- Replay the loading animation: add `?intro=1` to the address, or open the site in a new tab.

Fonts (Gloock, Outfit, Caveat Brush) load from Google Fonts. Forms open WhatsApp to +91 79940 59711 with the details filled in.

## Animation library
The site loads Motion (motion.dev, the Framer Motion engine for plain HTML) from jsDelivr in `index.html`. It powers the scroll reveals, the menu panel and tile hovers. No npm install or build step is needed. If the script can't load, the site uses its built-in CSS animations instead.
- `js/showcase.js` + `assets/video/salankatia-original-landscape.mp4` / `salankatia-original-portrait.mp4` – the Salankatia section (third section): your original videos, unedited, shown full-section (16:9 on wide screens, 9:16 on tall screens). Plays when the section is in view and pauses when you leave. The `salankatia-showcase-*` files and `assets/images/featured/` + `assets/images/showcase/` belonged to earlier versions and are no longer used.
