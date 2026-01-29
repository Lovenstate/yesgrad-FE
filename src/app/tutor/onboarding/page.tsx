"use client";

import { useState, useEffect } from "react";
import ProfileStep from "./steps/ProfileStep";
import SubjectsStep from "./steps/SubjectsStep";
import EducationStep from "./steps/EducationStep";
import AvailabilityStep from "./steps/AvailabilityStep";

const STEPS = [
  { id: 1, name: "Profile", component: ProfileStep },
  { id: 2, name: "Subjects", component: SubjectsStep },
  { id: 3, name: "Education", component: EducationStep },
  { id: 4, name: "Availability", component: AvailabilityStep }
];

export default function TutorOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [tutorId, setTutorId] = useState<number | null>(null);

  useEffect(() => {
    // Get tutorId from localStorage or API after registration
    const storedTutorId = localStorage.getItem("tutorId");
    if (storedTutorId) {
      setTutorId(Number(storedTutorId));
    }
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      // Update status to STARTED on first step
      if (currentStep === 1) {
        localStorage.setItem('onboardingStatus', 'STARTED');
      }
      setCurrentStep(currentStep + 1);
    } else {
      // Mark as FINISHED when completing last step
      localStorage.setItem('onboardingStatus', 'FINISHED');
      localStorage.setItem('profileCompletion', '100');
      window.location.href = "/tutor/dashboard";
    }
  };

  const handleSkip = () => {
    // Mark as SKIPPED if user skips
    localStorage.setItem('onboardingStatus', 'SKIPPED');
    
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      window.location.href = "/tutor/dashboard";
    }
  };

  const handleComplete = () => {
    window.location.href = "/tutor/dashboard";
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 py-4 md:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-2 overflow-x-auto">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1 min-w-0">
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-sm md:text-base ${
                    currentStep >= step.id
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {step.id}
                </div>
                <div className="flex-1 mx-1 md:mx-2">
                  <div className="text-xs md:text-sm font-medium text-gray-700 truncate">
                    {step.name}
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-1 w-full ${
                      currentStep > step.id ? "bg-emerald-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-8">
          <CurrentStepComponent
            tutorId={tutorId}
            onNext={handleNext}
            onSkip={handleSkip}
          />
        </div>
      </div>
    </div>
  );
}
