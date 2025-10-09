"use client";

import { Input } from "@/components/ui/input";

import { useUsernameValidation } from "@/hooks/use-username-validation";
import { useProfileContext } from "./ProfileContext";


type ProfileUsernameProps = React.ComponentProps<"span">
export const ProfileUsername = ({ }: ProfileUsernameProps) => {
  const { user, disabled, isEditing } = useProfileContext()
  const currentUsername = user.displayUsername || user.name

  const { isValid, error, validate } = useUsernameValidation()

  if (!isEditing && !isValid) {
    validate(currentUsername) // reset validation with current (valid) username
  }

  return (
    <div className="inline-flex flex-col gap-y-0.5">
      {isEditing
        ? <>
          <Input
            id="newUsername"
            name="newUsername"
            autoComplete="off"
            defaultValue={currentUsername}
            onInput={e => validate(e.currentTarget.value)}
            aria-invalid={!isValid}
            disabled={disabled}
            className="px-1 py-0.5 h-7 font-bold text-xl align-middle"
          />
          {!isValid && <span className="text-destructive text-sm">{error}</span>}
        </>
        : <span className="font-bold text-xl">{currentUsername}</span>
      }
    </div>
  );
}
