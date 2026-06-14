import { SERVICES } from "@/data/rizz-mock";
import { EyebrowLabel } from "@/components/rizz/ui/EyebrowLabel";
import { RizzCard } from "@/components/rizz/ui/RizzCard";
import { SectionWrapper } from "@/components/rizz/ui/SectionWrapper";
import { cn } from "@/lib/utils";

export const ServicesSection = () => (
  <section id="services" className="py-28 px-6 bg-[#030712]">
    <div className="mx-auto max-w-[1440px]">
      <SectionWrapper>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
          <div>
            <EyebrowLabel>Offers / Capabilities</EyebrowLabel>
            <h2
              className="font-semibold uppercase text-[#F5F7FA] leading-[0.95]"
              style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)", letterSpacing: "-0.05em" }}
            >
              FOUR WAYS WE
              <br />
              <span className="rizz-title-accent">GET YOU THERE.</span>
            </h2>
          </div>
          <p className="text-[#A7B0C0] text-lg leading-relaxed max-w-sm lg:text-right">
            We don't just make content. We build systems and stories that move
            Attention into Trust — and Trust into Clients.
          </p>
        </div>
      </SectionWrapper>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SERVICES.map((service, i) => (
          <SectionWrapper key={service.number} delay={i * 0.1}>
            <RizzCard className="overflow-hidden h-full flex flex-col">
              {/* Image / gradient area */}
              <div
                className={cn(
                  "h-48 bg-gradient-to-br flex items-center justify-center",
                  service.gradient
                )}
              >
                <span className="text-[#F5F7FA]/10 font-semibold select-none" style={{ fontSize: "6rem", letterSpacing: "-0.1em" }}>
                  {service.number}
                </span>
              </div>
              <div className="p-7 flex flex-col gap-3 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-[#187BFF] font-bold text-sm uppercase tracking-[0.25em]">
                    {service.number}
                  </span>
                  <span className="text-[#1D2B3E] text-lg">{service.icon}</span>
                </div>
                <h3 className="text-[#F5F7FA] font-bold text-lg leading-snug">
                  {service.title}
                </h3>
                <p className="text-[#A7B0C0] text-sm leading-relaxed">{service.description}</p>
              </div>
            </RizzCard>
          </SectionWrapper>
        ))}
      </div>

      <SectionWrapper delay={0.4} className="mt-12 text-center">
        <a href="#contact" className="rizz-btn-primary inline-flex py-4 px-10 text-base">
          Start Building Your System →
        </a>
      </SectionWrapper>
    </div>
  </section>
);
