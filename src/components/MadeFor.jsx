"use client";
import React from "react";
import { TracingBeam } from "./ui/tracing-beam";
import edu from "../assets/edu.jpg";
import work from "../assets/work.png";
import game from "../assets/game.png";
import content from "../assets/content.png";  

export function MadeFor() {
  return (
    <div>
      <h2 className="text-center text-5xl font-semibold py-20 text-slate-700">
        Made for everyone
      </h2>

      <div className="max-w-5xl mx-auto antialiased pt-4 relative">
        {dummyContent.map((item, index) => (
          <div key={`content-${index}`} className="mb-24 md:mb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Image */}
              <div
                className={`mx-10 ${index % 2 === 0 ? "md:order-1" : "md:order-2"}`}
              >
                {item?.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="rounded-3xl w-full h-auto object-cover"
                  />
                )}
              </div>

              {/* Text Content */}
              <div
                className={`flex flex-col justify-center mx-10 ${
                  index % 2 === 0 ? "md:order-2 md:ml-10" : "md:order-1"
                }`}
              >
                <p className="lg:text-3xl text-2xl font-semibold mb-4">
                  {item.title}
                </p>
                <div className="prose prose-sm dark:prose-invert text-md">
                  {item.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const dummyContent = [
  {
    title: "Learning & Education",
    description: (
      <>
        <p>
          Easily record online classes, lectures, and tutorials to revisit anytime.
          Whether you’re a student preparing for exams or a teacher creating study
          material, screen recording makes learning more effective and accessible.
        </p>
      </>
    ),
    image: edu,
  },
  {
    title: "Work & Productivity",
    description: (
      <>
        <p>
          Capture important meetings, presentations, and training sessions with ease.
          Screen recordings help teams stay aligned, improve collaboration, and
          ensure no detail is missed, even when working remotely.
        </p>
      </>
    ),
    image: work,
  },
  {
    title: "Gaming & Entertainment",
    description: (
      <>
        <p>
          Record and share your gameplay, walkthroughs, and live reactions effortlessly.
          Screen recording is perfect for gamers who want to showcase their skills,
          create engaging highlights, or entertain their audience.
        </p>
      </>
    ),
    image: game,
  },
  {
    title: "Content Creation",
    description: (
      <>
        <p>
          Bring your ideas to life by recording tutorials, product demos, and social
          media content. Screen recording helps creators produce professional-quality
          videos for YouTube, Instagram, or any platform of choice.
        </p>
      </>
    ),
    image: content,
  },
];
