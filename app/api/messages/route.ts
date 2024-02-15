import { NextResponse } from "next/server";
import { Message } from "@prisma/client";

import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";

const MESSAGE_LIMIT = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }
    let messages: Message[] = [];

    if (cursor) {
      if (cursor == "1") {
        messages = await db.message.findMany({
          take: MESSAGE_LIMIT,
          where: {
            channelId,
          },
          include: {
            member: {
              include: {
                profile: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      } else {
        messages = await db.message.findMany({
          take: MESSAGE_LIMIT,
          skip: 1,
          cursor: {
            id: cursor,
          },
          where: {
            channelId,
          },
          include: {
            member: {
              include: {
                profile: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      }
    }

    let nextCursor = null;

    if (messages.length === MESSAGE_LIMIT)
      nextCursor = messages[MESSAGE_LIMIT - 1].id;

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
