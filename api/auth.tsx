import { Register, useMutation, useQuery } from "@tanstack/react-query";
import ERDEAxios from "./ERDEAxios";
import { Account } from "../types/general";

export interface UserLogin {
  name: string;
  lastname: string;
  email: string;
  token: string;
  _id: string;
}

export interface Recovery {
  code: string;
  email: string;
  newPass: string;
}

export interface SetCompany {
  user: string;
  company: string;
}

export const useLogin = (email: String, password: String) => {
  const query = useQuery<UserLogin>({
    queryKey: ["login"],
    enabled: false,
    retry: false,
    queryFn: () => {
      return ERDEAxios.post("/user/login", JSON.stringify({ email, password }));
    },
  });
  return query;
};

export const useAccount = () => {
  const query = useQuery<Account>({
    queryKey: ["myAccount"],
    retry: false,
    queryFn: () => {
      return ERDEAxios.get("/user/account");
    },
  });
  return query;
};

export const useLogout = () => {
  const query = useQuery({
    queryKey: ["logout"],
    queryFn: () => {
      return ERDEAxios.post("/user/logout");
    },
  });
  return query;
};

export const useRegister = () => {
  const mutation = useMutation({
    mutationFn: (data: Register) => {
      return ERDEAxios.post("/user/register", data);
    }
  });

  return mutation;
};

export const useSelectCompany = () => {
  const mutation = useMutation({
    mutationFn: (data: SetCompany) => {
      return ERDEAxios.patch("/user/select_company", data);
    }
  });

  return mutation;
};

export const useRecoveryOne = () => {
  const mutation = useMutation({
    mutationFn: (email: String) => {
      return ERDEAxios.get("/user/recovery/" + email);
    }
  });

  return mutation;
};

export const useRecoveryTwo = () => {
  const mutation = useMutation({
    mutationFn: (data: Recovery) => {
      return ERDEAxios.post("/user/recovery", data);
    }
  });

  return mutation;
};
