"use client";
import { useScroll, useTransform, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import howtouse1 from "../../assets/howtouse1.png";
import howtouse2 from "../../assets/htu2.png";
import howtouse3 from "../../assets/htu3.png";
import download from "../../assets/download.png";

export const Timeline = () => {
  const data = [
    {
      title: "Click on button",
      content: (
        <div>
          <div className="mb-4 bg-white/10 p-3 rounded-2xl aspect-video">
            <img
              src={howtouse1}
              alt="Click on button tutorial"
              className="rounded-xl object-cover h-full w-full shadow-lg"
            />
          </div>
          <p className="text-gray-100 text-sm md:text-base font-normal mb-6">
            Press the Record button to begin using the screen recorder.{" "}
          </p>
        </div>
      ),
    },
    {
      title: "Start recording",
      content: (
        <div>
          <div className="mb-4 bg-white/10 p-3 rounded-2xl aspect-video">
            <img
              src={howtouse2}
              alt="Start recording tutorial"
              className="rounded-xl object-cover h-full w-full shadow-lg"
            />
          </div>
          <p className="text-gray-100 text-sm md:text-base font-normal mb-6">
            Click on start recording to record the screen.{" "}
          </p>
        </div>
      ),
    },
    {
      title: "Save, Pause, Retake, Delete",
      content: (
        <div>
          <div className="mb-4 bg-white/10 p-3 rounded-2xl aspect-video">
            <img
              src={howtouse3}
              alt="Recording controls tutorial"
              className="rounded-xl object-cover h-full w-full shadow-lg"
            />
          </div>
          <p className="text-gray-100 text-sm md:text-base font-normal mb-6">
            After recording starts, click Save to store your video. You can also
            pause, retake, or delete the recording as needed.{" "}
          </p>
        </div>
      ),
    },
    // {
    //   title: "Edit the recording",
    //   content: (
    //     <div>
    //       <div className="mb-4 bg-white/10 p-3 rounded-2xl aspect-video">
    //         <img
    //           src="https://assets.aceternity.com/templates/startup-4.webp"
    //           alt="Edit recording tutorial"
    //           className="rounded-xl object-cover h-full w-full shadow-lg"
    //         />
    //       </div>
    //       <p className="text-gray-100 text-sm md:text-base font-normal mb-6">
    //         After saving the video you can download the recorded video.{" "}
    //       </p>
    //     </div>
    //   ),
    // },
    {
      title: "Download",
      content: (
        <div>
          <div className="mb-6">
            <img
              src={download}

              alt="Download tutorial"
              className="rounded-xl object-cover h-full w-full shadow-lg"
            />
          </div>
          <p className="text-gray-100 text-sm md:text-base font-normal mb-8">
            After saving the video you can download the recorded video.
          </p>
        </div>
      ),
    },
  ];

  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div>
      <h2 className="text-center text-5xl font-semibold pb-24 text-slate-700">
        Quick and easy to use
      </h2>
      <div
        className="mx-10  rounded-3xl bg-gradient-to-r from-green-500 to-blue-500 font-sans md:px-10"
        ref={containerRef}
      >
        <div className="max-w-7xl mx-auto  px-4 md:px-8 lg:px-10"></div>
        <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex justify-start pt-10 md:pt-40 md:gap-10"
            >
              <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
                <div className="md:h-10 h-6 w-6 absolute left-3 md:left-3 md:w-10 rounded-full bg-white flex items-center justify-center">
                  <div className=" h-0.5 w-0.5 md:h-4 md:w-4  rounded-full bg-slate-700 border border-neutral-300 p-1" />
                </div>
                <h3 className="hidden md:block text-xl md:pl-20 md:text-4xl font-bold text-slate-700">
                  {item.title}
                </h3>
              </div>

              <div className="relative pl-20 pr-4 md:pl-4 w-full">
                <h3 className="md:hidden block text-xl mb-4 text-left  text-neutral-200">
                  {item.title}
                </h3>
                {item.content}
              </div>
            </div>
          ))}
          <div
            style={{
              height: height + "px",
            }}
            className="absolute md:left-8 left-6 top-0 overflow-hidden w-[2px] bg-gradient-to-b from-transparent via-neutral-200 to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
          >
            <motion.div
              style={{
                height: heightTransform,
                opacity: opacityTransform,
              }}
              className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
