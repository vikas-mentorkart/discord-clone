import { redirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/currentProfile";
import React from "react";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
interface serverPageProps {
  params: {
    serverId: string;
  };
}
const ServerPage = async ({ params }: serverPageProps) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();
  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const generalChannel =  server?.channels[0];
  if (generalChannel?.name == "general")
    return redirect(
      `/servers/${params?.serverId}/channels/${generalChannel?.id}`
    );
  return null;
};

export default ServerPage;
