# VinylVault 

A single-page React storefront for browsing and buying vinyl records. Users can
filter albums by genre, open a dedicated detail view for any record, add items to
a stateful slide-over cart, and complete a controlled checkout form. Built with
Vite + React and `react-router-dom` for client-side routing.

---

## 1. Project Setup & Execution Instructions

### Prerequisites
- Node.js v21+ (any version above 21; check with `node -v`)
- npm (bundled with Node.js) as the package manager

### Installation
bash
# 1. Clone the repository
git clone https://github.com/<your-username>/<your-repo>.git

# 2. Move into the project folder
cd <your-repo>

# 3. Install dependencies (React, React DOM, react-router-dom, Vite)
npm install

### Running the development server
bash
npm run dev

Vite prints a local URL in the terminal (default **http://localhost:5173**).
Open that URL in your browser; the app loads the catalog on the `/` route and
hot-reloads automatically as you edit files.

### Project Structure (overview)
The repository root holds the config files (`index.html`, `vite.config.js`,
`package.json`) and all source code lives in `src/`. Inside `src/`, `components/`
holds reusable presentational pieces (navbar, cart drawer, album card, genre
filter), `pages/` holds the three routed views (catalog, album detail, checkout),
and `data/albums.js` holds the mock album dataset. `App.jsx` owns the shared cart
state and wires up the routes, while `main.jsx` is the entry point that mounts the
app inside a `<BrowserRouter>`.

---

## 2. React Component Hierarchy & State Flow Architecture

All shared state (the `cart` array and the cart drawer's open/closed flag) is
**lifted to `<App>`**. `<App>` passes data down through props and passes callback
handlers down so that children can request state changes (unidirectional data
flow). State is updated **immutably** using `.map()`, `.filter()`, and the spread
operator — never by mutating arrays directly.

> **CartItem data type:** each cart entry is an album object spread together with a
> `quantity` field → `{ ...album, quantity: Number }`.

### Component Tree

```
<App>  →  src/App.jsx
│   STATE (owner):
│     • cart        : Array<CartItem>   — line items in the shopping cart
│     • isCartOpen  : Boolean           — whether the slide-over drawer is visible
│   DERIVED:
│     • totalCartCount : Number         — sum of all item quantities (cart badge)
│   CALLBACK HANDLERS (defined here, passed down):
│     • handleAddToCart(album, quantity)   — add/increment an item (immutable)
│     • handleUpdateQuantity(albumId, delta) — +/- a line item's quantity
│     • handleRemoveFromCart(albumId)      — remove a line item (.filter)
│     • handleClearCart()                  — empty the cart after checkout
│     • onOpenCart() / onClose()           — toggle isCartOpen
│
├── <Navbar>  →  src/components/Navbar.jsx
│       PROPS:
│         • cartCount   : Number     — count shown in the header badge
│         • onOpenCart  : function   — opens the cart drawer
│       (sticky header: logo <Link>, catalog <Link>, cart badge button)
│
├── <Routes>  (react-router-dom)
│   │
│   ├── <Route path="/">  →  renders  <CatalogPage>  →  src/pages/CatalogPage.jsx
│   │       STATE (owner):
│   │         • selectedGenre : String   — active genre filter ("All" by default)
│   │       PROPS:
│   │         • albums      : Array<Album>  — full dataset to display
│   │         • onAddToCart : function      — forwarded down to each card
│   │       │
│   │       ├── <GenreFilter>  →  src/components/GenreFilter.jsx
│   │       │       PROPS:
│   │       │         • genres        : Array<String>  — ["All","Jazz","Electronic","Rock","Classical"]
│   │       │         • selectedGenre : String         — current filter
│   │       │         • onSelectGenre : function(genre) — updates selectedGenre in parent
│   │       │
│   │       └── .album-grid (responsive CSS grid; maps filtered albums)
│   │             └── <AlbumCard>  →  src/components/AlbumCard.jsx   (.map iterator)
│   │                     PROPS:
│   │                       • album       : Object (Album)   — one record to display
│   │                       • onAddToCart : function          — fires onAddToCart(album)
│   │                     (wraps image/title in <Link to="/album/:albumId">)
│   │
│   ├── <Route path="/album/:albumId">  →  <AlbumDetailPage>  →  src/pages/AlbumDetailPage.jsx
│   │       ROUTED PAGE — reads the URL param via useParams() → albumId : String
│   │       STATE (owner):
│   │         • qty : Number   — quantity selector before adding to cart
│   │       PROPS:
│   │         • albums      : Array<Album>  — searched to find the matching album
│   │         • onAddToCart : function      — fires onAddToCart(album, qty)
│   │       (shows pressing weight, catalog number, speed, label, stock status)
│   │
│   └── <Route path="/checkout">  →  <CheckoutPage>  →  src/pages/CheckoutPage.jsx
│           ROUTED PAGE — uses useNavigate() / <Link> for client-side navigation
│           STATE (owner):
│             • formData    : Object   — controlled inputs { fullName, address,
│                                        city, postalCode, cardDetails } (all String)
│             • isSubmitted : Boolean  — toggles the order-confirmation view
│           PROPS:
│             • cart        : Array<CartItem>  — itemized order summary
│             • onClearCart : function          — clears cart on successful submit
│
└── <CartDrawer>  →  src/components/CartDrawer.jsx
        SLIDE-OVER PANEL — uses useNavigate() to go to "/checkout"
        PROPS:
          • isOpen           : Boolean   — visibility (returns null when false)
          • cart             : Array<CartItem>  — line items to render
          • onClose          : function          — closes the drawer
          • onUpdateQuantity : function(albumId, delta)  — +/- quantity
          • onRemove         : function(albumId)          — delete a line item
        (computes subtotal locally from cart; shows "Proceed to Checkout")
```

### State Flow Summary
- **`cart` + `isCartOpen` live in `<App>`.** The header badge (`<Navbar>`), the
  drawer (`<CartDrawer>`), and the checkout summary (`<CheckoutPage>`) all read
  from this single source of truth, so they stay perfectly in sync.
- **Children never own cart data.** They request changes by calling the callback
  props (`onAddToCart`, `onUpdateQuantity`, `onRemove`, `onClearCart`) that `<App>`
  passes down — classic state lifting with unidirectional data flow.
- **Local, view-specific state stays local:** `selectedGenre` in `<CatalogPage>`,
  `qty` in `<AlbumDetailPage>`, and `formData` / `isSubmitted` in `<CheckoutPage>`.
