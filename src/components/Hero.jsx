import { motion } from "framer-motion";
import { ContainerTextFlip } from "./ui/container-text-flip";
import { HoverBorderGradient } from "./hover-border-gradient";
import poster from "../assets/preview.png";

export function HeroSectionOne() {
  return (
    <div className="relative mx-auto mb-20 flex max-w-7xl flex-col items-center justify-center">
      {/* Decorative borders */}
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>

      {/* Content */}
      <div className="px-4 py-20 md:py-24">
        {/* Heading */}
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl">
          {"Start your screen's story here -".split(" ").map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeInOut",
              }}
              className="mr-2 inline-block"
            >
              {word}
            </motion.span>
          ))}
          <ContainerTextFlip words={["Record", "Download", "Share"]} />
          {"it.".split(" ").map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeInOut",
              }}
              className="mr-2 inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600"
        >
          Capture meetings, tutorials, or gameplay with a single click. No
          downloads. No fuss. Just smooth, high-quality screen recording for
          free.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="bg-white text-black flex items-center space-x-2"
          >
            Start recording for free
          </HoverBorderGradient>
        </motion.div>

        {/* Preview Image */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.2 }}
          className="relative z-10 mt-20 w-4/5 mx-auto rounded-3xl border border-neutral-200 bg-neutral-100 p-3 shadow-lg"
        >
          <div className="w-full overflow-hidden rounded-xl border border-gray-300 shadow-sm">
            <img
              src={poster}
              alt="Landing page preview"
              className="aspect-[16/9] h-auto w-full object-cover"
              height={1000}
              width={1000}
              loading="eager"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
