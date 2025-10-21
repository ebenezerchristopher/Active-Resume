import type { CreateResumeDto, ResumeDto } from "@active-resume/dto";
import { useMutation } from "@tanstack/react-query";
import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";
import { GraphQLResponse } from "@active-resume/utils";

export const createResume = async (data: CreateResumeDto) => {
  const response = await axios.post<GraphQLResponse<ResumeDto>>("/graphql", {
    query: `
              mutation ($data: CreateResumeInput!) {
                   createResume(data: $data) {
                      id
                      title
                      slug
                      data
                      locked
                      userId
                      visibility
                      createdAt
                      updatedAt
                      }
              }
          `,
    variables: { data },
  });

  return response.data.data.createResume;
};

export const useCreateResume = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: createResumeFn,
  } = useMutation({
    mutationFn: createResume,
    onSuccess: (data) => {
      queryClient.setQueryData<ResumeDto>(["resume", { id: data.id }], data);

      queryClient.setQueryData<ResumeDto[]>(["resumes"], (cache) => {
        if (!cache) return [data];
        return [...cache, data];
      });
    },
  });

  return { createResume: createResumeFn, loading, error };
};
