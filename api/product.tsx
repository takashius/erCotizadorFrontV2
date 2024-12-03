import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import ERDEAxios from "./ERDEAxios";
import { Product, ProductForm } from "../types/products";
import { write } from "../components/helpers/LocalStorage";
import { Select } from "../types/general";

export const useListProducts = (pattern?: string) => {
  const query = useInfiniteQuery<any>({
    queryKey: ["productList", pattern],
    networkMode: 'offlineFirst',
    initialPageParam: 1,
    queryFn: async ({ pageParam = 0 }) => {
      return ERDEAxios.get(`/product/list/${pageParam}/${pattern}`);
    },
    getNextPageParam: (lastPage) => lastPage.next,
  });
  return query;
};

export const useListSimpleProduct = () => {
  const query = useQuery<Select[]>({
    queryKey: ["productSelectList"],
    retry: false,
    queryFn: () => {
      return ERDEAxios.get("/product/simple");
    },
  });
  return query;
};

export const useCreateProduct = () => {
  const mutation = useMutation({
    mutationFn: (data: ProductForm) => {
      return ERDEAxios.post("/product", data);
    },
    onSuccess: () => {
      write("mutateProduct", 'true').then((res) => res);
    },
  });

  return mutation;
};

export const useUpdateProduct = () => {
  const mutation = useMutation({
    mutationFn: (data: ProductForm) => {
      return ERDEAxios.patch("/product", data);
    },
    onSuccess: () => {
      write("mutateProduct", 'true').then((res) => res);
    },
  });

  return mutation;
};

export const useDeleteProduct = () => {
  const mutation = useMutation({
    mutationFn: (id: string) => {
      return ERDEAxios.delete(`/product/${id}`);
    },
  });

  return mutation;
};
