import { useNukeConfirmationStore, useLastActionConfirmationStore } from "@/store/confirmationStore";

export function useNukeConfirmation() {
  const { isOpen, data, openConfirmation, confirm } = useNukeConfirmationStore();

  return {
    isConfirmationOpen: isOpen,
    confirmationData: data,
    showNukeConfirmation: openConfirmation,
    handleConfirm: confirm,
  };
}

export function useLastActionConfirmation() {
  const { isOpen, data, openConfirmation, confirm, cancel } = useLastActionConfirmationStore();

  return {
    isConfirmationOpen: isOpen,
    confirmationData: data,
    showLastActionConfirmation: openConfirmation,
    handleConfirm: confirm,
    handleCancel: cancel,
  };
}
