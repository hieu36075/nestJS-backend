export interface PaginationResult<T> {
    data: T[];
    meta:{
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    }
  }

export interface PaginationService{
    paginateData<T>(
      page: number,
      perPage: number,
      totalItems: number,
      queryFunction: () => Promise<T>
    ): Promise<PaginationResult<T>>;
  }