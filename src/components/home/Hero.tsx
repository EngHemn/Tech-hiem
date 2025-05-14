import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";

const Hero = () => {
  const t = useTranslations("hero");
  const textRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const title = t("title");

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Animate each letter
    tl.fromTo(
      ".letter",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 }
    );

    tl.fromTo(
      buttonRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      "-=0.3"
    );

    tl.fromTo(
      imageRef.current,
      { x: 200, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8 },
      "-=0.6"
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="flex md:px-12 sm:mt-12 relative md:flex-row m-0 flex-col-reverse min-h-[410px] md:min-h-fit overflow-hidden above-405:px-3 mt-0 md:items-center items-start w-full justify-center md:justify-between">
      <div
        ref={textRef}
        className="flex w-full md:w-[400px] z-[2] justify-between md:justify-center flex-col md:py-4 h-full items-center gap-8"
      >
        <h1 className="lg:text-34 w-full font-sans mt-8 text-secondary dark:text-primary-200 xl:text-60 relative text-48 md:text-29 font-bold capitalize flex flex-wrap justify-center">
          {Array.from(title).map((letter, index) => (
            <span
              key={index}
              className="letter inline-block"
              style={{ whiteSpace: "pre" }} // Keeps spaces visible
            >
              {letter}
            </span>
          ))}
        </h1>

        <div className="flex items-center gap-2 -mb-[190px] md:mb-0 box-content md:justify-center justify-between h-full flex-col">
          <h3 className="font-[500] dark:text-neutral-500 text-22 text-center w-full md:text-20 lg:text-24">
            {t("quote")}
          </h3>
          <Link
            href={"#newProducts"}
            className="transition-all w-full md:w-fit duration-300"
          >
            <button
              ref={buttonRef}
              className="capitalize px-7 w-full md:w-fit py-2 text-15 lg:text-16 sm:text-20 -mb-6 above-405:px-7 sm:hover:bg-red-800 duration-300 transition-all md:px-12 lg:px-10 bg-secondary text-white sm:py-4 rounded-lg mt-auto"
            >
              {t("buttonText")}
            </button>
          </Link>
        </div>
      </div>

      <div
        ref={imageRef}
        className="mr-0 xl:w-[60%] opacity-75 md:opacity-100 md:static absolute left-0 right-0 -top-7 scale-[1.24] w-screen h-[370px] sm:scale-[1] sm:h-auto md:self-end lg:w-[50%] sm:w-[60%]"
      >
        <Image
          src="/hero.svg"
          alt="image hero"
          className="w-full h-full brightness-95"
          width={628}
          height={400}
        />
      </div>
    </div>
  );
};

export default Hero;
