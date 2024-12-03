import { useMutation, useQuery } from "@tanstack/react-query";
import ERDEAxios from "./ERDEAxios";
import { Cotiza, CotizaFull, CotizaForm, PdfEndpoint } from "../types/cotiza";
import { write } from "../components/helpers/LocalStorage";
import { ProductForm, Total } from "../types/products";

export const useListCotiza = () => {
  const query = useQuery<Cotiza[]>({
    queryKey: ["cotizaList"],
    retry: false,
    queryFn: () => {
      return ERDEAxios.get("/cotiza");
    },
  });
  return query;
};

export const useCreateCotiza = () => {
  const mutation = useMutation({
    mutationFn: (data: CotizaForm) => {
      return ERDEAxios.post("/cotiza", data);
    },
    onSuccess: () => {
      write("mutateCotiza", 'true').then((res) => res);
    },
  });

  return mutation;
};

export const useGetCotiza = (id: string | string[]) => {
  const query = useQuery<CotizaFull>({
    queryKey: ["cotizaDetail"],
    retry: false,
    queryFn: () => {
      return ERDEAxios.get("/cotiza/" + id);
    },
  });
  return query;
};

export const useUpdateCotiza = () => {
  const mutation = useMutation({
    mutationFn: (data: CotizaForm) => {
      return ERDEAxios.patch("/cotiza", data);
    },
    onSuccess: () => {
      write("mutateCotiza", 'true').then((res) => res);
    },
  });

  return mutation;
};

export const useUpdateCotizaRate = () => {
  const mutation = useMutation({
    mutationFn: (data: PdfEndpoint) => {
      return ERDEAxios.patch("/cotiza/updateRate", data);
    },
    onSuccess: () => {
      write("mutateCotiza", 'true').then((res) => res);
    },
  });

  return mutation;
};

export const useDeleteCotiza = () => {
  const mutation = useMutation({
    mutationFn: (id: string) => {
      return ERDEAxios.delete(`/cotiza/${id}`);
    },
  });

  return mutation;
};

export const useCreateProduct = () => {
  const mutation = useMutation({
    mutationFn: (data: ProductForm) => {
      return ERDEAxios.post("/cotiza/product", data);
    },
  });

  return mutation;
};

export const useGetPdf = () => {
  const mutation = useMutation({
    mutationFn: (data: PdfEndpoint) => {
      let url = `/cotiza/pdf/${data.id}`;
      if (data.libre) {
        url = `/cotiza/pdflibre/${data.id}`;
      }
      return ERDEAxios.get(url, {
        responseType: 'arraybuffer',
        headers: {
          Accept: 'application/pdf',
          'Content-Type': 'application/json'
        }
      });
    },
  });

  return mutation;
};

export const useSendCotiza = () => {
  const mutation = useMutation({
    mutationFn: (id: string) => {
      return ERDEAxios.get(`/cotiza/send/${id}`);
    },
  });

  return mutation;
};

export const useUpdateProduct = () => {
  const mutation = useMutation({
    mutationFn: (data: ProductForm) => {
      return ERDEAxios.patch("/cotiza/product", data);
    },
  });

  return mutation;
};

export const useDeleteProduct = () => {
  const mutation = useMutation<Total>({
    mutationFn: (data: any) => {
      return ERDEAxios.delete("/cotiza/product", { data });
    },
  });

  return mutation;
};
