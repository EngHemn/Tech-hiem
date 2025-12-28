"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SearchUserProps } from "@/lib/action";

interface UserResultsProps {
  users: SearchUserProps[];
  searchQuery: string;
}

const UserResults: React.FC<UserResultsProps> = ({ users, searchQuery }) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No users found for &quot;{searchQuery}&quot;
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {users.map((user) => (
        <Link
          key={user.id}
          href={`/dashboard/user/${user.id}`}
          className="block p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-3">
            <Image
              src={user.image || "/user.png"}
              alt={user.name}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-16 text-gray-900 dark:text-white">
                {user.name}
              </h4>
              <p className="text-14 text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default UserResults;
