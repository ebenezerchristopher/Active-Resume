import type { MessageDto } from "@active-resume/dto";
import { useMutation } from "@tanstack/react-query";
import { axios } from "@/client/libs/axios";
import { GraphQLResponse } from "@active-resume/utils";

export const resendVerificationEmail = async () => {
  const response = await axios.post<GraphQLResponse<MessageDto>>("/graphql", {
    query: `
       mutation {
           reverifyEmail {
               message
           }
       }`,
  });

  return response.data.data?.reverifyEmail;
};

export const useResendVerificationEmail = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: resendVerificationEmailFn,
  } = useMutation({
    mutationFn: resendVerificationEmail,
  });

  return { resendVerificationEmail: resendVerificationEmailFn, loading, error };
};
