import type { MessageDto } from "@active-resume/dto";
import { useMutation } from "@tanstack/react-query";
import { axios } from "@client/libs/axios";
import { GraphQLResponse } from "@active-resume/utils";

export const setup2FA = async () => {
  const response = await axios.post<GraphQLResponse<MessageDto>>("/graphql", {
    query: `
      mutation {
        TwoFaSetup {
          message
        }
      }
    `,
  });

  return response.data.data.TwoFaSetup;
};

export const useSetup2FA = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: setup2FAFn,
  } = useMutation({
    mutationFn: setup2FA,
  });

  return { setup2FA: setup2FAFn, loading, error };
};
