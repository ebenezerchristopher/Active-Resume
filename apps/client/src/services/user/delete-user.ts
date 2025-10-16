import type { MessageDto } from "@active-resume/dto";
import { useMutation } from "@tanstack/react-query";
import { axios } from "@client/libs/axios";
import { queryClient } from "@client/libs/query-client";
import { GraphQLResponse } from "@active-resume/utils";

export const deleteUser = async () => {
  const response = await axios.post<GraphQLResponse<MessageDto>>("/graphql", {
    query: `
        mutation {
            delete {
                message
            }
        }
      `,
  });

  return response.data.data.delete;
};

export const useDeleteUser = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: deleteUserFn,
  } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return { deleteUser: deleteUserFn, loading, error };
};
