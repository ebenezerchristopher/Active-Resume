import type { AuthResponseDto, LoginDto } from "@active-resume/dto";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { axios } from "@client/libs/axios";
import { queryClient } from "@client/libs/query-client";
import { useAuthStore } from "@client/stores/auth";
import { GraphQLResponse } from "@active-resume/utils";

export const login = async (data: LoginDto) => {
  const response = await axios.post<GraphQLResponse<AuthResponseDto>>("/graphql", {
    query: `
        mutation Login($data: LoginInput!) {
          login(data: $data) {
            status
            user {
              id
              email
              name
              locale
              username
              }
        }
     }`,
    variables: { data },
  });

  return response.data.data?.login;
};

export const useLogin = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const {
    error,
    isPending: loading,
    mutateAsync: loginFn,
  } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data) {
        if (data.status === "2fa_required") {
          void navigate("/auth/verify-otp");
          return;
        }

        setUser(data.user);
        queryClient.setQueryData(["user"], data.user);
      }
    },
  });

  return { login: loginFn, loading, error };
};
