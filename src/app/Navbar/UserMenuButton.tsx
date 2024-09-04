"use client";
import { Session } from "next-auth";
import Image from "next/image";
import { HiDotsVertical } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { signIn, signOut } from "next-auth/react";

interface UserMenuButtonProps {
  session: Session | null;
}

const UserMenuButton = ({ session }: UserMenuButtonProps) => {
  const user = session?.user;
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle">
        {user ? (
          user.image ? (
            <Image
              src={user.image}
              alt="Profile Picture"
              width={40}
              height={40}
              className="w-10 rounded-full"
            />
          ) : (
            <CgProfile />
          )
        ) : (
          <HiDotsVertical />
        )}
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu rounded-box menu-sm z-30 mt-3 w-52 bg-base-100 p-2 shadow"
      >
        <li>
          {user ? (
            <button onClick={() => signOut({ callbackUrl: "/" })}>
              SignOut
            </button>
          ) : (
            <button onClick={() => signIn()}>SignIn</button>
          )}
        </li>
      </ul>
    </div>
  );
};

export default UserMenuButton;
