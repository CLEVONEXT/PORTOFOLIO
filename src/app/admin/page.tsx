import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import {
  getAdminCertificates,
  getAdminExperiences,
  getAdminProjects,
  getAdminSkills,
  getAdminSongs,
  getMessages,
  getSettings,
} from "@/lib/data";
import {
  deleteCertificate,
  deleteExperience,
  deleteMessage,
  deleteProject,
  deleteSkill,
  deleteSong,
  markMessageRead,
  reorderSongs,
  saveCertificate,
  saveExperience,
  saveProject,
  saveSkill,
  saveSong,
} from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Console",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const [settings, projects, certificates, experiences, skills, songs, messages] =
    await Promise.all([
      getSettings(),
      getAdminProjects(),
      getAdminCertificates(),
      getAdminExperiences(),
      getAdminSkills(),
      getAdminSongs(),
      getMessages(),
    ]);

  return (
    <AdminDashboard
      user={{ name: session.user.name, email: session.user.email }}
      settings={settings}
      projects={projects}
      certificates={certificates}
      experiences={experiences}
      skills={skills}
      songs={songs}
      messages={messages}
      actions={{
        saveProject,
        deleteProject,
        saveCertificate,
        deleteCertificate,
        saveExperience,
        deleteExperience,
        saveSkill,
        deleteSkill,
        saveSong,
        deleteSong,
        reorderSongs,
        markMessageRead,
        deleteMessage,
      }}
    />
  );
}