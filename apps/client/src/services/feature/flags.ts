import type { FeatureDto } from "@active-resume/dto";
import { useQuery } from "@tanstack/react-query";

import { axios } from "@client/libs/axios";
import { GraphQLResponse } from "@active-resume/utils";

export const fetchFeatureFlags = async () => {
  const response = await axios.post<GraphQLResponse<FeatureDto>>(`/graphql`, {
    query: `query FeatureFlags {
      featureFlags {
        isSignupsDisabled
        isEmailAuthDisabled
      }
    }`,
  });

  return response.data.data?.featureFlags;
};

export const useFeatureFlags = () => {
  const {
    error,
    isPending: loading,
    data: flags,
  } = useQuery({
    queryKey: ["feature_flags"],
    queryFn: () => fetchFeatureFlags(),
    refetchOnMount: "always",
    initialData: {
      isSignupsDisabled: false,
      isEmailAuthDisabled: false,
    },
  });

  return { flags, loading, error };
};
