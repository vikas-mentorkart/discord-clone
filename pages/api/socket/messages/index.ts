import { db } from "@/lib/db";
import { getAuthProfile } from "@/lib/getAuthProfile";
import { socketIOResponse } from "@/types";
import { Member } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: socketIOResponse
) {
  if (req.method !== "POST")
    return res.status(400).json({ error: "Methoed not allowed" });
  try {
    const profile = await getAuthProfile(req);
    const { content, fileUrl } = req.body;
    const { serverId, channelId } = req.query;

    if (!profile) return res.status(401).json({ error: "Unauthorized" });
    if (!serverId) return res.status(400).json({ error: "Server ID required" });
    if (!channelId)
      return res.status(400).json({ error: "Channel ID required" });
    if (!content) return res.status(400).json({ error: "Content required" });

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });
    if (!server) return res.status(404).json({ error: "Server not found" });

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });
    if (!channel) return res.status(404).json({ error: "channel not found" });

    const member = server.members.find(
      (member: Member) => member.profileId == profile.id
    );
    if (!member) return res.status(404).json({ error: "member not found" });

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
    
    const channelKey = `chat:${channelId}:messages`;
    
    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message)
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
