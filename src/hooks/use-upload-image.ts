import React from "react";

import { toast } from "sonner";

type UseUploadImageProps = {
  userId: string;
};

type UploadImageReturn = {
  uploadImage: (file: File) => Promise<string | null>;
  isUploading: boolean;
  uploadError: Error | null;
};

export function useUploadImage({ userId }: UseUploadImageProps): UploadImageReturn {
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<Error | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file) return null;
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);
      
      // Upload the file to your API endpoint
      const response = await fetch("/api/upload/profile-image", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload image");
      }
      
      const data = await response.json();
      return data.imageUrl; // Return the URL of the uploaded image
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload image";
      setUploadError(error instanceof Error ? error : new Error(errorMessage));
      toast.error(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  return {
    uploadImage,
    isUploading,
    uploadError,
  };
}