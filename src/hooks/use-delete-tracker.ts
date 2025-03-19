import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/get-query-client";

import { deleteTracker } from "@/server/actions/trackerActions";

export type UseHandleDeleteFunc = (trackerId: string) => void


export const useDeleteTracker = () => {
  const qc = getQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteTracker,
    onSettled: (data, error) => {
      if (!error && data) {
        toast.success("Tracker was deleted successfully")
        qc.invalidateQueries({ queryKey: ["trackers"] })
      }
    },
  })

  const handleDelete: UseHandleDeleteFunc = (id) => {
    mutate(id)
  }

  return { deleteTracker: handleDelete, isDeletePending: isPending }
}
