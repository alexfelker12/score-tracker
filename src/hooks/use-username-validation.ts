import { validateUsername } from "@/lib/utils";
import { useState } from "react";

export function useUsernameValidation() {
  const [error, setError] = useState<string | undefined>();
  const [isValid, setIsValid] = useState<boolean>(true);

  function validate(username: string) {
    const { valid, reason } = validateUsername(username)

    if (valid) {
      setIsValid(true);
      setError(undefined);
      return true
    } else {
      setIsValid(false);
      setError(reason);
      return false
    }
  }

  return { isValid, error, validate };
}
