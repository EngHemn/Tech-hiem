import { lang } from "@/get-data/firebase";

export async function uploadImage(file: File): Promise<string> {
  try {
    const locale = lang();
    const formData = new FormData();
    formData.append("file", file);

    const fetchOptions: RequestInit = {
      method: "POST",
      credentials: "include",
      body: formData,
    };

    const response = await fetch("/api/upload-image", fetchOptions);

    if (!response.ok) {
      let errorMessage = "Failed to upload image";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
        if (response.status === 401) {
          errorMessage = "Unauthorized. Please sign in to upload images.";
        } else if (response.status === 400) {
          errorMessage = errorData.error || "Invalid file. Please check file type and size.";
        } else if (response.status === 500) {
          errorMessage = errorData.error || "Server error. Please try again later.";
        }
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const { url } = data;
    if (!url) {
      throw new Error("No URL received from server");
    }
    return url;
  } catch (error: any) {
    console.error("Error uploading image:", error);
    throw new Error(error.message || "Failed to upload image. Please try again.");
  }
}
