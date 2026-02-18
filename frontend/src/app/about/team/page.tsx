import { TeamGrid } from "@/components/team/TeamGrid";
import { getTeamMembers } from "@/lib/wordpress/queries";

export default async function TeamPage() {
  const teamResult = await getTeamMembers();

  return (
    <section className="section-space">
      <div className="site-container">
        <h1 className="text-4xl font-bold text-foreground">Our Team</h1>
        <p className="mt-4 text-text-muted">
          Meet the engineers behind SEC. Click any team member for full bio,
          credentials, notable projects, and direct contact.
        </p>

        {!teamResult.configured ? (
          <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-white p-4 text-sm text-text-muted">
            WordPress is not configured yet. Add `WORDPRESS_BASE_URL` to
            `frontend/.env.local`.
          </div>
        ) : null}

        {teamResult.error ? (
          <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-white p-4 text-sm text-text-muted">
            {teamResult.error}
          </div>
        ) : null}

        {teamResult.members.length ? (
          <TeamGrid members={teamResult.members} />
        ) : (
          <div className="mt-8 card">
            <p className="text-text-muted">
              No team members found. Add records in WordPress `team-members`.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
