/* LoneWolf demo catalogue. Prices are sample prices in rand (R). */
(function () {
  var U = function (id, w) { return "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=" + (w || 900) + "&q=80"; };
  var IMG = {
    hoodie: "1556821840-3a63f95609a7", tee1: "1521572163474-6864f9cf17ab", jacket1: "1551028719-00167b16eac5",
    cap: "1588850561407-ed78c282e89b", crew: "1578681994506-b8f463449011", tee2: "1503342217505-b0a15ec3261c",
    graphic: "1551488831-00ddcb6c6bd3", jacket2: "1529139574466-a303027c1d8b", street: "1539109136881-3be0616acf4b"
  };
  var C = {
    ink: { name: "Midnight", hex: "#17232D" }, stone: { name: "Stone", hex: "#CFC8BB" }, copper: { name: "Copper", hex: "#B7674B" },
    teal: { name: "Deep Teal", hex: "#3F6565" }, sage: { name: "Sage", hex: "#839376" }, bone: { name: "Bone", hex: "#EFEBE2" }, black: { name: "Black", hex: "#101820" }
  };
  var CLOTHES = ["XS", "S", "M", "L", "XL", "XXL"];
  var CARE = "Machine wash cold with like colours. Do not bleach. Tumble dry low or hang to dry. Iron inside out on low heat.";
  var DELIVERY = "Standard delivery is R80 (free over R1,000) in 3–5 business days. Express is R150 in 1–2 business days. Returns are accepted within 30 days in original condition. (Demo store: sample policy only.)";

  var products = [
    { id: "drift-hoodie", name: "Drift Heavyweight Hoodie", category: "Layers", price: 899, badge: "Best seller", featured: true,
      image: U(IMG.hoodie), images: [U(IMG.hoodie), U(IMG.crew), U(IMG.street)],
      colors: [C.ink, C.stone, C.copper], sizes: CLOTHES, soldOut: { "Midnight": ["XS"], "Stone": ["XXL"] },
      description: "A relaxed, heavyweight layer for cooler days, with a roomy hood and a low-key LoneWolf mark.",
      details: ["480gsm brushed-back cotton fleece", "Boxy relaxed fit, true to size", "Double-layer hood with flat drawcord", "Embroidered wolf mark on the chest"], fabric: "100% cotton fleece.", care: CARE, delivery: DELIVERY },
    { id: "ember-tee", name: "Ember Everyday Tee", category: "Tops", price: 449, badge: "New", featured: true,
      image: U(IMG.tee1), images: [U(IMG.tee1), U(IMG.tee2)],
      colors: [C.bone, C.black, C.copper], sizes: CLOTHES, soldOut: { "Black": ["S"] },
      description: "Soft cotton, easy fit, and a signature graphic that never shouts.",
      details: ["220gsm combed cotton jersey", "Regular fit with a ribbed crew neck", "Water-based chest graphic", "Pre-washed for softness"], fabric: "100% combed cotton.", care: CARE, delivery: DELIVERY },
    { id: "north-jacket", name: "Northline Utility Jacket", category: "Layers", price: 1399, badge: "Limited", featured: true,
      image: U(IMG.jacket1), images: [U(IMG.jacket1), U(IMG.jacket2)],
      colors: [C.ink, C.sage], sizes: ["S", "M", "L", "XL", "XXL"], soldOut: { "Sage": ["S", "XXL"] },
      description: "A versatile outer layer with clean utility details, built to be thrown on and left on.",
      details: ["Water-resistant cotton-nylon shell", "Four utility pockets with snap closures", "Adjustable hem drawcord", "Brushed lining at the collar"], fabric: "65% cotton, 35% nylon.", care: "Spot clean or wash cold on a gentle cycle. Hang to dry. Do not tumble dry.", delivery: DELIVERY },
    { id: "roam-cap", name: "Roam Six-Panel Cap", category: "Accessories", price: 329, was: 399, badge: "Sale", featured: true,
      image: U(IMG.cap), images: [U(IMG.cap), U(IMG.street)],
      colors: [C.black, C.stone, C.teal], sizes: ["One size"], soldOut: {},
      description: "An adjustable cap with a low-key LoneWolf mark and a soft, curved brim.",
      details: ["Washed cotton twill", "Six panels, unstructured crown", "Adjustable strap with metal clasp", "Tonal embroidered mark"], fabric: "100% cotton twill.", care: "Spot clean only. Reshape while damp.", delivery: DELIVERY },
    { id: "trail-crew", name: "Trail Crew Sweatshirt", category: "Layers", price: 749, badge: "Core",
      image: U(IMG.crew), images: [U(IMG.crew), U(IMG.hoodie)],
      colors: [C.teal, C.bone, C.ink], sizes: CLOTHES, soldOut: { "Bone": ["XS", "S"] },
      description: "A soft midweight crew for easy everyday styling, from first wear to fiftieth.",
      details: ["380gsm French terry", "Relaxed fit with dropped shoulders", "Ribbed cuffs and hem", "Small woven label at the hem"], fabric: "90% cotton, 10% recycled polyester.", care: CARE, delivery: DELIVERY },
    { id: "wildline-tee", name: "Wildline Boxy Tee", category: "Tops", price: 499, was: 579, badge: "Sale",
      image: U(IMG.tee2), images: [U(IMG.tee2), U(IMG.tee1)],
      colors: [C.stone, C.ink], sizes: CLOTHES, soldOut: {},
      description: "A roomy silhouette with a bold, considered print and a cropped boxy cut.",
      details: ["240gsm heavyweight jersey", "Boxy cut, slightly cropped", "Oversized back print", "Double-needle stitched hem"], fabric: "100% cotton.", care: CARE, delivery: DELIVERY },
    { id: "signal-tee", name: "Signal Graphic Tee", category: "Tops", price: 499, badge: "New",
      image: U(IMG.graphic), images: [U(IMG.graphic), U(IMG.tee1)],
      colors: [C.black, C.bone], sizes: CLOTHES, soldOut: { "Bone": ["XXL"] },
      description: "A standout graphic tee with a relaxed silhouette and a distinctive LoneWolf print.",
      details: ["200gsm soft-feel cotton", "Relaxed fit", "Front and back graphics", "Pre-shrunk"], fabric: "100% cotton.", care: CARE, delivery: DELIVERY },
    { id: "nightfall-jacket", name: "Nightfall Utility Jacket", category: "Layers", price: 1499, badge: "Limited",
      image: U(IMG.jacket2), images: [U(IMG.jacket2), U(IMG.jacket1)],
      colors: [C.black, C.copper], sizes: ["S", "M", "L", "XL"], soldOut: { "Copper": ["S"] },
      description: "A confident layer built for cooler days and city nights, with a longer, cleaner line.",
      details: ["Midweight cotton canvas", "Concealed zip with storm placket", "Two chest and two hand pockets", "Interior media pocket"], fabric: "100% cotton canvas.", care: "Spot clean or dry clean. Do not tumble dry.", delivery: DELIVERY }
  ];

  window.LW_DATA = { products: products, sizeGuide: [
    ["XS", "86–91", "71–76", "30"], ["S", "91–96", "76–81", "31"], ["M", "96–101", "81–86", "32"],
    ["L", "101–106", "86–91", "33"], ["XL", "106–111", "91–96", "34"], ["XXL", "111–118", "96–104", "35"]
  ] };
})();
