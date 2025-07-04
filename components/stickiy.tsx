import { StickyBanner } from "@/components/ui/sticky-banner";
import { HeroSectionOne } from "./landing";

export function StickyBannerDemo() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-y-auto">
      <StickyBanner className="bg-gradient-to-b from-blue-500 to-blue-600">
        <p className="mx-0 max-w-[90%] text-white drop-shadow-md">
          ⚠️ Gemini API Error: Service temporarily unavailable. We're working to
          restore functionality.{" "}
          <a href="#" className="transition duration-200 hover:underline">
            Check status
          </a>
        </p>
      </StickyBanner>
      <HeroSectionOne />
    </div>
  );
}
