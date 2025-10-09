"use client";

import { AnimatePresence, motion } from "motion/react";
import { type ChangeEvent, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { CropIcon, RotateCcwIcon, Trash2Icon, UploadIcon, UserIcon, XIcon } from "lucide-react";

import { ImageZoom } from "@/components/kibo-ui/image-zoom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ImageCrop, ImageCropApply, ImageCropContent, ImageCropReset } from "@/components/kibo-ui/image-crop";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useProfileContext } from "./ProfileContext";


type ProfileImageProps = React.ComponentProps<typeof Avatar>
export const ProfileImage = ({ className }: ProfileImageProps) => {
  const {
    user, disabled, isEditing,
    croppedImage, setCroppedImage,
    deleteImage, setDeleteImage
  } = useProfileContext()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const selectFileRef = useRef<HTMLInputElement>(null)
  const cropResetRef = useRef<HTMLButtonElement>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setCroppedImage(undefined)
      setDeleteImage(false)
    }
  };

  const handleReset = () => {
    setSelectedFile(null)
    setCroppedImage(undefined)
    setDeleteImage(false)
  };

  if (!isEditing && deleteImage) {
    setTimeout(() => {
      setDeleteImage(false)
    }, 0)
  }

  const cropDialogOpen = !!(selectedFile && !croppedImage)
  const setCropDialogOpen = (open: boolean) => {
    if (!open) handleReset()
  }

  return (
    <>
      {/* delete & upload image buttons */}
      <AnimatePresence>
        {isEditing &&
          <div className="-left-10 z-[5] absolute flex flex-col gap-y-1">
            {/* remove image */}
            <motion.button
              // animation
              initial={{ x: 72, y: 20, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 100 }}
              exit={{ x: 72, y: 20, opacity: 0 }}
              transition={{ bounce: false }}
              // base props
              type="button"
              onClick={() => {
                setCroppedImage(undefined)
                setDeleteImage(true)
              }}
              className={cn(buttonVariants({ size: "icon", variant: "destructive" }),
                "rounded-full"
              )}
              disabled={disabled || !user.image || !!croppedImage || deleteImage}
            >
              <Trash2Icon />
            </motion.button>

            {/* upload new image */}
            <motion.button
              // animation
              initial={{ x: 72, y: -20, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 100 }}
              exit={{ x: 72, y: -20, opacity: 0 }}
              transition={{ bounce: false }}
              // base props
              type="button"
              onClick={() => {
                if (!selectFileRef.current) return;
                selectFileRef.current.click()
              }}
              className={cn(buttonVariants({ size: "icon", variant: "secondary" }),
                "rounded-full"
              )}
              disabled={disabled || !!croppedImage}
            >
              <UploadIcon />
            </motion.button>
          </div>
        }
      </AnimatePresence>

      {/* cropped image (preview) */}
      <ImageZoom className={cn(
        "hidden",
        croppedImage && "block"
      )}>
        <Avatar className={cn("z-10 size-full", className)}>
          <AvatarImage src={croppedImage || undefined} alt={user.displayUsername || user.name} />
          <AvatarFallback><UserIcon className="size-1/2" /></AvatarFallback>
        </Avatar>

        {/* delete cropped image */}
        <Button
          type="button"
          size="icon"
          variant="destructive"
          className="top-0 right-0 z-20 absolute rounded-full size-6"
          onClick={handleReset}
        >
          <XIcon className="size-3.5" />
        </Button>
      </ImageZoom>

      {/* current user image */}
      <ImageZoom className={cn(
        "hidden",
        (!croppedImage && user.image && !deleteImage) && "block"
      )}>
        <Avatar className={cn("z-10 size-full", className)}>
          <AvatarImage src={user.image || undefined} alt={user.displayUsername || user.name} />
          {!user.image && <AvatarFallback><UserIcon className="size-1/2" /></AvatarFallback>}
        </Avatar>
      </ImageZoom>

      {/* when having no profile picture or deleting it */}
      <Avatar className={cn(
        "z-10 hidden size-full",
        (!croppedImage && !user.image || deleteImage) && "flex",
        className
      )}>
        <AvatarFallback><UserIcon className="size-1/2" /></AvatarFallback>
      </Avatar>


      {isEditing &&
        <>
          {/* upload image input */}
          <Input
            type="file"
            id="cropingImageHolder"
            autoComplete="off"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            ref={selectFileRef}
            className="hidden"
          />

          {/* image cropping dialog */}
          <Dialog
            open={cropDialogOpen}
            onOpenChange={setCropDialogOpen}
          >
            <DialogContent
              onInteractOutside={(e) => { e.preventDefault() }}
              className="grid grid-cols-[auto-1fr]"
            >
              <DialogHeader>
                <DialogTitle>Profile Picture</DialogTitle>
                <DialogDescription className="sr-only">Crop your new profile picture before before updating your profile</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4 -m-1 p-1 overflow-clip">
                {selectedFile &&
                  <ImageCrop
                    file={selectedFile}
                    aspect={1}
                    circularCrop
                    minWidth={100}
                    minHeight={100}
                    maxImageSize={1024 * 1024 * 5} // 1MB
                    // onChange={console.log}
                    // onComplete={console.log}
                    onCrop={(image) => {
                      if (image !== "data:,") {
                        setCroppedImage(image)
                      } else { // when no crop is set (single click outside crop circle) reset the view to indicate to user, that "empty" crop is not possible
                        cropResetRef.current?.click()
                      }
                    }}
                  >
                    {/*
                    1st with vh - max-h-[calc(100vh-152px)]
                    152px is the height of all "static" height content in and around the dialog content
                    -> very hacky I know but since overflow-clip doesn't set any height that's the only way I found
                    2nd edit - on android chrome the url bar doesn't account for vh calculation so crop actions buttons are hidden
                    -> added 100px to act as a margin for url bars across browsers. Doesn't work for vertically short screens but such short mobile screens should not exist
                    */}
                    <ImageCropContent className="block max-h-[calc(100vh-152px-100px)]" />
                    <div className="flex justify-between items-center gap-4 w-full">
                      <Button
                        onClick={handleReset}
                        size="icon"
                        type="button"
                        variant="secondary"
                      >
                        <XIcon className="size-5" />
                      </Button>
                      <div className="flex gap-2">
                        <ImageCropReset
                          size="default"
                          variant="outline"
                          className="[&_svg]:size-5"
                          ref={cropResetRef}
                        >
                          Reset <RotateCcwIcon className="size-5" />
                        </ImageCropReset>
                        <ImageCropApply
                          size="default"
                          variant="default"
                          className="[&_svg]:size-5"
                        >
                          Confirm <CropIcon className="size-5" />
                        </ImageCropApply>
                      </div>
                    </div>
                  </ImageCrop>
                }
              </div>
            </DialogContent>
          </Dialog>

        </>
      }


    </>
  );
}
