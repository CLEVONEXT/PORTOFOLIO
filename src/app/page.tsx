import { Suspense } from "react";
import { Navigation } from "@/components/layout/Navigation";
import { SplashScreen } from "@/components/layout/SplashScreen";
import { Footer } from "@/components/layout/Footer";
import { AboutSection } from "@/components/sections/AboutSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsAndStatsSection } from "../components/sections/SkillsAndStatsSection";
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

      <Navigation />

      {/* Centered layout: top padding clears the desktop navbar,
          bottom padding clears the mobile bottom navbar. */}
      <div className="pt-20 lg:pt-24">
        <div className="mx-auto w-full max-w-7xl px-6 pb-28 lg:px-12 lg:pb-16">
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

          <SkillsAndStatsSection skills={skills} certificates={certificates} />

          <Suspense fallback={null}>
            <Footer settings={settings} />
          </Suspense>
        </div>
      </div>
    </>
  );
}