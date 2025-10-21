import type { AuthResponseDto, TwoFactorDto } from "@active-resume/dto";
import { useMutation } from "@tanstack/react-query";
import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";
import { useAuthStore } from "@/client/stores/auth";
import { GraphQLResponse } from "@active-resume/utils";

export const verifyOtp = async (data: TwoFactorDto) => {
  const response = await axios.post<GraphQLResponse<AuthResponseDto>>("/graphql", {
    query: `
            mutation ($data: TwoFactorInput!){
                verifyOtp(data: $data){
                    status
                    user {
                        id
                        email
                        username
                        name
                        locale
                        picture
                        emailVerified
                        twoFactorEnabled
                    }
                }
            }
        `,
    variables: { data },
  });

  return response.data.data.verifyOtp;
};

export const useVerifyOtp = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const {
    error,
    isPending: loading,
    mutateAsync: verifyOtpFn,
  } = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(["user"], data.user);
    },
  });

  return { verifyOtp: verifyOtpFn, loading, error };
};
