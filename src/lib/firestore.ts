import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { getFirebaseClients } from "./firebase";
import type { Property } from "@/data/properties";

const COLLECTION = "properties";
type FirestoreProperty = Omit<Property, "id">;

export async function getAllPropertiesFromDb(): Promise<Property[]> {
  const { db } = getFirebaseClients();
  const q = query(collection(db, COLLECTION));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as FirestoreProperty;
    return { id: Number(d.id), ...data } as Property;
  });
}

export async function getPropertyByIdFromDb(
  id: number
): Promise<Property | null> {
  const { db } = getFirebaseClients();
  const ref = doc(db, COLLECTION, String(id));
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data() as FirestoreProperty;
  return { id: Number(snap.id), ...data } as Property;
}

export async function getNextPropertyId(): Promise<number> {
  const items = await getAllPropertiesFromDb();
  const maxId = items.reduce((acc, cur) => (cur.id > acc ? cur.id : acc), 0);
  return maxId + 1;
}

export async function createProperty(
  data: FirestoreProperty & { id?: number }
): Promise<Property> {
  const { db } = getFirebaseClients();
  const id = data.id ?? (await getNextPropertyId());
  const ref = doc(db, COLLECTION, String(id));
  const rest: FirestoreProperty = { ...(data as FirestoreProperty) };
  const { setDoc } = await import("firebase/firestore");
  await setDoc(ref, rest);
  return { id, ...rest } as Property;
}

export async function updateProperty(
  id: number,
  data: Partial<FirestoreProperty>
): Promise<void> {
  const { db } = getFirebaseClients();
  const ref = doc(db, COLLECTION, String(id));
  const copy: Partial<FirestoreProperty> & { id?: number } = {
    ...(data as Partial<FirestoreProperty> & { id?: number }),
  };
  if ("id" in copy) {
    delete copy.id;
  }
  const { updateDoc } = await import("firebase/firestore");
  await updateDoc(ref, copy as Partial<FirestoreProperty>);
}

export async function deleteProperty(id: number): Promise<void> {
  const { db } = getFirebaseClients();
  const ref = doc(db, COLLECTION, String(id));
  const { deleteDoc } = await import("firebase/firestore");
  await deleteDoc(ref);
}
