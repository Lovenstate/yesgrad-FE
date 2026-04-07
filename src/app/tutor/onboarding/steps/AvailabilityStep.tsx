"use client";

import { useState } from "react";
import { tutorProfileAPI } from "@/lib/api";
import { TutorAvailabilityRequest } from "@/types/api";

interface AvailabilityStepProps {
  tutorId: number | null;
  onNext: () => void;
  onSkip: () => void;
}

interface TimeSlot {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function AvailabilityStep({ tutorId, onNext, onSkip }: AvailabilityStepProps) {
  const [availability, setAvailability] = useState<TimeSlot[]>(
    DAYS.map((day) => ({
      dayOfWeek: day,
      startTime: "09:00",
      endTime: "17:00",
      isAvailable: false,
    }))
  );
  const [loading, setLoading] = useState(false);

  const handleToggle = (index: number) => {
    setAvailability(
      availability.map((slot, i) =>
        i === index ? { ...slot, isAvailable: !slot.isAvailable } : slot
      )
    );
  };

  const handleTimeChange = (index: number, field: "startTime" | "endTime", value: string) => {
    setAvailability(
      availability.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const tutorAvailabilityReq: TutorAvailabilityRequest = {
      availabilities: availability.filter((a) => a.isAvailable)
    };

    try {
      await tutorProfileAPI.createTutorAvailability(tutorAvailabilityReq, tutorId!);
      onNext();
    } catch (err) {
      console.error("Failed to save availability:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Set Your Availability</h2>
      <p className="text-sm md:text-base text-gray-600 mb-6">When are you available to teach?</p>

      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
        {availability.map((slot, index) => (
          <div
            key={slot.dayOfWeek}
            className={`border rounded-lg p-3 md:p-4 transition-colors ${
              slot.isAvailable ? "border-emerald-500 bg-emerald-50" : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <input
                  type="checkbox"
                  checked={slot.isAvailable}
                  onChange={() => handleToggle(index)}
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="w-24 sm:w-28 font-medium text-gray-900 text-sm md:text-base">{slot.dayOfWeek}</span>
              </div>

              {slot.isAvailable && (
                <div className="flex items-center gap-2 flex-1 ml-8 sm:ml-0">
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => handleTimeChange(index, "startTime", e.target.value)}
                    className="px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-gray-600 text-sm">to</span>
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => handleTimeChange(index, "endTime", e.target.value)}
                    className="px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 w-full bg-emerald-600 text-white py-3 rounded-md hover:bg-emerald-700 font-medium disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save & Continue"}
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
          >
            Skip for Now
          </button>
        </div>
      </form>
    </div>
  );
}
