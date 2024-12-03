import { useMutation, useQuery } from "@tanstack/react-query";
import ERDEAxios from "./ERDEAxios";
import { Colors, Company, ConfigPDF, Image } from "../types/company";
import { parseImage } from "../components/helpers/ParseImage";
import { write, remove } from "../components";

export const useGetCompany = (retry: boolean) => {
  const query = useQuery<Company>({
    queryKey: ["myCompany"],
    retry,
    queryFn: () => {
      return ERDEAxios.get("/company/myCompany");
    },
  });
  return query;
};

export const useSetConfig = () => {
  const mutation = useMutation({
    mutationFn: (data: Company) => {
      return ERDEAxios.patch("/company/config", data);
    }
  });

  return mutation;
};

export const useSetConfigPdf = () => {
  const mutation = useMutation({
    mutationFn: (data: ConfigPDF) => {
      const dataFull: Company = {
        id: data.id,
        pdf: data
      };
      return ERDEAxios.patch("/company/config", dataFull);
    }
  });

  return mutation;
};

export const useSetConfigEmail = () => {
  const mutation = useMutation({
    mutationFn: ({ data, textBody }: { data: Colors, textBody: string }) => {
      const dataFull: Company = {
        id: data.id,
        configMail: {
          colors: data,
          textBody
        }
      };
      return ERDEAxios.patch("/company/config", dataFull);
    }
  });

  return mutation;
};

export const useUploadImage: any = () => {
  const mutation = useMutation({
    mutationFn: (data: Image) => {
      write("contentType", 'true').then((res) => res);
      var formData = new FormData();
      formData.append("image", parseImage(data.image));
      formData.append("imageType", data.imageType);
      return ERDEAxios.post("/company/upload", formData);
    },
    onSuccess: async () => {
      await remove("contentType");
    },
    onError: async () => {
      await remove("contentType");
    }
  });

  return mutation;
};