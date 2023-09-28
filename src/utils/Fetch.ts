import type { Shop } from "../components/dailyShop/types";
// import shopData from "../mock/dailyShop.json";

export const makeFetch = async (url: string): Promise<Shop> => {
  const response = await fetch(`${import.meta.env.PUBLIC_API_URL}${url}`, {
    headers: {
      Authorization: import.meta.env.PUBLIC_API_TOKEN,
    },
  });
  const data = await response.json();
  console.log(data);
  return data;
  // return shopData as any;
};
