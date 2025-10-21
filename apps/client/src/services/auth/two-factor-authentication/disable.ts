import type { MessageDto } from "@active-resume/dto";
import { useMutation } from "@tanstack/react-query";
import { axios } from "@/client/libs/axios";
import { GraphQLResponse } from "@active-resume/utils";

export const disable2FA = async () => {
  const response = await axios.post<GraphQLResponse<MessageDto>>("/graphql", {
    query: `
      mutation {
        TwoFaDisable {
          message
        }
      }
    `,
  });

  return response.data.data.TwoFaDisable;
};

export const useDisable2FA = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: disable2FAFn,
  } = useMutation({
    mutationFn: disable2FA,
  });

  return { disable2FA: disable2FAFn, loading, error };
};
