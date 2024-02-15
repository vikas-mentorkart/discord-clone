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
    const { conversationId } = req.query;

    if (!profile) return res.status(401).json({ error: "Unauthorized" });
    if (!conversationId)
      return res.status(400).json({ error: "Conversation ID required" });

    if (!content) return res.status(400).json({ error: "Content required" });

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation)
      return res.status(404).json({ error: "Conversation not found" });

    const member =
      conversation?.memberOne?.profileId == profile.id
        ? conversation?.memberOne
        : conversation?.memberTwo;
    
    if(!member)return res.status(404).json({error: "Member not found"});

     const message = await db.directMessage.create({
       data: {
         content,
         fileUrl,
         conversationId: conversationId as string,
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
    
    const channelKey = `chat:${conversationId}:messages`;
    
    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message)
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
