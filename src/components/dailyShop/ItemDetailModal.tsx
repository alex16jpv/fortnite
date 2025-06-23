import { useEffect, useState } from "react";
import { makeFetch } from "../../utils/Fetch";
import { type ShopItem } from "./types.d";

interface ItemDetail {
  result: boolean;
  id: string;
  name: string;
  description: string;
  type: {
    value: string;
    displayValue: string;
    backendValue: string;
  };
  rarity: {
    value: string;
    displayValue: string;
    backendValue: string;
  };
  series?: {
    value: string;
    image: string;
    backendValue: string;
  };
  set?: {
    value: string;
    text: string;
    backendValue: string;
  };
  introduction: {
    chapter: string;
    season: string;
    text: string;
    backendValue: number;
  };
  images: {
    smallIcon: string;
    icon: string;
    featured: string;
    other: Record<string, string>;
  };
  variants?: Array<{
    channel: string;
    type: string;
    options: Array<{
      tag: string;
      name: string;
      image: string;
    }>;
  }>;
  searchTags?: string[];
  gameplayTags: string[];
  metaTags?: string[];
  showcaseVideo?: string;
  dynamicPakId?: string;
  displayAssetPath?: string;
  definitionPath: string;
  path: string;
  added: string;
  releaseDate?: string;
  lastAppearance?: string;
  shopHistory?: string[];
  copyrightedAudio?: boolean;
}

interface ItemDetailModalProps {
  item: ShopItem;
  isOpen: boolean;
  onClose: () => void;
}

