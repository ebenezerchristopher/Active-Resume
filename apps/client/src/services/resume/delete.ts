import type { DeleteResumeDto, ResumeDto } from "@active-resume/dto";
import { useMutation } from "@tanstack/react-query";
import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";
import { GraphQLResponse } from "@active-resume/utils";

export const deleteResume = async (data: DeleteResumeDto) => {
  const response = await axios.post<GraphQLResponse<ResumeDto>>(`/graphql?id=${data.id}`, {
    query: `
                 mutation  {
                  deleteResume {
                      id
                 }
         `,
    variables: { data },
  });

  return response.data.data.deleteResume;
};

export const useDeleteResume = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: deleteResumeFn,
  } = useMutation({
    mutationFn: deleteResume,
    onSuccess: (data) => {
      queryClient.removeQueries({ queryKey: ["resume", data.id] });

      queryClient.setQueryData<ResumeDto[]>(["resumes"], (cache) => {
        if (!cache) return [];
        return cache.filter((resume) => resume.id !== data.id);
      });
    },
  });

  return { deleteResume: deleteResumeFn, loading, error };
};
