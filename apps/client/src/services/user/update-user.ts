import type { UpdateUserDto, UserDto } from "@active-resume/dto";
import { useMutation } from "@tanstack/react-query";
import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";
import { GraphQLResponse } from "@active-resume/utils";

export const updateUser = async (data: UpdateUserDto) => {
  const response = await axios.post<GraphQLResponse<UserDto>>("/graphql", {
    query: `
    mutation ($data: UpdateUserInput!) {
      updateMe(data: $data) {
        id,
        email,
        name,
        username,
        locale,
        picture,}
      }
     `,
    variables: { data },
  });

  return response.data.data?.updateMe;
};

export const useUpdateUser = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: updateUserFn,
  } = useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
    },
  });

  return { updateUser: updateUserFn, loading, error };
};
