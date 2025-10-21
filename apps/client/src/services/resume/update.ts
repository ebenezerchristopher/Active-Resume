import type { ResumeDto, UpdateResumeDto } from "@active-resume/dto";
import { useMutation } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";
import { GraphQLResponse } from "@active-resume/utils";

export const updateResume = async (data: UpdateResumeDto) => {
  const response = await axios.post<GraphQLResponse<ResumeDto>>(`/graphql?id=${data.id}`, {
    query: `
                mutation ($data: UpdateResumeInput!) {
                   updateResume(data: $data) {
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

  return response.data.data.updateResume;
};

export const debouncedUpdateResume = debounce(updateResume, 500);

export const useUpdateResume = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: updateResumeFn,
  } = useMutation({
    mutationFn: updateResume,
    onSuccess: (data) => {
      queryClient.setQueryData<ResumeDto>(["resume", { id: data.id }], data);

      queryClient.setQueryData<ResumeDto[]>(["resumes"], (cache) => {
        if (!cache) return [data];
        return cache.map((resume) => {
          if (resume.id === data.id) return data;
          return resume;
        });
      });
    },
  });

  return { updateResume: updateResumeFn, loading, error };
};
