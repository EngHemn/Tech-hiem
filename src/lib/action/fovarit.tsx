import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { blogFavriteProps, BlogProps, favorite } from "@/lib/action";
import { app, db } from "@/config/firebaseConfig";

export const addfavorite = async ({
  id,
  item,
  userName,
}: {
  id: string;
  item: favorite;
  userName: string;
}) => {
  try {
    // Reference to the user's `items` subcollection
    const itemsRef = collection(db, "favorite", id, "items");

    // Check if the `items` subcollection has any data
    const querySnapshot = await getDocs(itemsRef);

    const nmf = item.numberFavorite + 1;
    if (!querySnapshot.empty) {
      await updateDoc(doc(db, "Products", item.id), {
        numberFavorite: nmf,
      }).then((res) => {});

      await setDoc(doc(db, "favorite", id, "items", item.id), {
        ...item,
        numberFavorite: nmf,
      });
    } else {
      await updateDoc(doc(db, "Products", item.id), {
        numberFavorite: nmf,
      }).then((res) => {});
      await setDoc(doc(db, "favorite", id, "items", item.id), {
        ...item,
        numberFavorite: nmf,
      });
    }
    await setDoc(doc(db, "notifications_admin", item.id), {
      type: "favorite",
      action: "added",
      userId: id,
      message: `${userName} added ${item.name} to favorites`,
      userName: userName,
      productId: item.id,
      timestamp: new Date(),
      read: false,
    });
  } catch (error) {
    console.error("Error adding favorite item:", error);
  }
};

export const getfavorite = async (userId): Promise<favorite[]> => {
  try {
    // Reference to the user's `items` subcollection
    const itemsRef = collection(db, "favorite", userId, "items");

    // Fetch all documents from the `items` subcollection
    const querySnapshot = await getDocs(itemsRef);

    // Extract data from each document
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as favorite),
    }));

    return items;
  } catch (error) {
    console.error("Error fetching favorite items:", error);
    return [];
  }
};
export const deleteFavorite = async (
  userId: string,
  numberFavorite: number,
  id: string,
  userName: string
) => {
  try {
    await deleteDoc(doc(db, "favorite", userId, "items", id)).then((res) => {});
    const nmf = numberFavorite - 1;
    await updateDoc(doc(db, "Products", id), {
      numberFavorite: nmf,
    }).then((res) => {});
    await setDoc(doc(db, "notifications_admin", id), {
      type: "favorite",
      action: "removed",
      userId: userId,
      userName: userName, // Note: You might want to pass the actual userName as a parameter
      productId: id,
      message: `${userName} removed ${id} from favorites`,
      timestamp: new Date(),
      read: false,
    });
  } catch (error) {
    console.error("Error deleting favorite item:", error);
  }
};
export const getAllItemNames = async (userId: string): Promise<string[]> => {
  if (!userId) return [];
  try {
    const itemsRef = collection(db, "favorite", userId, "items");
    const querySnapshot = await getDocs(itemsRef);
    const itemNames = querySnapshot.docs.map((doc) => doc.id);
    return itemNames;
  } catch (error) {
    console.error("Error fetching item names:", error);
    return [];
  }
};

export const addFavoriteBlog = async ({
  item,
  userName,
}: {
  item: blogFavriteProps;
  userName: string;
}) => {
  try {
    const itemsRef = collection(db, "saveBlog", item.userId, "items");

    const querySnapshot = await getDocs(itemsRef);

    const updatedFavorites = item.numberOffavorites + 1;

    // Update blogs collection
    await updateDoc(doc(db, "blogs", item.blogId), {
      numberOffavorites: updatedFavorites,
    });

    await setDoc(doc(db, "saveBlog", item.userId, "items", item.id), {
      ...item,
      numberOffavorites: updatedFavorites,
    });
    await setDoc(doc(db, "notifications_admin", item.blogId), {
      type: "saved_blog",
      action: "added",
      userId: item.userId,
      userName,
      message: `${userName} added ${item.title} to saved blogs`,
      blogId: item.blogId,
      timestamp: new Date(),
      read: false,
    });
  } catch (error) {
    console.error("Error in addFavoriteBlog function:", error);
  }
};
export const getallsaveid = async (userId: string): Promise<string[]> => {
  try {
    const itemsRef = collection(db, "saveBlog", userId, "items");
    const querySnapshot = await getDocs(itemsRef);
    const itemNames = querySnapshot.docs.map((doc) => doc.id);
    return itemNames;
  } catch (error) {
    console.error("Error fetching item names:", error);
    return [];
  }
};
export const deleteSave = async ({
  id,
  numberOffavorites,
  userId,
  userName,
}: {
  userId: string;
  numberOffavorites: number;
  id: string;
  userName: string;
}) => {
  try {
    await deleteDoc(doc(db, "saveBlog", userId, "items", id)).then((res) => {});
    const nmf = numberOffavorites - 1;
    await updateDoc(doc(db, "blos", id), {
      numberOffavorites: nmf,
    }).then((res) => {});
    await setDoc(doc(db, "notifications_admin", id), {
      type: "saved_blog",
      action: "removed",
      userId: userId,
      userName, // Note: You might want to pass the actual blog title as userName
      blogId: id,
      message: `${userName} removed ${id} from saved blogs`,
      timestamp: new Date(),
      read: false,
    });
  } catch (error) {
    console.error("Error deleting favorite item:", error);
  }
};
export const getSaveBlog = async (userId: any): Promise<blogFavriteProps[]> => {
  try {
    // Reference to the user's `items` subcollection
    const itemsRef = collection(db, "saveBlog", userId, "items");

    // Fetch all documents from the `items` subcollection
    const querySnapshot = await getDocs(itemsRef);

    // Extract data from each document
    const items = querySnapshot.docs.map((doc) => ({
      ...(doc.data() as blogFavriteProps),
      id: doc.id,
    }));
    return items;
  } catch (error) {
    console.error("Error fetching favorite items:", error);
    return [];
  }
};
export const getAllSaveBlog = async (): Promise<blogFavriteProps[]> => {
  try {
    const itemsRef = collection(db, "saveBlog", "items");
    const querySnapshot = await getDocs(itemsRef);
    const item: blogFavriteProps[] = [];
    const items = querySnapshot.docs.map((doc) =>
      item.push({ ...(doc.data() as blogFavriteProps), id: doc.id })
    );

    return item;
  } catch (error) {
    console.error("Error fetching favorite items:", error);
    return [];
  }
};
