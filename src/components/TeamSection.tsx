"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getAllTeamMembersFromDb, type TeamMember } from "@/lib/team";

export default function TeamSection() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllTeamMembersFromDb();
        setTeam(data);
      } catch (err: unknown) {
        const msg =
          typeof err === "object" && err && "message" in err
            ? String((err as { message?: unknown }).message ?? "Veri alınamadı")
            : "Veri alınamadı";
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return null;
  if (error) return null;
  if (team.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ekibimiz
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Deneyimli ve uzman kadromuz ile size en iyi hizmeti sunuyoruz
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="relative h-64">
                <Image
                  src={
                    m.image && m.image.trim() !== ""
                      ? m.image
                      : "/images/no-image.png"
                  }
                  alt={`${m.name} - ${m.title ?? "Ekip Üyesi"}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {m.name}
                </h3>
                {m.title && (
                  <p className="text-blue-600 font-medium mb-2">{m.title}</p>
                )}
                {m.description && (
                  <p className="text-gray-600 text-sm">{m.description}</p>
                )}
                <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                  {m.phone && (
                    <a
                      href={`tel:${m.phone}`}
                      className="text-gray-700 hover:text-gray-900"
                    >
                      {m.phone}
                    </a>
                  )}
                  {m.email && (
                    <a
                      href={`mailto:${m.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {m.email}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
