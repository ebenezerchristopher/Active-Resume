import type { ResumeDto } from "@active-resume/dto";
import { useQuery } from "@tanstack/react-query";
import { RESUMES_KEY } from "@/client/constants/query-keys";
import { axios } from "@/client/libs/axios";
import { GraphQLResponse } from "@active-resume/utils";

export const fetchResumes = async () => {
  const response = await axios.post<GraphQLResponse<ResumeDto[]>>("/graphql", {
    query: `
      query {
        resume {
          id
          title
          slug
          data
          visibility
          locked
          userId
          createdAt
          updatedAt
        }
      }
    `,
  });

  return response.data.data.resume;
};

export const useResumes = () => {
  const {
    error,
    isPending: loading,
    data: resumes,
  } = useQuery({
    queryKey: RESUMES_KEY,
    queryFn: fetchResumes,
  });

  return { resumes, loading, error };
};
