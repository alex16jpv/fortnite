export interface Shop {
  carousel: null;
  customBackground: null;
  fullShop: boolean;
  result: boolean;
  shop: ShopItem[];
  specialOfferVideo: null;
}

export interface ShopItem {
  banner: Banner | null;
  buyAllowed: boolean;
  categories: string[];
  displayAssets: DisplayAsset[];
  displayDescription: string;
  displayName: string;
  displayType: string;
  firstReleaseDate: Date;
  giftAllowed: boolean;
  granted: Granted[];
  groupIndex: number;
  mainId: string;
  mainType: string;
  offerId: string;
  offerTag: OfferTag | null;
  previousReleaseDate: Date;
  price: Price;
  priority: number;
  rarity: Rarity;
  section: Section;
  series: Rarity | null;
  storeName: string;
  tileSize: string;
}

interface Banner {
  id: string;
  intensity: string;
  name: string;
}

interface DisplayAsset {
  background: string;
  background_texture: null | string;
  displayAsset: string;
  flipbook: null;
  full_background: string;
  materialInstance: string;
  url: string;
}

interface Granted {
  audio: null;
  description: string;
  gameplayTags: string[];
  id: string;
  images: Images;
  name: string;
  rarity: Rarity;
  series: Rarity | null;
  set: Set | null;
  type: Rarity;
  video: null;
}

interface Images {
  background: string;
  featured: null | string;
  full_background: string;
  icon: string;
  icon_background: string;
}

interface Rarity {
  id: string;
  name: string;
}

interface Set {
  id: string;
  name: string;
  partOf: string;
}

interface OfferTag {
  id: string;
  text: string;
}

interface Price {
  finalPrice: number;
  floorPrice: number;
  regularPrice: number;
}

interface Section {
  id: string;
  landingPriority: number;
  name: string;
}
