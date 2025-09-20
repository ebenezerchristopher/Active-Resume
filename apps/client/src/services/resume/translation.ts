import type { Language, GraphQLResponse } from "@active-resume/utils";
import { useQuery } from "@tanstack/react-query";

import { LANGUAGES_KEY } from "@client/constants/query-keys";
import { axios } from "@client/libs/axios";

export const fetchLanguages = async () => {
  const response = await axios.post<GraphQLResponse<Language[]>>(`/graphql`, {
    query: "query Languages { languages { id name locale editorCode progress } }",
  });

  return response.data.data?.languages;
};

export const useLanguages = () => {
  const {
    error,
    isPending: loading,
    data: languages,
  } = useQuery({
    queryKey: [LANGUAGES_KEY],
    queryFn: fetchLanguages,
  });

  return { languages: languages ?? [], loading, error };
};
