export interface ApiResponse<T> {
  success: boolean;
  status: number;
  data: T | null;
  error: any | null;
}