const ItemDetailModal = ({ item, isOpen, onClose }: ItemDetailModalProps) => {
  const [itemDetail, setItemDetail] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatRelativeTime = (date: string) => {
    const now = new Date();
    const targetDate = new Date(date);
    const daysDiff = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) return 'Today';
    if (daysDiff === 1) return 'Yesterday';
    if (daysDiff < 30) return `${daysDiff} days ago`;
    if (daysDiff < 365) return `${Math.floor(daysDiff / 30)} months ago`;
    return `${Math.floor(daysDiff / 365)} years ago`;
  };

  useEffect(() => {
    if (isOpen && item?.mainId) {
      setLoading(true);
      setError(null);
      
      makeFetch(`/items/get?id=${item.mainId}&lang=en`)
        .then((data) => {
          if (data?.result) {
            setItemDetail(data);
          } else {
            setError("Item details not found");
          }
        })
        .catch((err) => {
          console.error("Error fetching item details:", err);
          setError("Failed to load item details");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, item?.mainId]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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
  };

  const getRarityGradient = (rarity: string) => {
    const normalizedRarity = rarity.toLowerCase().replace(/\s+/g, '');
    return rarityColors[normalizedRarity as keyof typeof rarityColors] || rarityColors.common;
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700/50 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Item Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent mb-4"></div>
              <p className="text-white text-lg">Loading item details...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 text-lg mb-4">{error}</p>
              <p className="text-gray-400">Showing basic item information</p>
            </div>
          ) : null}

          {/* Item Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden p-4">
                <img
                  src={itemDetail?.images?.featured || item?.displayAssets?.[0]?.full_background}
                  alt={itemDetail?.name || item?.displayName}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              
              {/* Variants */}
              {itemDetail?.variants && itemDetail.variants.length > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-3">Variants</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {itemDetail.variants[0]?.options?.slice(0, 6).map((variant, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-2">
                        <img
                          src={variant.image}
                          alt={variant.name}
                          className="w-full aspect-square object-cover rounded"
                        />
                        <p className="text-xs text-gray-400 mt-1 text-center truncate">{variant.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              {/* Title and Rarity */}
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {itemDetail?.name || item?.displayName}
                </h1>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${getRarityGradient(itemDetail?.rarity?.displayValue || item?.rarity?.name || 'common')}`}>
                    {itemDetail?.rarity?.displayValue || item?.rarity?.name?.toUpperCase() || 'COMMON'}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {itemDetail?.type?.displayValue || item?.displayType}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-white font-semibold mb-2">Description</h3>
                <p className="text-gray-300 leading-relaxed">
                  {itemDetail?.description || item?.displayDescription || "No description available."}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                <span className="text-gray-400">Price</span>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400 font-bold text-2xl">
                    {new Intl.NumberFormat().format(item?.price?.finalPrice || 0)}
                  </span>
                  <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2L13 8h6l-5 4 2 6-6-4-6 4 2-6-5-4h6z"/>
                  </svg>
                </div>
              </div>

              {/* Release Date and Audio Info */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                {(itemDetail?.releaseDate || item?.firstReleaseDate) && (
                  <div className="p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-500/20">
                    <h4 className="text-blue-300 text-sm mb-1">🎯 Release Date</h4>
                    <p className="text-white font-medium">
                      {itemDetail?.releaseDate 
                        ? new Date(itemDetail.releaseDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })
                        : new Date(item.firstReleaseDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })
                      }
                    </p>
                  </div>
                )}
                
                {itemDetail?.copyrightedAudio && (
                  <div className="p-4 bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-xl border border-red-500/20">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <h4 className="text-red-300 text-sm font-semibold">⚠️ Copyrighted Audio</h4>
                    </div>
                    <p className="text-red-200 text-sm mt-1">
                      This item contains copyrighted audio content
                    </p>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4">
                {itemDetail?.introduction && (
                  <div className="p-4 bg-gray-800/30 rounded-xl">
                    <h4 className="text-gray-400 text-sm mb-1">Introduced</h4>
                    <p className="text-white font-medium">{itemDetail.introduction.text}</p>
                  </div>
                )}
                
                {itemDetail?.set && (
                  <div className="p-4 bg-gray-800/30 rounded-xl">
                    <h4 className="text-gray-400 text-sm mb-1">Set</h4>
                    <p className="text-white font-medium">{itemDetail.set.text}</p>
                  </div>
                )}
                
                {item?.section && (
                  <div className="p-4 bg-gray-800/30 rounded-xl">
                    <h4 className="text-gray-400 text-sm mb-1">Section</h4>
                    <p className="text-white font-medium">{item.section.name}</p>
                  </div>
                )}
                
                {item?.series && (
                  <div className="p-4 bg-gray-800/30 rounded-xl">
                    <h4 className="text-gray-400 text-sm mb-1">Series</h4>
                    <p className="text-white font-medium">{item.series.name}</p>
                  </div>
                )}
              </div>

              {/* Gameplay Tags */}
              {itemDetail?.gameplayTags && itemDetail.gameplayTags.length > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {itemDetail.gameplayTags.slice(0, 10).map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full"
                      >
                        {tag.replace(/^.*\./, '').replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Shop History */}
              {itemDetail?.shopHistory && itemDetail.shopHistory.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <h3 className="text-white font-semibold">🛒 Shop History ({itemDetail.shopHistory.length} appearances)</h3>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-4">
                    <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto">
                      {itemDetail.shopHistory.slice(0, 10).map((date, index) => {
                        const appearanceDate = new Date(date);
                        const now = new Date();
                        const daysDiff = Math.floor((now.getTime() - appearanceDate.getTime()) / (1000 * 60 * 60 * 24));
                        
                        return (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-700/40 rounded-lg hover:bg-gray-700/60 transition-colors">
                            <div className="flex flex-col">
                              <span className="text-white text-sm font-medium">
                                {appearanceDate.toLocaleDateString('en-US', { 
                                  weekday: 'short',
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </span>
                              <span className="text-gray-400 text-xs">
                                {daysDiff === 0 ? 'Today' : 
                                 daysDiff === 1 ? 'Yesterday' : 
                                 daysDiff < 30 ? `${daysDiff} days ago` :
                                 daysDiff < 365 ? `${Math.floor(daysDiff / 30)} months ago` :
                                 `${Math.floor(daysDiff / 365)} years ago`}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              #{itemDetail.shopHistory.length - index}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {itemDetail.shopHistory.length > 10 && (
                      <div className="text-center mt-3 pt-3 border-t border-gray-700/50">
                        <span className="text-gray-400 text-sm">
                          ... and {itemDetail.shopHistory.length - 10} more appearances
                        </span>
                      </div>
                    )}
                    
                    <div className="mt-4 pt-3 border-t border-gray-700/50">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">First Seen:</span>
                        <span className="text-white">
                          {new Date(itemDetail.shopHistory[itemDetail.shopHistory.length - 1]).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-400">Last Seen:</span>
                        <span className="text-white">
                          {new Date(itemDetail.shopHistory[0]).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Fallback for items without detailed shop history */}
              {(!itemDetail?.shopHistory || itemDetail.shopHistory.length === 0) && item?.previousReleaseDate && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <h3 className="text-white font-semibold">🛒 Shop Information</h3>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Previous Release:</span>
                      <span className="text-white">
                        {new Date(item.previousReleaseDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;