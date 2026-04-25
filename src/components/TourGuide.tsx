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
      content: language === "en" ? "Tap here to quickly log today's earnings and expenses." : "Yahan click kar ke aaj ki kamai aur kharcha darj karein.",
      disableBeacon: true,
    },
    {
      target: ".tour-udhar-card",
      content: language === "en" ? "See how much Udhar is pending. Tap to view details and send WhatsApp reminders." : "Dekhein kitna Udhar baqi hai. Tafseel dekhne aur WhatsApp par reminder bhejne ke liye yahan dabayein.",
    },
    {
      target: ".tour-tajir-widget",
      content: language === "en" ? "Items low on stock appear here. 1-click reorder directly from Tajir!" : "Jo items khatam hone walay hain wo yahan nazar ayenge. 1-click se Tajir se mangwayein!",
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
      styles={{
        options: {
          primaryColor: "#059669", // Emerald 600
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
