import type { ImportResumeDto, ResumeDto } from "@active-resume/dto";
import { useMutation } from "@tanstack/react-query";
import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";
import { GraphQLResponse } from "@active-resume/utils";

export const importResume = async (data: ImportResumeDto) => {
  const response = await axios.post<GraphQLResponse<ResumeDto>>("/graphql", {
    query: `
         mutation ($data: ImportResumeInput!) {
              importResume(data: $data) {
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

  return response.data.data.importResume;
};

export const useImportResume = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: importResumeFn,
  } = useMutation({
    mutationFn: importResume,
    onSuccess: (data) => {
      queryClient.setQueryData<ResumeDto>(["resume", { id: data.id }], data);

      queryClient.setQueryData<ResumeDto[]>(["resumes"], (cache) => {
        if (!cache) return [data];
        return [...cache, data];
      });
    },
  });

  return { importResume: importResumeFn, loading, error };
};
