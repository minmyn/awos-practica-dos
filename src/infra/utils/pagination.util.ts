export const paginate = <T>(data: T[], page: number, limit: number) => {
  const total = data.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedData = data.slice(startIndex, startIndex + limit);

  return {
    data: paginatedData,
    meta: {
      page,
      limit,
      total,
      totalPages
    }
  };
};