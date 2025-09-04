import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
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

export async function createTeamMember(
  data: CreateTeamMember
): Promise<TeamMember> {
  const { db } = getFirebaseClients();
  const newRef = doc(collection(db, COLLECTION));
  const payload: CreateTeamMember = {
    visible: true,
    ...data,
  };
  const { setDoc } = await import("firebase/firestore");
  await setDoc(newRef, payload);
  return { id: newRef.id, ...(payload as CreateTeamMember) } as TeamMember;
}

export async function updateTeamMember(
  id: string,
  data: Partial<CreateTeamMember>
): Promise<void> {
  const { db } = getFirebaseClients();
  const ref = doc(collection(db, COLLECTION), id);
  await updateDoc(ref, data as any);
}

export async function deleteTeamMember(id: string): Promise<void> {
  const { db } = getFirebaseClients();
  const ref = doc(collection(db, COLLECTION), id);
  await deleteDoc(ref);
}
