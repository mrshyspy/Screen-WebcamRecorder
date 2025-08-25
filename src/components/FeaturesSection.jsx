"use client";

import {
  Download,
  MonitorSmartphone,
  Feather,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { GlowingEffect } from "./ui/glowing-effect";

export function FeaturesSection() {
  return (
    <div>
      <h1 className="text-center text-5xl text-slate-700 font-semibold">
        Advanced features for easy, custom recording
      </h1>
      <ul className="mx-9 my-24 grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
        <GridItem
          area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
          icon={<MonitorSmartphone className="h-5 w-5 text-gray-800" />}
          title="Instant Screen Recording"
          description="Capture your screen instantly with just one click, no lag, no delay."
        />
        <GridItem
          area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
          icon={<Feather className="h-5 w-5 text-gray-800" />}
          title="Lightweight & Fast"
          description="Runs smoothly without slowing down your device."
        />
        <GridItem
          area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
          icon={<Download className="h-5 w-5 text-gray-800" />}
          title="HD Downloads"
          description="Download your final videos in high-definition with optimized quality."
        />
        <GridItem
          area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
          icon={<UploadCloud className="h-5 w-5 text-gray-800" />}
          title="No Installations Needed"
          description="Works completely online. No need to install any apps or plugins."
        />
        <GridItem
          area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
          icon={<ShieldCheck className="h-5 w-5 text-gray-800" />}
          title="Privacy-Focused"
          description="Your recordings stay private and secure — your data is yours."
        />
      </ul>
    </div>
  );
}

const GridItem = ({ area, icon, title, description }) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border border-neutral-300 p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          blur={0}
          borderWidth={1}
          spread={80}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-300 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl font-semibold text-balance text-black md:text-2xl">
                {title}
              </h3>
              <h2 className="font-sans text-sm text-gray-700 md:text-base">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
