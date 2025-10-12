import { useMutation } from "@tanstack/react-query";
import { axios } from "@client/libs/axios";
import { GraphQLResponse } from "@active-resume/utils";

/**
 * Uploads an image using the GraphQL multipart request specification.
 * This specification describes how to send files to a GraphQL server using multipart/form-data.
 *
 * @see https://github.com/jaydenseric/graphql-multipart-request-spec
 */
export const uploadImage = (file: File) => {
  const formData = new FormData();

  const mutation = `
      mutation ($file: Upload!) {
         image(file: $file)
      }`;

  const operations = {
    query: mutation,
    variables: {
      // The file variable is set to null in the operations
      file: null,
    },
  };

  // 3. Create the map
  // It maps the file in the form data to the 'variables.file' key
  const map = {
    "0": ["variables.file"],
  };

  // 4. Append the parts to the FormData object
  formData.append("operations", JSON.stringify(operations));
  formData.append("map", JSON.stringify(map));
  formData.append("0", file, file.name); // '0' is the key from the map, file is the Blob

  return axios.post<GraphQLResponse<string>>("/graphql", formData, {
    headers: {
      "apollo-require-preflight": "true",
    },
  });
};

export const useUploadImage = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: uploadImageFn,
  } = useMutation({
    mutationFn: uploadImage,
  });

  return { uploadImage: uploadImageFn, loading, error };
};
