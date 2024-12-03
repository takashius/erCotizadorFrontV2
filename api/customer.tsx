import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import ERDEAxios from "./ERDEAxios";
import { Address, Customer, CustomerForm, CustomerList } from "../types/customer";
import { write } from "../components/helpers/LocalStorage";

export const useListCustomer = (pattern?: string) => {
  const query = useInfiniteQuery<CustomerList>({
    queryKey: ["customerList", pattern],
    networkMode: 'offlineFirst',
    initialPageParam: 1,
    queryFn: async ({ pageParam = 0 }) => {
      return ERDEAxios.get(`/customer/list/${pageParam}/${pattern}`);
    },
    getNextPageParam: (lastPage) => lastPage.next,
  });
  return query;
};

export const useListSimpleCustomer = () => {
  const query = useQuery<Customer[]>({
    queryKey: ["customerSelectList"],
    retry: false,
    queryFn: () => {
      return ERDEAxios.get("/customer/simple");
    },
  });
  return query;
};

export const useGetCustomer = (id: string | string[]) => {
  const query = useQuery<Customer>({
    queryKey: ["customerDetail"],
    retry: false,
    queryFn: () => {
      return ERDEAxios.get("/customer/" + id);
    },
  });
  return query;
};

export const useCreateCustomer = () => {
  const mutation = useMutation({
    mutationFn: (data: CustomerForm) => {
      return ERDEAxios.post("/customer", data);
    },
    onSuccess: () => {
      write("mutateCustomer", 'true').then((res) => res);
    },
  });

  return mutation;
};

export const useUpdateCustomer = () => {
  const mutation = useMutation({
    mutationFn: (data: CustomerForm) => {
      return ERDEAxios.patch("/customer", data);
    },
    onSuccess: () => {
      write("mutateCustomer", 'true').then((res) => res);
    },
  });

  return mutation;
};

export const useDeleteCustomer = () => {
  const mutation = useMutation({
    mutationFn: (id: string) => {
      return ERDEAxios.delete(`/customer/${id}`);
    },
  });

  return mutation;
};

export const useCreateAddress = () => {
  const mutation = useMutation({
    mutationFn: (data: Address) => {
      return ERDEAxios.post("/customer/address", data);
    },
  });

  return mutation;
};

export const useUpdateAddress = () => {
  const mutation = useMutation({
    mutationFn: (data: Address) => {
      return ERDEAxios.patch("/customer/address", data);
    },
  });

  return mutation;
};

export const useDeleteAddress = () => {
  const mutation = useMutation({
    mutationFn: (data: any) => {
      return ERDEAxios.delete("/customer/address", { data });
    },
  });

  return mutation;
};
