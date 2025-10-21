import type { ResumeDto } from "@active-resume/dto";
import { useMutation } from "@tanstack/react-query";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

type LockResumeArgs = {
  id: string;
  set: boolean;
};

export const lockResume = async ({ id, set }: LockResumeArgs) => {
  const response = await axios.post(`/graphql?id=${id}`, {
    query: `
        mutation ($set: Boolean!) {
            lockResume(set: $set) {
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
    variables: { set },
  });

  return response.data.data.lockResume;
};

export const useLockResume = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: lockResumeFn,
  } = useMutation({
    mutationFn: lockResume,
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

  return { lockResume: lockResumeFn, loading, error };
};
