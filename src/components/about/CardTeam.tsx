import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit2, Trash2 } from "lucide-react";

const CardTeam = ({
  name,
  role,
  description,
  imageUrl,
  onEdit,
  onDelete,
  isDashboard,
}: {
  name: string;
  role: string;
  description: string;
  imageUrl: string;
  isDashboard: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
}) => {
  // Animation Variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    hover: { y: -4, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      id={name}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, amount: 0.2 }}
    >
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardContent className="flex flex-col items-center justify-center gap-3 p-6">
          {/* Profile Picture */}
          <motion.div
            className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-primary/20 shadow-md"
            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
          >
            <Image
              src={imageUrl || "/user.png"}
              alt={name || "Team Member"}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 128px, 144px"
            />
          </motion.div>

          {/* Name */}
          <motion.h2
            className="text-lg font-bold text-gray-900 dark:text-white text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {name || "Name"}
          </motion.h2>

          {/* Role */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-block px-3 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full">
              {role || "Role not specified"}
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-sm text-gray-600 dark:text-gray-400 text-center line-clamp-3 mt-2 min-h-[3rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {description || "No description provided."}
          </motion.p>

          {/* Dashboard Buttons */}
          {isDashboard && (
            <motion.div
              className="flex gap-2 mt-4 w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                onClick={onEdit}
                size="sm"
                className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
              <Button
                onClick={onDelete}
                size="sm"
                className="flex-1 gap-2 bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CardTeam;
