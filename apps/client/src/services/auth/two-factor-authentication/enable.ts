import type { BackupCodesDto, TwoFactorDto } from "@active-resume/dto";
import { useMutation } from "@tanstack/react-query";
import { axios } from "@client/libs/axios";
import { GraphQLResponse } from "@active-resume/utils";

export const enable2FA = async (data: TwoFactorDto) => {
  const response = await axios.post<GraphQLResponse<BackupCodesDto>>("/graphql", {
    query: `
      mutation ($data: TwoFactorInput!) {
        TwoFaEnable(data: $data) {
          backupCodes
        }
      }
    `,
    variables: { data },
  });

  return response.data.data.TwoFaEnable;
};

export const useEnable2FA = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: enable2FAFn,
  } = useMutation({
    mutationFn: enable2FA,
  });

  return { enable2FA: enable2FAFn, loading, error };
};
