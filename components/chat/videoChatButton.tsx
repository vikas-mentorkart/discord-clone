"use client";

import queryString from "query-string";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { VideoOff, Video } from "lucide-react";

import TooltipAction from "../tooltipAction";

export const VideoChatButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isVideo = searchParams?.get("video");
  const label = isVideo ? "Start video call" : "End video call";

  const handleClick = () => {
    const url = queryString.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      {
        skipNull: true,
      }
    );
    router.push(url);
  };
  return (
    <TooltipAction side="bottom" label={label}>
      <button
        onClick={handleClick}
        className="hover:opacity-75 transition mr-4"
      >
        {isVideo ? (
          <VideoOff className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
        ) : (
          <Video className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
        )}
      </button>
    </TooltipAction>
  );
};
