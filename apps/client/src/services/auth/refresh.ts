import type { AuthResponseDto } from "@active-resume/dto";
import { GraphQLResponse } from "@active-resume/utils";
import type { AxiosInstance } from "axios";

export const refreshToken = async (axios: AxiosInstance) => {
  const response = await axios.post<GraphQLResponse<AuthResponseDto>>("/graphql", {
    query: `
      mutation {
        refresh {
          status
          user {
            id
            email
            name
            username
            locale
            provider}}}`,
  });

  return response.data.data?.refresh;
};
