import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { getFirebaseClients } from "./firebase";

export type TeamMember = {
  id: string;
  name: string;
  title?: string;
  phone?: string;
  email?: string;
  description?: string;
  image?: string;
  url?: string;
  order?: number;
  visible?: boolean; // default: true
};

type CreateTeamMember = Omit<TeamMember, "id">;

const COLLECTION = "team";

export async function getAllTeamMembersFromDb(): Promise<TeamMember[]> {
  const { db } = getFirebaseClients();
  const q = query(collection(db, COLLECTION));
  const snap = await getDocs(q);
  const items: TeamMember[] = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<TeamMember, "id">),
  }));
  items.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
  return items.filter((m) => m.visible !== false);
}

// Admin variant: returns all, including hidden
export async function getAllTeamMembersFromDbAdmin(): Promise<TeamMember[]> {
  const { db } = getFirebaseClients();
  const q = query(collection(db, COLLECTION));
  const snap = await getDocs(q);
  const items: TeamMember[] = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<TeamMember, "id">),
  }));
  items.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
  return items;
}

export async function createTeamMember(
  data: CreateTeamMember
): Promise<TeamMember> {
  const { db } = getFirebaseClients();
  const newRef = doc(collection(db, COLLECTION));
  const payload: CreateTeamMember = {
    visible: true,
    ...data,
  };
  // remove undefined fields to avoid Firestore errors
  const sanitized = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== undefined)
  ) as CreateTeamMember;
  await setDoc(newRef, sanitized);
  return { id: newRef.id, ...(sanitized as CreateTeamMember) } as TeamMember;
}

export async function updateTeamMember(
  id: string,
  data: Partial<CreateTeamMember>
): Promise<void> {
  const { db } = getFirebaseClients();
  const ref = doc(collection(db, COLLECTION), id);
  // remove undefined fields to avoid Firestore errors
  const sanitized = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  ) as Partial<CreateTeamMember>;
  await updateDoc(ref, sanitized as any);
}

export async function deleteTeamMember(id: string): Promise<void> {
  const { db } = getFirebaseClients();
  const ref = doc(collection(db, COLLECTION), id);
  await deleteDoc(ref);
}
