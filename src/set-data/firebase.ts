import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  query,
  getDocs,
  where,
  orderBy,
} from "firebase/firestore";
import { app, db } from "@/config/firebaseConfig";
import {
  contactUSProps,
  teamProps,
  faqProps,
  favorite,
  blogFavriteProps,
  UserType,
  OrderType,
  BlogProps,
  ProductFormInput,
  catagoryProps,
} from "@/types";

export const addProduct = async (data: any, isProduction: boolean) => {
  try {
    const docRef = await addDoc(
      collection(db, isProduction ? "Products" : "PrivateProducts"),
      data
    );
    return docRef.id;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const updateProduct = async (id: string, data: any) => {
  try {
    await updateDoc(doc(db, "Products", id), data);
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const setUser = async (user: UserType) => {
  if (!user?.id) return;
  const sanitizedUser = {
    id: user.id,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    fullName: user.fullName || "",
    username: user.username || "",
    emailAddresses:
      user.emailAddresses?.map((email) => email.emailAddress) || [],
    primaryEmailAddressId: user.primaryEmailAddressId || "",
  };
  try {
    const userRef = doc(db, "user", user.id);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, sanitizedUser);
      await addDoc(collection(db, "notifications_admin"), {
        type: "order",
        action: "added",
        userId: user.id,
        userName: user.fullName,
        createdAt: new Date(),
        read: false,
        message: `New user registered: ${user.fullName}`,
      });
    }
  } catch (error) {
    console.error("Error saving user or notification:", error);
  }
};

export const setOrder = async (order: OrderType): Promise<string> => {
  type quantity = { id: string; quantitiy: number }[];
  let update: quantity = [];
  order.orderItems.map((item) => {
    let sum = 0;
    order.orderItems.filter((orderitem) =>
      orderitem.name === item.name ? (sum += orderitem.quantity) : null
    );
    let itemupdate = { id: item.id, quantitiy: sum };
    if (!update.some((itemupdateed) => itemupdateed.id === item.id)) {
      update.push(itemupdate);
    }
  });
  try {
    const refSendData = await addDoc(collection(db, "order"), {
      address: {
        city: order.address.city || "",
        region: order.address.region || "",
        streetName: order.address.streetName || "",
      },
      email: order.email.map((email) => email.emailAddress) || [],
      fullName: order.fullName || "",
      orderDate: new Date(),
      orderItems: order.orderItems.map((item) => ({
        name: item.name || "",
        id: item.id || "",
        discount: item.discount || 0,
        price: item.price || 0,
        colors: {
          name: item.colors.name || "",
          color: item.colors.color || "",
        },
        quantity: item.quantity || 0,
        image: item.image || "",
      })),
      phoneNumber: order.phoneNumber || "",
      totalAmount: order.totalAmount || 0,
      totaldiscountPrice: order.totaldiscountPrice || 0,
      userId: order.userId || "",
      note: order.note || "",
      view: order.view,
    });

    update.forEach(async (item) => {
      const getitem = await getDoc(doc(db, "Products", item.id));
      const currentNumberSale = getitem.exists() ? getitem.data()?.numberSale || 0 : 0;
      await updateDoc(doc(db, "Products", item.id), {
        numberSale: item.quantitiy + currentNumberSale,
      });
    });

    await addDoc(collection(db, "notifications_admin"), {
      type: "order",
      action: "added",
      orderId: refSendData.id,
      userId: order.userId,
      userName: order.fullName,
      createdAt: new Date(),
      read: false,
      timestamp: new Date(),
      message: `New order received from ${order.fullName} for $${order.totalAmount}`,
    });
    return refSendData.id;
  } catch (error) {
    console.error("Error saving order:", error);
    throw error;
  }
};

export const deleteProducts = async (id: string) => {
  await deleteDoc(doc(db, "Products", id)).catch((error) => {
    console.error("Error removing document: ", error);
  });
};

export const addContactUs = async ({
  title,
  formMessage,
  imageUrl,
}: contactUSProps): Promise<string> => {
  const refSet = await addDoc(collection(db, "ContactUs"), {
    title,
    formMessage,
    imageUrl,
  });
  return refSet.id;
};

export const deleteContactUs = async (id: string) => {
  await deleteDoc(doc(db, "ContactUs", id));
};

export const UpdateContactUUs = async ({
  title,
  formMessage,
  imageUrl,
  id,
}: contactUSProps) => {
  if (!id) return;
  await updateDoc(doc(db, "ContactUs", id), {
    title,
    formMessage,
    imageUrl,
  });
};

export const setAbouut = async (
  imageUrl: string,
  description: string,
  descriptions: { title: string; description: string }[]
) => {
  await setDoc(doc(db, "aboutUs", "about"), {
    descriptions,
    imageUrl,
    description,
  });
};

export const updateAbout = async (
  imageUrl: string,
  description: string,
  descriptions: { title: string; description: string }[]
) => {
  await updateDoc(doc(db, "aboutUs", "about"), {
    descriptions,
    imageUrl,
    description,
  });
};

export const setMemeber = async (
  fullName: string,
  position: string,
  description: string,
  imageUrl: string
) => {
  await addDoc(collection(db, "team"), {
    fullName,
    position,
    numOfSearch: Math.floor(Math.random() * 100),
    description,
    imageUrl,
  });
};

export const deleteTeam = async (id: string) => {
  await deleteDoc(doc(db, "team", id));
};

export const UpdateTeam = async ({
  description,
  imageUrl,
  fullName,
  position,
  id,
}: teamProps) => {
  if (!id) return;
  await updateDoc(doc(db, "team", id), {
    fullName,
    position,
    description,
    imageUrl,
  });
};

export const addFAQ = async (
  category: string,
  questionAndAnswer: { question: string; answer: string }[]
) => {
  await addDoc(collection(db, "FAQ"), {
    category,
    questionAndAnswer,
  });
};

export const deleteFAQ = async (id: string) => {
  await deleteDoc(doc(db, "FAQ", id));
};

export const updateFAQ = async ({ item }: { item: faqProps }) => {
  if (!item.id) return;
  await updateDoc(doc(db, "FAQ", item.id), {
    questionAndAnswer: item.questionAndAnswer,
    category: item.category,
  });
};

export const setComments = async ({
  comments,
  id,
}: {
  comments: any;
  id: string;
}) => {
  const docRef = doc(db, "blogs", id);
  await updateDoc(docRef, {
    comments: arrayUnion({ ...comments }),
  });
};

export async function clear_data_user({
  table,
  userid,
}: {
  table: string;
  userid: string;
}) {
  if (table !== "order") {
    try {
      const userDocRef = doc(db, table, userid);
      const itemsCollectionRef = collection(userDocRef, "items");
      const itemsSnapshot = await getDocs(itemsCollectionRef);
      const deletePromises = itemsSnapshot.docs.map((itemDoc) =>
        deleteDoc(itemDoc.ref)
      );
      await Promise.all(deletePromises);
      await deleteDoc(userDocRef);
    } catch (error) {
      console.error("Error deleting user and items:", error);
    }
  } else {
    const q = query(collection(db, "order"), where("userId", "==", userid));
    const qSnapshot = await getDocs(q);
    qSnapshot.forEach(async (item) => {
      await deleteDoc(doc(db, "order", item.id));
    });
  }
}

export const deleteBlog = async (id: string) => {
  try {
    await deleteDoc(doc(db, "blogs", id));
  } catch (error) {
    console.error("Error deleting blog:", error);
  }
};

export const markNotificationAsRead = async (id: string) => {
  try {
    await updateDoc(doc(db, "notifications_admin", id), {
      read: true,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const notificationsRef = doc(db, "notifications_admin");
    await updateDoc(notificationsRef, {
      read: true,
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
  }
};

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
    const itemsRef = collection(db, "favorite", id, "items");
    const querySnapshot = await getDocs(itemsRef);
    const nmf = (item.numberFavorite || 0) + 1;
    if (!querySnapshot.empty) {
      await updateDoc(doc(db, "Products", item.id), {
        numberFavorite: nmf,
      });
      await setDoc(doc(db, "favorite", id, "items", item.id), {
        ...item,
        numberFavorite: nmf,
      });
    } else {
      await updateDoc(doc(db, "Products", item.id), {
        numberFavorite: nmf,
      });
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

export const deleteFavorite = async (
  userId: string,
  numberFavorite: number,
  id: string,
  userName: string
) => {
  try {
    await deleteDoc(doc(db, "favorite", userId, "items", id));
    const nmf = numberFavorite - 1;
    await updateDoc(doc(db, "Products", id), {
      numberFavorite: nmf,
    });
    await setDoc(doc(db, "notifications_admin", id), {
      type: "favorite",
      action: "removed",
      userId: userId,
      userName: userName,
      productId: id,
      message: `${userName} removed ${id} from favorites`,
      timestamp: new Date(),
      read: false,
    });
  } catch (error) {
    console.error("Error deleting favorite item:", error);
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
    await deleteDoc(doc(db, "saveBlog", userId, "items", id));
    const nmf = numberOffavorites - 1;
    await updateDoc(doc(db, "blogs", id), {
      numberOffavorites: nmf,
    });
    await setDoc(doc(db, "notifications_admin", id), {
      type: "saved_blog",
      action: "removed",
      userId: userId,
      userName,
      blogId: id,
      message: `${userName} removed ${id} from saved blogs`,
      timestamp: new Date(),
      read: false,
    });
  } catch (error) {
    console.error("Error deleting favorite item:", error);
  }
};

export const addBlog = async (blogData: Partial<BlogProps>) => {
  try {
    const docRef = await addDoc(collection(db, "blogs"), {
      ...blogData,
      date: new Date(),
      numberOfLikes: Math.floor(Math.random() * 100),
      numberOfDislikes: 0,
      numberOfComments: 0,
      comments: [],
      numberOfViews: 0,
      numberOffavorites: 0,
      numberOfSearches: Math.floor(Math.random() * 100),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding blog:", error);
    throw error;
  }
};

export const updateBlog = async (id: string, blogData: Partial<BlogProps>) => {
  try {
    await updateDoc(doc(db, "blogs", id), {
      ...blogData,
      date: new Date(),
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
};

export const deleteProduct = async (
  id: string,
  isPrivate: boolean = false
) => {
  try {
    const collectionName = isPrivate ? "PrivateProducts" : "Products";
    await deleteDoc(doc(db, collectionName, id));
    console.log("Product deleted successfully");
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const updateOrder = async (id: string, data: any) => {
  try {
    const orderRef = doc(db, "order", id);
    await updateDoc(orderRef, data);
    console.log("Order updated successfully");
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

export const addCategory = async (data: catagoryProps) => {
  try {
    await setDoc(doc(db, "category", data.name), data);
    console.log("Category added successfully");
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

export const updateCategory = async (oldName: string, data: catagoryProps) => {
  try {
    if (oldName !== data.name) {
      await deleteDoc(doc(db, "category", oldName));
    }
    await setDoc(doc(db, "category", data.name), data);
    console.log("Category updated successfully");
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (name: string) => {
  try {
    await deleteDoc(doc(db, "category", name));
    console.log("Category deleted successfully");
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
export const createNotification = async (data: any) => {
  try {
    await addDoc(collection(db, "notifications"), {
      ...data,
      timestamp: new Date(),
      seen: false,
    });
    console.log("Notification created successfully");
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

export const search_setting = async ({
  userid,
  search,
}: {
  userid?: string;
  search: ("category" | "product" | "blog" | "team_member")[];
}) => {
  if (!userid) {
    if (typeof window !== "undefined") {
      localStorage.setItem("search", JSON.stringify({ search }));
    }
  } else {
    try {
      const docRef = doc(db, "searchSetting", userid);
      await setDoc(docRef, { search }, { merge: true });
    } catch (error) {}
  }
};
