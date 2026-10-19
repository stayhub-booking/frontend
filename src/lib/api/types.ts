export type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T | null;
  timestamp: string;
};

export type PageResponse<T> = {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};
