import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Logout from "./auth/Logout";
import getServerUser from "@/helpers/getServerUser";

export default async function Navbar() {
  const user = await getServerUser();

  return (
    <div className="bg-zinc-900">
      <div className="w-full flex justify-between py-3 px-6 bg-zinc-900 border-b-1 border-b-slate-100 shadow-xl container">
        <div className="flex items-center">
          <div className="text-white font-bold text-xl">Nyayanidhi</div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarFallback>
                {user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-rose-500 font-semibold cursor-pointer">
              <Logout />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
