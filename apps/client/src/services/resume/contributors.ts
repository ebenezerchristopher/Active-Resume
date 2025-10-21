import type { ContributorDto } from "@active-resume/dto";
import { useQuery } from "@tanstack/react-query";

import { axios } from "@/client/libs/axios";
import { GraphQLResponse } from "@active-resume/utils";

export const fetchGitHubContributors = async () => {
  const response = await axios.post<GraphQLResponse<ContributorDto[]>>(`/graphql`, {
    query: "query { github { id name url avatar } }",
  });

  return response.data.data?.github;
};

export const fetchCrowdinContributors = async () => {
  const response = await axios.post<GraphQLResponse<ContributorDto[]>>(`/graphql`, {
    query: "query { crowdin { id name url avatar } }",
  });

  return response.data.data?.crowdin;
};

export const useContributors = () => {
  const {
    error: githubError,
    isPending: githubLoading,
    data: github,
  } = useQuery({
    queryKey: ["contributors", "github"],
    queryFn: fetchGitHubContributors,
  });

  const {
    error: crowdinError,
    isPending: crowdinLoading,
    data: crowdin,
  } = useQuery({
    queryKey: ["contributors", "crowdin"],
    queryFn: fetchCrowdinContributors,
  });

  const error = githubError ?? crowdinError;
  const loading = githubLoading || crowdinLoading;

  return { github, crowdin, loading, error };
};
