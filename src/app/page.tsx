import Hero from "@/components/home/Hero";
import ExamCountdown from "@/components/home/ExamCountdown";
import StatsBar from "@/components/home/StatsBar";
import SubjectCarousel from "@/components/home/SubjectCarousel";
import QuickActions from "@/components/home/QuickActions";
import FeatureList from "@/components/home/FeatureList";
import DailyQuizWrapper from "@/components/home/DailyQuizWrapper";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ExamCountdown />
      <StatsBar />
      <SubjectCarousel />
      <QuickActions />
      <FeatureList />
      <DailyQuizWrapper />
    </>
  );
}
