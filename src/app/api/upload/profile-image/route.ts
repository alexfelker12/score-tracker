import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { del, put } from '@vercel/blob';

import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // verify the user is authenticated
    const session = await auth.api.getSession({
      headers: await headers()
    });
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    if (!userId || userId !== session.user.id) {
      return NextResponse.json(
        { message: "Invalid user ID" },
        { status: 403 }
      );
    }

    // validate file size - max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Invalid file type. Only JPEG, PNG, WEBP and GIF are allowed" },
        { status: 400 }
      );
    }

    //* if user has a profile picture try to delete it first to free up space
    if (session.user.image && session.user.image.includes('vercel-blob.com')) {
      try {
        const url = new URL(session.user.image);
        const pathname = url.pathname;
        await del(pathname);
      } catch (error) {
        //* if delete fails continue anyway
        console.log(error)
      }
    }

    //* generate a unique filename for new profile picture
    const fileExtension = file.name.split('.').pop();
    const filename = `profile-images/${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExtension}`;

    const arrayBuffer = await file.arrayBuffer();
    const blob = await put(filename, arrayBuffer, {
      access: 'public',
      contentType: file.type,
    });

    return NextResponse.json({ imageUrl: blob.url });

  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { message: "Failed to upload image" },
      { status: 500 }
    );
  }
}

// Limit the size of the request to 10MB to allow for some overhead
export const config = {
  runtime: 'edge',
}
