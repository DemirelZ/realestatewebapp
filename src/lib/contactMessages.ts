import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebaseClients } from "./firebase";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt?: Date;
  read?: boolean;
};

export async function createContactMessage(
  data: Omit<ContactMessage, "id" | "createdAt">
): Promise<void> {
  const { db } = getFirebaseClients();
  await addDoc(collection(db, "contactMessages"), {
    ...data,
    createdAt: serverTimestamp(),
    read: false,
  });
}

export async function getAllContactMessages(): Promise<ContactMessage[]> {
  const { db } = getFirebaseClients();
  const q = query(
    collection(db, "contactMessages"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as any;
    return {
      id: d.id,
      name: data.name ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      subject: data.subject ?? "",
      message: data.message ?? "",
      createdAt: data.createdAt?.toDate?.() ?? undefined,
      read: Boolean(data.read),
    } as ContactMessage;
  });
}

export async function updateContactMessage(
  id: string,
  data: Partial<Omit<ContactMessage, "id">>
): Promise<void> {
  const { db } = getFirebaseClients();
  const { doc, updateDoc } = await import("firebase/firestore");
  await updateDoc(doc(db, "contactMessages", id), data as any);
}

export async function deleteContactMessage(id: string): Promise<void> {
  const { db } = getFirebaseClients();
  const { doc, deleteDoc } = await import("firebase/firestore");
  await deleteDoc(doc(db, "contactMessages", id));
}
