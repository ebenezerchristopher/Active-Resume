export interface GraphQLResponse<T> {
  data?: {
    [key: string]: T; // The actual data payload from your GraphQL query/mutation
  };
}
