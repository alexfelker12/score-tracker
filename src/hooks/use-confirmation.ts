import { useConfirmationStore } from "@/store/confirmationStore";

export function useConfirmation() {
  const { isOpen, data, openConfirmation, confirm } = useConfirmationStore();

  return {
    isConfirmationOpen: isOpen,
    confirmationData: data,
    showConfirmation: openConfirmation,
    handleConfirm: confirm,
  };
}
