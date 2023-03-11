import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { api } from "~/utils/api";

export default function useDeleteDocument() {
  const queryClient = useQueryClient();
  const documentMutation = api.document.deleteOne.useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries(
        getQueryKey(api.document.getAllUserDocuments)
      );
    },
  });
  return documentMutation;
}
