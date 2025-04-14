"use client";
import React from "react";
import { TracingBeam } from "./ui/tracing-beam";

export function MadeFor() {
  return (
    <div>
      <h2 className="text-center text-5xl font-semibold py-20 text-slate-700">
        Made for everyone
      </h2>

      <div className="max-w-5xl mx-auto antialiased pt-4 relative">
        {dummyContent.map((item, index) => (
          <div key={`content-${index}`} className="mb-24 md:mb-32 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Image */}
              <div
                className={` mx-10 ${index % 2 === 0 ? "md:order-1" : "md:order-2"}`}
              >
                {item?.image && (
                  <img
                    src={item.image}
                    alt="blog thumbnail"
                    className="rounded-3xl w-full h-auto  object-cover"
                  />
                )}
              </div>

              {/* Text Content (Badge, Heading, Description) */}
              <div
                className={`flex flex-col justify-center mx-10  ${
                  index % 2 === 0 ? "md:order-2 md:ml-10" : "md:order-1 "
                }`}
              >
                
                <p className="text-xl font-semibold mb-4">{item.title}</p>
                <div className="prose prose-sm dark:prose-invert text-sm">
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
    title: "Lorem Ipsum Dolor Sit Amet",
    description: (
      <>
        <p>
          Sit duis est minim proident non nisi velit non consectetur. Esse
          adipisicing laboris consectetur enim ipsum reprehenderit eu deserunt
        </p>
        <p>
          Dolor minim irure ut Lorem proident. Ipsum do pariatur est ad ad
          exercitation ad quis ex cupidatat cupidatat occaecat adipisicing.
        </p>
      </>
    ),
    badge: "React",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=3540&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Lorem Ipsum Dolor Sit Amet",
    description: (
      <>
        <p>
          Ex irure dolore veniam ex velit non aute nisi labore ipsum occaecat
        </p>
        <p>In dolore veniam excepteur eu est et sunt velit. Ipsum sint esse</p>
      </>
    ),
    badge: "Changelog",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=3540&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Lorem Ipsum Dolor Sit Amet",
    description: (
      <>
        <p>
          Ex irure dolore veniam ex velit non aute nisi labore ipsum occaecat
        </p>
      </>
    ),
    badge: "Launch Week",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=3506&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];
