import type { UserDto } from "@active-resume/dto";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { axios } from "@/client/libs/axios";
import { useAuthStore } from "@/client/stores/auth";
import { GraphQLResponse } from "@active-resume/utils";

export const fetchUser = async () => {
  const response = await axios.post<GraphQLResponse<UserDto>>("/graphql", {
    query: `
        query {
          me {
            id
            email
            username
            name
            locale
            picture
            emailVerified
            twoFactorEnabled
          }
        }`,
  });

  return response.data.data?.me;
};

export const useUser = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const {
    error,
    isPending: loading,
    data: user,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  useEffect(() => {
    setUser(user ?? null);
  }, [user, setUser]);

  return { user: user, loading, error };
};
