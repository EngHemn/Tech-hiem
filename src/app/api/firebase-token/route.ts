import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "tech-hiem",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };

  if (serviceAccount.clientEmail && serviceAccount.privateKey) {
    try {
      initializeApp({
        credential: cert(serviceAccount as any),
      });
    } catch (error) {
      console.error("Failed to initialize Firebase Admin:", error);
    }
  } else {
    console.warn(
      "Firebase Admin not initialized: Missing FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY"
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    // Check if Firebase Admin is initialized
    if (getApps().length === 0) {
      return NextResponse.json(
        {
          error:
            "Firebase Admin not configured. Please set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY environment variables.",
        },
        { status: 500 }
      );
    }

    // Get Firebase Admin Auth
    const adminAuth = getAuth();

    // Create a custom token for the user
    // Use Clerk userId as the Firebase UID
    const customToken = await adminAuth.createCustomToken(userId);

    return NextResponse.json({ token: customToken });
  } catch (error: any) {
    console.error("Failed to create Firebase token:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to create Firebase token",
      },
      { status: 500 }
    );
  }
}
