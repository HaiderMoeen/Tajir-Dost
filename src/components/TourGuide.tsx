"use client";

import React, { useEffect, useState } from "react";
import { Joyride, Step } from "react-joyride";
import { useAppContext } from "@/context/AppContext";

export default function TourGuide() {
  const { hasSeenTutorial, setHasSeenTutorial, language } = useAppContext();
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (!hasSeenTutorial) {
      // Slight delay to ensure DOM is ready
      const timer = setTimeout(() => setRun(true), 500);
      return () => clearTimeout(timer);
    }
  }, [hasSeenTutorial]);

  const steps: Step[] = [
    {
      target: ".tour-hisaab-btn",
      content: language === "en" ? "Yahan se aap rozana ki kamai aur kharchay ka hisaab asani se rakh sakte hain." : "یہاں سے آپ روزانہ کی کمائی اور خرچوں کا حساب آسانی سے رکھ سکتے ہیں۔",
    },
    {
      target: ".tour-udhar-card",
      content: language === "en" ? "Idhar se aap apna saara pending Udhaar dekh sakte hain aur gahakon ko reminder bhej sakte hain." : "ادھر سے آپ اپنا سارا ادھار دیکھ سکتے ہیں اور گاہکوں کو یاد دہانی بھیج سکتے ہیں۔",
    },
    {
      target: ".tour-tajir-widget",
      content: language === "en" ? "Idhar se jo samaan khatam ho raha hai, usay dobara Tajir se asani se mangwa sakte hain." : "ادھر سے جو سامان ختم ہو رہا ہے، اسے دوبارہ تاجر سے آسانی سے منگوا سکتے ہیں۔",
    }
  ];

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    if (["finished", "skipped"].includes(status)) {
      setHasSeenTutorial(true);
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      disableScrolling
      disableOverlayClose
      disableBeacon={true}
      styles={{
        options: {
          primaryColor: "#1abc9c", 
          zIndex: 1000,
        },
      }}
      locale={{
        last: language === "en" ? "Done" : "Khatam",
        skip: language === "en" ? "Skip" : "Chorein",
        next: language === "en" ? "Next" : "Agla",
        back: language === "en" ? "Back" : "Peechay",
      }}
    />
  );
}
