"use client";

import React from "react";

import { useQuery } from "@tanstack/react-query";

import { getUserDataById } from "@/server/actions/user/profile/actions";

import { ProfileWrapperProps } from "../page";


export const ProfileDefaultView = (params: ProfileWrapperProps) => {
  const { session } = params;

  const { data, isPending: isQueryPending, isFetching, refetch } = useQuery({
    queryKey: ["user", session.user.id, "profile"],
    queryFn: () => getUserDataById({ userId: session.user.id }),
    refetchOnMount: false,
    refetchOnReconnect: false
  });

  if (data && data.data) return (
    <>
      <div>
        <p>{data.data.displayUsername || "no username yet"}</p>
        <p>{data.data.image
          ? <img src={data.data.image} alt="profile image" width={40} height={40}></img>
          : "no profile image yet"
        }</p>
      </div>
    </>
  );
}