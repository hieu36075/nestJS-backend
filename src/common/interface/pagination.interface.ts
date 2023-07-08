export interface PaginationResult<T> {
    data: T[];
    meta:{
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    }
  }