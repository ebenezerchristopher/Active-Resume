import type { ResetPasswordDto } from "@active-resume/dto";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { axios } from "@/client/libs/axios";

export const resetPassword = async (data: ResetPasswordDto) => {
  return axios.post<undefined, AxiosResponse<undefined>>("/graphql", {
    query: `
           mutation ($data: ResetPasswordInput!) {
           resetPassword(data: $data) { message
           }}
          `,
    variables: { data },
  });
};

export const useResetPassword = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: resetPasswordFn,
  } = useMutation({
    mutationFn: resetPassword,
  });

  return { resetPassword: resetPasswordFn, loading, error };
};
