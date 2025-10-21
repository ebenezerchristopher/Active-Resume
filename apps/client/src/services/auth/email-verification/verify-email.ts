import type { MessageDto } from "@active-resume/dto";
import { useMutation } from "@tanstack/react-query";
import { axios } from "@/client/libs/axios";
import { GraphQLResponse } from "@active-resume/utils";

export const verifyEmail = async (data: { token: string }) => {
  const response = await axios.post<GraphQLResponse<MessageDto>>(`/graphql?token=${data.token}`, {
    query: `
       mutation {
           verifyEmail {
               message
           }
       }`,
  });

  return response.data.data?.verifyEmail;
};

export const useVerifyEmail = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: verifyEmailFn,
  } = useMutation({
    mutationFn: verifyEmail,
  });

  return { verifyEmail: verifyEmailFn, loading, error };
};
