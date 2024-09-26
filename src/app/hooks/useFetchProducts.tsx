import { useInfiniteQuery } from "@tanstack/react-query";

export const useFetchProducts = (query: string, category: string) => {
  const handleFetchProducts = async ({
    queryKey,
    pageParam,
  }: {
    queryKey: string[];
    pageParam: string;
  }) => {
    // VERIFY: queryKey is an array of strings
    const query = queryKey[1];
    const category = queryKey[2];
    const resp = await fetch(`/api/productsAPI?pageParam=${pageParam}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query ?? "",
        category: category ?? "0",
      }),
    });
    const response = await resp.json();
    return response;
  };

  const { data, error, fetchNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery({
      queryKey: ["products", query, category],
      queryFn: handleFetchProducts,
      initialPageParam: "",
      getNextPageParam: (lastPage) => lastPage.cursor,
    });

  return { data, error, fetchNextPage, isFetchingNextPage, isPending };
};
