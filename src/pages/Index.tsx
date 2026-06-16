import { RizzNav } from "@/components/rizz/layout/RizzNav";
import { RizzFooter } from "@/components/rizz/layout/RizzFooter";
import { CornerShine } from "@/components/rizz/ui/CornerShine";
import { RizzSeo } from "@/components/rizz/RizzSeo";
import { HeroSection } from "@/components/rizz/sections/HeroSection";
import { ProofSection } from "@/components/rizz/sections/ProofSection";
import { HowWeGetYouThereSection } from "@/components/rizz/sections/HowWeGetYouThereSection";
import { PortfolioSection } from "@/components/rizz/sections/PortfolioSection";
import { TestimonialsSection } from "@/components/rizz/sections/TestimonialsSection";
import { FoundersSection } from "@/components/rizz/sections/FoundersSection";
import { FinalCtaSection } from "@/components/rizz/sections/FinalCtaSection";
import { useSiteContent } from "@/contexts/SiteContentContext";

const Index = () => {
  const { isLoading } = useSiteContent();
  if (isLoading) return null;
  return (
    <>
      <RizzSeo />
      <CornerShine />
      <RizzNav />
      <main className="relative z-10">
        <HeroSection />
        <ProofSection />
        <HowWeGetYouThereSection />
        <PortfolioSection />
        <TestimonialsSection />
        <FoundersSection />
        <FinalCtaSection />
      </main>
      <RizzFooter />
    </>
  );
};

export default Index;
