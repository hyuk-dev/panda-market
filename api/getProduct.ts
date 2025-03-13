import api from "@/utils/axiosInstance";

export default async function getProduct(id : string) {
  const res = await api.get(
    `https://panda-market-api.vercel.app/products/${id}`
  );
  console.log("product", res);
  return res.data;
}
