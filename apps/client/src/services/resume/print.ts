import { t } from "@lingui/core/macro";
import type { UrlDto } from "@active-resume/dto";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/client/hooks/use-toast";
import { axios } from "@/client/libs/axios";
import { GraphQLResponse } from "@active-resume/utils";

export const printResume = async (data: { id: string }) => {
  const response = await axios.post<GraphQLResponse<UrlDto>>(`/graphql?id=${data.id}`, {
    query: `
      query {
        printResume {
          url
        }
      }
    `,
  });

  return response.data.data.printResume;
};

export const usePrintResume = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: printResumeFn,
  } = useMutation({
    mutationFn: printResume,
    onError: (error) => {
      const message = error.message;

      toast({
        variant: "error",
        title: t`Oops, the server returned an error.`,
        description: message,
      });
    },
  });

  return { printResume: printResumeFn, loading, error };
};
