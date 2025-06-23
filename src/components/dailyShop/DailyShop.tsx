import { useEffect, useState } from "react";
import { makeFetch } from "../../utils/Fetch";
import { type Shop, type ShopItem } from "./types.d";
import ItemDetailModal from "./ItemDetailModal";

const rarityColors = {
  common: "from-gray-400 to-gray-600",
  uncommon: "from-green-400 to-green-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 to-yellow-600",
  mythic: "from-red-400 to-red-600",
  dark: "from-pink-400 to-pink-600",
  dc: "from-cyan-400 to-cyan-600",
  marvel: "from-red-500 to-red-700",
  icon: "from-teal-400 to-teal-600",
  gaminglegends: "from-purple-500 to-purple-700",
  starwars: "from-yellow-500 to-yellow-700",
  frozen: "from-blue-300 to-blue-500",
  lava: "from-orange-500 to-red-600",
  shadow: "from-gray-700 to-black",
  slurp: "from-cyan-300 to-cyan-500"
};

const useShop = () => {
  const [shop, setShop] = useState<Shop["shop"] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    makeFetch("/shop?lang=en").then((data) => {
      setShop(data?.shop);
      setLoading(false);
    });
  }, []);

  return { shop, loading };
};

const DailyShop = () => {
  const { shop, loading } = useShop();
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleItemClick = (item: ShopItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-black text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            FORTNITE DAILY SHOP
          </h1>
          <p className="text-xl text-gray-300 font-medium">Discover today's exclusive items</p>
        </header>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-400 border-t-transparent mb-4"></div>
            <p className="text-white text-xl font-semibold">Loading Epic Items...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {shop?.map((item) => (
              <ShopItem key={item?.mainId} item={item} onItemClick={handleItemClick} />
            ))}
          </div>
        )}
      </div>
      
      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </main>
  );
};

interface ShopItemProps {
  item: ShopItem;
  onItemClick: (item: ShopItem) => void;
}

const ShopItem = ({ item, onItemClick }: ShopItemProps) => {
  const getRarityGradient = (rarity: string) => {
    const normalizedRarity = rarity.toLowerCase().replace(/\s+/g, '');
    return rarityColors[normalizedRarity as keyof typeof rarityColors] || rarityColors.common;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat().format(price);
  };

  const handleClick = () => {
    onItemClick(item);
  };

  return (
    <div 
      className="group relative bg-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-700/50 cursor-pointer"
      onClick={handleClick}
    >
      {/* Rarity Gradient Border */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getRarityGradient(item?.rarity?.name || 'common')} opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Image Container */}
        <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 p-2">
          <img
            className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-110"
            src={item?.displayAssets?.[0]?.full_background}
            alt={`${item?.displayName} - ${item?.rarity?.name || 'Common'} rarity ${item?.displayType || 'cosmetic'} in Fortnite for ${item?.price?.finalPrice || 0} V-Bucks`}
            loading="lazy"
            width="400"
            height="400"
            decoding="async"
          />
        </div>
        
        {/* Item Info */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="text-white font-bold text-lg leading-tight group-hover:text-blue-300 transition-colors duration-200">
            {item?.displayName}
          </h3>
          
          {/* Rarity Badge */}
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getRarityGradient(item?.rarity?.name || 'common')} shadow-lg`}>
              {item?.rarity?.name?.toUpperCase() || 'COMMON'}
            </span>
            
            {/* Price */}
            <div className="flex items-center space-x-1">
              <span className="text-yellow-400 font-bold text-lg">{formatPrice(item?.price?.finalPrice || 0)}</span>
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L13 8h6l-5 4 2 6-6-4-6 4 2-6-5-4h6z"/>
              </svg>
            </div>
          </div>
          
          {/* Description */}
          {item?.displayDescription && (
            <p className="text-gray-400 text-sm line-clamp-2">
              {item.displayDescription}
            </p>
          )}
          
          {/* Section */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-700/50">
            <span className="text-xs text-gray-500 font-medium">
              {item?.section?.name || 'Daily'}
            </span>
            {item?.series && (
              <span className="text-xs text-blue-400 font-medium">
                {item.series.name}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Hover Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getRarityGradient(item?.rarity?.name || 'common')} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`}></div>
    </div>
  );
};

export default DailyShop;
