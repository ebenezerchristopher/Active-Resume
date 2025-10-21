import type { AuthResponseDto, RegisterDto } from "@active-resume/dto";
import { useMutation } from "@tanstack/react-query";
//import type { AxiosResponse } from "axios";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";
import { useAuthStore } from "@/client/stores/auth";
import { GraphQLResponse } from "@active-resume/utils";

export const register = async (data: RegisterDto) => {
  const response = await axios.post<GraphQLResponse<AuthResponseDto>>("/graphql", {
    query: `mutation Register($data: RegisterInput!) {
            register(data: $data) {
            status user{ id email name username createdAt updatedAt}
            }
    }`,
    variables: { data },
  });

  return response.data.data?.register;
};

export const useRegister = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const {
    error,
    isPending: loading,
    mutateAsync: registerFn,
  } = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      if (data) {
        setUser(data.user);
        queryClient.setQueryData(["user"], data.user);
      }
    },
  });

  return { register: registerFn, loading, error };
};
