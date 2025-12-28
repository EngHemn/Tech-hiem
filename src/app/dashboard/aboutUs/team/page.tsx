"use client";
import CardTeam from "@/components/about/CardTeam";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  deleteTeam,
  setMemeber,
  UpdateTeam,
  uploadImage,
} from "@/lib/action/uploadimage";
import { teamProps } from "@/lib/action";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { getAllTeam } from "@/lib/action/dashboard";
import { Loader2, Upload, X } from "lucide-react";

const Page = () => {
  const reffullName = React.useRef<HTMLInputElement>(null);
  const refposition = React.useRef<HTMLInputElement>(null);
  const refdescription = React.useRef<HTMLTextAreaElement>(null);
  const [imagePreview, setimagePreview] = useState<File | null>(null);
  const [imageUrl, setimageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, seterror] = useState({
    fullName: "",
    position: "",
    description: "",
    imageUrl: "",
  });

  const [id, setid] = useState("");
  const { toast } = useToast();
  const [team, setteam] = useState<teamProps[]>([]);

  const validation = z.object({
    fullName: z.string().min(1, "Please enter full name"),
    position: z.string().min(1, "Please enter position"),
    description: z.string().min(1, "Please enter description"),
    imageUrl: z.string().min(1, "Please upload image"),
  });

  const handleUploadimage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const imagedowlad = await uploadImage(file);
      setimageUrl(imagedowlad);
      setimagePreview(file);
      seterror((prev) => ({ ...prev, imageUrl: "" }));
    } catch (error) {
      toast({
        title: "Error uploading image",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setimageUrl("");
    setid("");
    setimagePreview(null);
    seterror({
      fullName: "",
      position: "",
      description: "",
      imageUrl: "",
    });
    if (reffullName.current) reffullName.current.value = "";
    if (refposition.current) refposition.current.value = "";
    if (refdescription.current) refdescription.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    seterror({
      fullName: "",
      position: "",
      description: "",
      imageUrl: "",
    });

    const validate = validation.safeParse({
      fullName: reffullName.current?.value || "",
      position: refposition.current?.value || "",
      description: refdescription.current?.value || "",
      imageUrl: imageUrl,
    });

    if (!validate.success) {
      validate.error.errors.forEach((err) => {
        seterror((prev) => ({
          ...prev,
          [err.path[0] as string]: err.message,
        }));
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (id) {
        await UpdateTeam({
          id: id,
          fullName: reffullName.current!.value,
          position: refposition.current!.value,
          description: refdescription.current!.value,
          imageUrl: imageUrl,
        });

        setteam((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  fullName: reffullName.current!.value,
                  position: refposition.current!.value,
                  description: refdescription.current!.value,
                  imageUrl: imageUrl,
                }
              : item
          )
        );

        toast({
          title: "Member updated successfully",
          description: "The team member has been updated.",
        });
      } else {
        await setMemeber(
          reffullName.current!.value,
          refposition.current!.value,
          refdescription.current!.value,
          imageUrl
        );

        const newMember: teamProps = {
          id: `temp-${Date.now()}`,
          description: refdescription.current!.value,
          fullName: reffullName.current!.value,
          imageUrl: imageUrl,
          position: refposition.current!.value,
        };

        setteam((pre) => [...pre, newMember]);
        toast({
          title: "Member added successfully",
          description: "The team member has been added.",
        });
      }
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: teamProps) => {
    if (refdescription.current) refdescription.current.value = item.description;
    if (refposition.current) refposition.current.value = item.position;
    if (reffullName.current) reffullName.current.value = item.fullName;
    setimageUrl(item.imageUrl);
    setimagePreview(null);
    setid(item.id);
    seterror({
      fullName: "",
      position: "",
      description: "",
      imageUrl: "",
    });
    // Scroll to form
    document
      .getElementById("team-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (itemId: string) => {
    try {
      await deleteTeam(itemId);
      setteam((prev) => prev.filter((i) => i.id !== itemId));
      toast({
        title: "Member deleted successfully",
        description: "The team member has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete member. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const getdata = async () => {
      try {
        const data = await getAllTeam();
        setteam(data);
      } catch (error) {
        toast({
          title: "Error loading team",
          description: "Failed to load team members.",
          variant: "destructive",
        });
      }
    };
    getdata();
  }, [toast]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Team Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your team members and their information
          </p>
        </div>

        {/* Team Members Grid */}
        {team.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Team Members ({team.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {team.map((item) => (
                <CardTeam
                  key={item.id}
                  name={item.fullName}
                  description={item.description}
                  imageUrl={item.imageUrl}
                  role={item.position}
                  isDashboard={true}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => handleDelete(item.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <Card className="mb-12">
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No team members yet. Add your first member below.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Add/Edit Form */}
        <Card id="team-form" className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">
              {id ? "Edit Team Member" : "Add New Team Member"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload Section */}
              <div className="flex flex-col items-center">
                <label
                  htmlFor="image-upload"
                  className="relative flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary transition-all duration-200 bg-gray-50 dark:bg-gray-800 overflow-hidden group"
                >
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <span className="mt-2 text-sm text-gray-500">
                        Uploading...
                      </span>
                    </div>
                  ) : imagePreview || imageUrl ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={imageUrl || URL.createObjectURL(imagePreview!)}
                        alt="Uploaded Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setimageUrl("");
                          setimagePreview(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-4">
                      <Upload className="w-10 h-10 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500 text-center font-medium">
                        Click to Upload Image
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        PNG, JPG, WEBP
                      </span>
                    </div>
                  )}
                </label>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadimage}
                  disabled={isLoading}
                />
                {error.imageUrl && (
                  <p className="text-red-500 text-sm mt-2">{error.imageUrl}</p>
                )}
              </div>

              {/* Full Name Input */}
              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  id="fullName"
                  ref={reffullName}
                  placeholder="Enter full name"
                  className="w-full"
                  disabled={isSubmitting}
                />
                {error.fullName && (
                  <p className="text-red-500 text-sm">{error.fullName}</p>
                )}
              </div>

              {/* Position Input */}
              <div className="space-y-2">
                <label
                  htmlFor="position"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Position <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  id="position"
                  ref={refposition}
                  placeholder="Enter position (e.g., CEO, Developer)"
                  className="w-full"
                  disabled={isSubmitting}
                />
                {error.position && (
                  <p className="text-red-500 text-sm">{error.position}</p>
                )}
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  placeholder="Enter description"
                  rows={4}
                  ref={refdescription}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  disabled={isSubmitting}
                />
                {error.description && (
                  <p className="text-red-500 text-sm">{error.description}</p>
                )}
              </div>
              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4">
                {id && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={isSubmitting}
                    className="min-w-[220px] border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="min-w-[120px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {id ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>{id ? "Update Member" : "Add Member"}</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
