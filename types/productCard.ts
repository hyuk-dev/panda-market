export default interface ProductCard {
  createdAt: string;
  description: string;
  favoriteCount: number;
  id: number;
  images: string[];
  name: string;
  ownerId: number;
  ownerNickname: string;
  price: number;
  tags: string[];
  updatedAt: string;
  isFavorite: boolean;
}