import { PROCESS_STEPS } from "@/data/rizz-mock";
import { EyebrowLabel } from "@/components/rizz/ui/EyebrowLabel";
import { SectionWrapper } from "@/components/rizz/ui/SectionWrapper";

export const ProcessSection = () => (
  <section id="process" className="py-28 px-6 bg-[#030712]">
    <div className="mx-auto max-w-[1440px]">
      <SectionWrapper>
        <EyebrowLabel>Our Process</EyebrowLabel>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
          <h2
            className="font-semibold uppercase text-[#F5F7FA] leading-[0.95]"
            style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)", letterSpacing: "-0.05em" }}
          >
            HOW WE WORK, FROM
            <br />
            <span className="rizz-title-accent">FIRST CALL TO LIVE CONTENT.</span>
          </h2>
          <p className="text-[#A7B0C0] text-lg max-w-sm italic">
            "Content shouldn't be random.
            <br />
            It should compound."
          </p>
        </div>
      </SectionWrapper>

      {/* Desktop: horizontal timeline */}
      <div className="hidden lg:flex items-start gap-0">
        {PROCESS_STEPS.map((step, i) => (
          <SectionWrapper key={step.step} delay={i * 0.1} className="flex-1 flex items-start gap-0">
            <div className="flex-1">
              <div className="flex items-center gap-0 mb-6">
                <div className="w-12 h-12 rounded-full border-2 border-[#187BFF] flex items-center justify-center text-[#187BFF] font-bold text-sm shrink-0">
                  {step.step}
                </div>
                {i < PROCESS_STEPS.length - 1 && (
                  <div className="flex-1 h-px bg-[#1D2B3E]" />
                )}
              </div>
              <div className="pr-6">
                <h3 className="text-[#F5F7FA] font-bold text-base uppercase tracking-wide mb-2">
                  {step.title}
                </h3>
                <p className="text-[#A7B0C0] text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          </SectionWrapper>
        ))}
      </div>

      {/* Mobile: vertical timeline */}
      <div className="lg:hidden flex flex-col">
        {PROCESS_STEPS.map((step, i) => (
          <SectionWrapper key={step.step} delay={i * 0.1} className="flex gap-5">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full border-2 border-[#187BFF] flex items-center justify-center text-[#187BFF] font-bold text-xs shrink-0">
                {step.step}
              </div>
              {i < PROCESS_STEPS.length - 1 && (
                <div className="w-px flex-1 bg-[#1D2B3E] my-2" />
              )}
            </div>
            <div className="pb-10">
              <h3 className="text-[#F5F7FA] font-bold text-base uppercase tracking-wide mb-2 mt-1">
                {step.title}
              </h3>
              <p className="text-[#A7B0C0] text-sm leading-relaxed">{step.description}</p>
            </div>
          </SectionWrapper>
        ))}
      </div>
    </div>
  </section>
);
