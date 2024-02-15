import { ModeToggle } from "@/components/toggleMode";
import { UserButton } from "@clerk/nextjs";
import { initialProfile } from "@/lib/initialProfile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { InitialModal } from "@/components/modals/initalModal";
const Page =async () => {
  const profile = await initialProfile();
  const server = await db.server.findFirst({
    where:{
      members:{
        some:{
          profileId:profile.id
        }
      }
    }
  })
  if(server)redirect(`/servers/${server.id}`)
  
  return <InitialModal />
}

export default Page;
// export default function Home() {
//   return (
//     <div>
//       <p className="text-3xl font-bold text-indigo-500">discord clone</p>
//       <UserButton afterSignOutUrl="/">Submit</UserButton>
//       <ModeToggle />
//     </div>
//   );
// }
