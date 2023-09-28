import { useEffect, useState } from "react";
import { makeFetch } from "../../utils/Fetch";
import { type Shop, type ShopItem } from "./types.d";

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

  return (
    <main className="w-11/12 m-auto md:w-8/12">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {shop?.map((item) => (
            <ShopItem key={item?.mainId} {...item} />
          ))}
        </div>
      )}
    </main>
  );
};

const ShopItem = (item: ShopItem) => (
  <div className="rounded-xl overflow-hidden shadow-md shadow-slate-500 border-solid border-black border-[1px]">
    <div className="">
      <img
        className="block w-full h-full transition duration-300 ease-in-out hover:scale-105 hover:-translate-x-2 hover:-translate-y-2 opacity-90 hover:opacity-100"
        src={item?.displayAssets?.[0]?.full_background}
        alt={item?.displayName}
      />
    </div>
  </div>
);

export default DailyShop;
