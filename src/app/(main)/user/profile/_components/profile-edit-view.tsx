"use client";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useUpdateUser, UseUpdateUserProps } from "@/hooks/use-update-user";
import { useUploadImage } from "@/hooks/use-upload-image";

import { userProfileSchema } from "@/schema/user-profile";

import { ImagePlus, Loader2, SaveIcon, UserIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileViewProps } from "./profile";

type FormType = z.infer<typeof userProfileSchema>

export const ProfileEditView = (params: ProfileViewProps & Pick<UseUpdateUserProps, "onSuccess">) => {
  const { userData: user, onSuccess } = params

  const [previewImage, setPreviewImage] = React.useState<string | null>(user.image || null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  //* hooks to change user data
  const { uploadImage, isUploading } = useUploadImage({
    userId: user.id,
  })
  const { updateUser, isUpdatePending } = useUpdateUser({
    userId: user.id,
    onSuccess
  })

  //* set up form
  const form = useForm<FormType>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      displayName: user.displayUsername || "",
      imageFile: undefined,
    },
  })

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    form.setValue("imageFile", file, { shouldValidate: true })

    //* preview image
    const fileReader = new FileReader()
    fileReader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === "string") setPreviewImage(result)
    }
    fileReader.readAsDataURL(file)
  }

  const clearImage = () => {
    form.setValue("imageFile", undefined)
    setPreviewImage(user.image || null)

    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  //* on submit
  async function onSubmit(values: FormType) {
    if (isUpdatePending || isUploading) return

    try {
      //* upload image if provided
      let imageUrl: string | null = null
      if (values.imageFile) {
        imageUrl = await uploadImage(values.imageFile)
        if (!imageUrl) {
          toast.error("Failed to upload image. Please try again.")
          return
        }
      }

      if (values.displayName !== user.displayUsername || imageUrl) {
        updateUser({
          ...(values.displayName !== user.displayUsername ? { username: values.displayName } : {}),
          ...(imageUrl ? { image: imageUrl } : {})
        })
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
      console.error(error)
    }
  }

  const imageFile = form.watch("imageFile") as File | undefined

  return (
    <div className="space-y-6">
      {/* Image upload section */}
      <div className="flex flex-col items-center space-y-2">
        <div className="relative">

          <Avatar className="size-24">
            <AvatarImage src={previewImage ?? user.image ?? ""} alt="Profile" />
            {!user.image && <AvatarFallback><UserIcon className="size-12" /></AvatarFallback>}
          </Avatar>

          {imageFile && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="-top-2 -right-2 absolute rounded-full w-6 h-6"
              onClick={clearImage}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center">
          <label
            htmlFor="imageUpload"
            className="flex items-center gap-2 p-2 text-muted-foreground text-sm hover:text-foreground cursor-pointer"
          >
            <ImagePlus className="w-4 h-4" /> Change profile picture
          </label>
          <input
            id="imageUpload"
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleImageChange}
            disabled={isUploading || isUpdatePending}
          />
        </div>

        {form.formState.errors.imageFile && (
          <p className="text-destructive text-sm">{form.formState.errors.imageFile.message}</p>
        )}
      </div>

      {/* Form for profile data */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
                </FormControl>
                <FormDescription className="text-xs">
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isUpdatePending || isUploading}
            >
              {isUpdatePending || isUploading
                ? <Loader2 className="animate-spin" />
                : <SaveIcon />
              }
              {isUploading
                ? "Uploading..."
                : isUpdatePending
                  ? "Saving..."
                  : "Save"
              }
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
