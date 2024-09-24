export type PaginatedResponse<T> = {
  [key: string]: T[] | number;
  total: number;
  currentPage: number;
  totalPages: number;
};
