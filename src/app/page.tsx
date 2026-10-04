import { Suspense } from "react";
import { LeftNavbar } from "@/components/layout/LeftNavbar";
import { SplashScreen } from "@/components/layout/SplashScreen";
import { Footer } from "@/components/layout/Footer";
import { AboutSection } from "@/components/sections/AboutSection";
import { CertificatesSection } from "@/components/sections/CertificatesSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import {
  getCertificates,
  getExperiences,
  getProjects,
  getSettings,
  getSongs,
  getSkills,
} from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const [settings, projects, skills, certificates, experiences, songs] = await Promise.all([
    getSettings(),
    getProjects(),
    getSkills(),
    getCertificates(),
    getExperiences(),
    getSongs(),
  ]);

  return (
    <>
      <SplashScreen />

      <LeftNavbar />

      {/* Editorial page frame: left rail on desktop, top padding on mobile */}
      <div className="relative lg:pl-[260px]">
        {/* Fixed editorial side label */}
        <div className="pointer-events-none fixed bottom-10 right-8 hidden xl:block">
          <span className="eyebrow rotate-180 text-[0.58rem] [writing-mode:vertical-rl]">
            {settings["site.major"] ?? "Software Engineering"}
          </span>
        </div>

        <div className="mx-auto w-full max-w-[1180px] px-5 pb-20 pt-24 sm:px-8 lg:px-12 lg:pt-16">
          <HeroSection
            tagline={settings["site.tagline"]}
            owner={settings["site.owner"]}
            major={settings["site.major"]}
          />

          <AboutSection
            bio={settings["profile.bio"]}
            photo={settings["profile.photo"]}
            name={settings["site.owner"]}
            major={settings["site.major"]}
            experiences={experiences}
            songs={songs}
          />

          <ProjectsSection projects={projects} />

          <SkillsSection skills={skills} />

          <CertificatesSection certificates={certificates} />

          <Suspense fallback={null}>
            <Footer settings={settings} />
          </Suspense>
        </div>
      </div>
    </>
  );
}