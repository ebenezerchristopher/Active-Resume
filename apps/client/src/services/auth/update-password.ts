import type { MessageDto, UpdatePasswordDto } from "@active-resume/dto";
import { useMutation } from "@tanstack/react-query";
import { axios } from "@/client/libs/axios";
import { GraphQLResponse } from "@active-resume/utils";

export const updatePassword = async (data: UpdatePasswordDto) => {
  const response = await axios.patch<GraphQLResponse<MessageDto>>("/graphql", {
    query: `
      mutation ($data: UpdatePasswordInput!) {
        password(data: $data) {
          message
        }
      }
    `,
    variables: { data },
  });

  return response.data.data?.password;
};

export const useUpdatePassword = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: updatePasswordFn,
  } = useMutation({
    mutationFn: updatePassword,
  });

  return { updatePassword: updatePasswordFn, loading, error };
};
