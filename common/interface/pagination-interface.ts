export interface IPaginationMetaFormat {
    currentPage: number
    itemsPerPage: number
    totalItems: number
    totalPages: number
    hasPreviousPage: boolean
    hasNextPage: boolean
}

export interface IPaginationResponseFormat<T> {
    items: T[],
    meta: IPaginationMetaFormat
}