import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  serverTimestamp,
  type Timestamp,
  type FieldValue,
} from "firebase/firestore";
import { getFirebaseClients } from "./firebase";

export type Announcement = {
  id: string;
  title: string;
  content?: string;
  visible?: boolean; // default true
  createdAt?: Timestamp; // Firestore Timestamp
};

type CreateAnnouncement = Omit<Announcement, "id" | "createdAt"> & {
  createdAt?: Timestamp | FieldValue;
};

const COLLECTION = "announcements";

export async function getAllAnnouncementsFromDbAdmin(): Promise<
  Announcement[]
> {
  const { db } = getFirebaseClients();
  const q = query(collection(db, COLLECTION));
  const snap = await getDocs(q);
  const items: Announcement[] = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Announcement, "id">),
  }));
  // Newest first by createdAt if exists
  items.sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() ?? 0;
    const tb = b.createdAt?.toMillis?.() ?? 0;
    return tb - ta;
  });
  return items;
}

export async function getVisibleAnnouncementsFromDb(): Promise<Announcement[]> {
  const { db } = getFirebaseClients();
  const q = query(collection(db, COLLECTION));
  const snap = await getDocs(q);
  const items: Announcement[] = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Announcement, "id">),
  }));

  // Filter only visible announcements
  const visibleItems = items.filter((item) => item.visible !== false);

  // Newest first by createdAt if exists
  visibleItems.sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() ?? 0;
    const tb = b.createdAt?.toMillis?.() ?? 0;
    return tb - ta;
  });

  return visibleItems;
}

export async function createAnnouncement(
  data: CreateAnnouncement
): Promise<Announcement> {
  const { db } = getFirebaseClients();
  const newRef = doc(collection(db, COLLECTION));
  const payload: CreateAnnouncement = {
    visible: true,
    createdAt: serverTimestamp(),
    ...data,
  };
  const sanitized = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== undefined)
  ) as CreateAnnouncement;
  await setDoc(newRef, sanitized);
  return {
    id: newRef.id,
    ...(sanitized as CreateAnnouncement),
  } as Announcement;
}

export async function updateAnnouncement(
  id: string,
  data: Partial<CreateAnnouncement>
): Promise<void> {
  const { db } = getFirebaseClients();
  const ref = doc(collection(db, COLLECTION), id);
  const sanitized = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  ) as Partial<CreateAnnouncement>;
  await updateDoc(ref, sanitized);
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const { db } = getFirebaseClients();
  const ref = doc(collection(db, COLLECTION), id);
  await deleteDoc(ref);
}
