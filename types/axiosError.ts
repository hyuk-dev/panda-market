export default interface AxiosError {
  response?: {
    status: number;
    data: any;
  };
  message: string;
}
