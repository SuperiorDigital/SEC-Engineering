"use client";

import { useMemo, useState } from "react";
import type { TeamMemberModel } from "@/lib/wordpress/types";

type TeamGridProps = {
  members: TeamMemberModel[];
};

function formatYears(value?: number): string {
  if (!value || value <= 0) {
    return "Not provided";
  }

  return `${value} ${value === 1 ? "year" : "years"}`;
}

export function TeamGrid({ members }: TeamGridProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

  const selectedMember = useMemo(
    () => members.find((member) => member.id === selectedMemberId) ?? null,
    [members, selectedMemberId]
  );

  return (
    <>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {members.map((member) => (
          <button
            type="button"
            key={member.id}
            onClick={() => setSelectedMemberId(member.id)}
            className="card text-left"
          >
            <div
              role="img"
              aria-label={`${member.name} headshot`}
              className="aspect-square w-full rounded-[var(--radius-md)] border border-border bg-cover bg-center"
              style={{
                backgroundImage: `url('${
                  member.headshotImage || "/placeholders/headshot-1x1.svg"
                }')`,
              }}
            />
            <h2 className="mt-4 text-lg font-semibold text-foreground">{member.name}</h2>
            <p className="mt-1 text-sm text-text-muted">{member.jobTitle}</p>
            <p className="mt-3 text-xs text-text-muted">
              {member.credentials.length
                ? member.credentials.join(" • ")
                : "Credentials pending"}
            </p>
            <p className="mt-3 text-sm font-semibold text-primary">View Profile</p>
          </button>
        ))}
      </div>

      {selectedMember ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="team-member-title"
        >
          <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-[var(--radius-lg)] border border-border bg-white p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="team-member-title" className="text-2xl font-semibold text-foreground">
                  {selectedMember.name}
                </h2>
                <p className="mt-1 text-text-muted">{selectedMember.jobTitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMemberId(null)}
                className="button-secondary"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <div
                  role="img"
                  aria-label={`${selectedMember.name} profile photo`}
                  className="aspect-square w-full rounded-[var(--radius-md)] border border-border bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${
                      selectedMember.headshotImage || "/placeholders/headshot-1x1.svg"
                    }')`,
                  }}
                />
              </div>

              <div className="lg:col-span-8">
                <p className="text-text-muted">{selectedMember.bio}</p>

                <dl className="mt-5 space-y-3 text-sm text-text-muted">
                  <div>
                    <dt className="font-semibold text-foreground">Credentials</dt>
                    <dd>
                      {selectedMember.credentials.length
                        ? selectedMember.credentials.join(", ")
                        : "Not provided"}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">Years with Company</dt>
                    <dd>{formatYears(selectedMember.yearsWithCompany)}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">Notable Projects</dt>
                    <dd>
                      {selectedMember.notableProjects.length
                        ? selectedMember.notableProjects.join(", ")
                        : "Not provided"}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 flex flex-wrap gap-3">
                  {selectedMember.email ? (
                    <a
                      href={`mailto:${selectedMember.email}`}
                      className="button-primary"
                    >
                      Email {selectedMember.name.split(" ")[0]}
                    </a>
                  ) : null}

                  {selectedMember.linkedinUrl ? (
                    <a
                      href={selectedMember.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="button-secondary"
                    >
                      LinkedIn
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
