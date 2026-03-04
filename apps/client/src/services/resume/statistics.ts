import type { StatisticsDto } from "@active-resume/dto";
import { useQuery } from "@tanstack/react-query";

import { RESUME_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";
import { GraphQLResponse } from "@active-resume/utils";

export const findResumeStatisticsById = async (data: { id: string }) => {
  const response = await axios.post<GraphQLResponse<StatisticsDto>>(`/graphql?id=${data.id}`, {
    query: `
          query {
            statistics {
              views
              downloads
            }
          }
        `,
  });

  return response.data.data.statistics;
};

export const useResumeStatistics = (id: string, enabled = false) => {
  const {
    error,
    isPending: loading,
    data: statistics,
  } = useQuery({
    queryKey: [...RESUME_KEY, "statistics", id],
    queryFn: () => findResumeStatisticsById({ id }),
    enabled,
  });

  return { statistics, loading, error };
};
