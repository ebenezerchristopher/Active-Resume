import type { AuthProvidersDto } from "@active-resume/dto";
import { useQuery } from "@tanstack/react-query";

import { AUTH_PROVIDERS_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";
import { GraphQLResponse } from "@active-resume/utils";

export const getAuthProviders = async () => {
  const response = await axios.post<GraphQLResponse<AuthProvidersDto>>(`/graphql`, {
    query: "query { providers }",
  });

  return response.data.data?.providers;
};

export const useAuthProviders = () => {
  const {
    error,
    isPending: loading,
    data: providers,
  } = useQuery({
    queryKey: [AUTH_PROVIDERS_KEY],
    queryFn: getAuthProviders,
  });

  return { providers, loading, error };
};
