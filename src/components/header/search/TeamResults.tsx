"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SearchTeamProps } from "@/lib/action";

interface TeamResultsProps {
  team: SearchTeamProps[];
  searchQuery: string;
  onClose?: () => void;
}

const TeamResults: React.FC<TeamResultsProps> = ({
  team,
  searchQuery,
  onClose,
}) => {
  if (team.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No team members found for &quot;{searchQuery}&quot;
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {team.map((member) => (
        <Link
          key={member.id}
          href={`/About#team`}
          className="block p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          onClick={onClose}
        >
          <div className="flex items-center gap-3">
            {member.imageUrl && (
              <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={member.imageUrl}
                  alt={member.fullName}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-16 text-gray-900 dark:text-white">
                {member.fullName}
              </h4>
              {member.description && (
                <p className="text-[14px] line-clamp-1 text-gray-500 dark:text-gray-400 mt-1">
                  {member.description}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {member.numOfSearch} searches
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TeamResults;
