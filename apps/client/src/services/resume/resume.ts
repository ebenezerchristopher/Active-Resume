import type { ResumeDto } from "@active-resume/dto";

import { axios } from "@/client/libs/axios";
import { GraphQLResponse } from "@active-resume/utils";

export const findResumeById = async (data: { id: string }) => {
  const response = await axios.post<GraphQLResponse<ResumeDto>>(`/graphql?id=${data.id}`, {
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

export const findResumeByUsernameSlug = async (data: { username: string; slug: string }) => {
  const response = await axios.post<GraphQLResponse<ResumeDto>>(
    `/graphql?username=${data.username}&slug=${data.slug}`,
    {
      query: `
            query  {
                public {
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
    },
  );

  return response.data.data.public;
};
