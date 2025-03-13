export default interface ProductComment {
  writer: Writer;
  updatedAt: string;
  createdAt: string;
  content: string;
  id: number;
}

interface Writer {
  image: string;
  nickname: string;
  id: number;
}