"use client";

import { useState, useEffect } from "react";
import SubjectTree, { Subject } from "@/components/SubjectTree";
import { Input, PrimaryButton, SecondaryButton, Label } from "@/components/FormComponents";
import { tutorProfileAPI, subjectAPI } from "@/lib/api";
import { TutorSubjectsRequest } from "@/types/api";

interface SubjectsStepProps {
  tutorId: number | null;
  onNext: () => void;
  onSkip: () => void;
}

interface SubjectWithRate {
  subjectId: number;
  subjectName: string;
  hourlyRate: string;
}

export default function SubjectsStep({ tutorId, onNext, onSkip }: SubjectsStepProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectWithRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await subjectAPI.getAllSubjects();
      
        if (response.success) {
          setSubjects(response.data);
        }
      } catch (err) {
        console.error("Failed to load subjects:", err);
      }
    };
    fetchSubjects();
  }, []);

  const findSubjectName = (id: number, subjectList: Subject[]): string => {
    for (const subject of subjectList) {
      if (subject.id === id) return subject.name;
      if (subject.children.length > 0) {
        const found = findSubjectName(id, subject.children);
        if (found) return found;
      }
    }
    return "";
  };

  const handleSelectionChange = (ids: number[]) => {
    const newSubjects = ids.map((id) => {
      const existing = selectedSubjects.find((s) => s.subjectId === id);
      return existing || { subjectId: id, subjectName: findSubjectName(id, subjects), hourlyRate: "" };
    });
    setSelectedSubjects(newSubjects);
  };

  const handleRateChange = (subjectId: number, rate: string) => {
    setSelectedSubjects((prev) =>
      prev.map((s) => (s.subjectId === subjectId ? { ...s, hourlyRate: rate } : s))
    );
    if (errors[`rate_${subjectId}`]) {
      setErrors({ ...errors, [`rate_${subjectId}`]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    selectedSubjects.forEach((subject) => {
      const rate = parseFloat(subject.hourlyRate);
      if (!subject.hourlyRate || isNaN(rate)) {
        newErrors[`rate_${subject.subjectId}`] = "Rate is required";
      } else if (rate < 5) {
        newErrors[`rate_${subject.subjectId}`] = "Minimum rate is $5/hour";
      } else if (rate > 500) {
        newErrors[`rate_${subject.subjectId}`] = "Maximum rate is $500/hour";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const tutorSubjectRequest: TutorSubjectsRequest = {
        subjects: selectedSubjects.map((s) => ({
          subjectId: s.subjectId,
          hourlyRate: parseFloat(s.hourlyRate) || 0,
        }))
      }

      await tutorProfileAPI.createTutorSubject(tutorSubjectRequest);
      onNext();

    } catch (err) {
      console.error("Failed to save subjects:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Select Your Subjects</h2>
        <p className="text-sm md:text-base text-gray-600">Choose subjects you can teach and set your hourly rates</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        <div>
          <Label>Available Subjects</Label>
          <SubjectTree
            subjects={subjects}
            selectedIds={selectedSubjects.map((s) => s.subjectId)}
            onSelectionChange={handleSelectionChange}
          />
        </div>

        {selectedSubjects.length > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-4 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-emerald-600">💰</span> Set Your Hourly Rates
            </h3>
            <div className="space-y-3">
              {selectedSubjects.map((subject) => (
                <div key={subject.subjectId} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-white p-3 md:p-4 rounded-lg border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                  <span className="flex-1 text-sm font-semibold text-gray-900">
                    {subject.subjectName}
                  </span>
                  <div className="flex flex-col items-start sm:items-end gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-700">$</span>
                      <Input
                        type="number"
                        value={subject.hourlyRate}
                        onChange={(e) => handleRateChange(subject.subjectId, e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="5"
                        max="500"
                        required
                        className={`w-24 sm:w-28 ${errors[`rate_${subject.subjectId}`] ? "border-red-500" : ""}`}
                      />
                      <span className="text-sm font-medium text-gray-600">/hour</span>
                    </div>
                    {errors[`rate_${subject.subjectId}`] && (
                      <p className="text-red-600 text-xs">{errors[`rate_${subject.subjectId}`]}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-4">💡 Tip: Research competitive rates in your area to attract more students</p>
          </div>
        )}

        {selectedSubjects.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500">Select subjects from the tree above to set your rates</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <PrimaryButton
            type="submit"
            disabled={loading || selectedSubjects.length === 0}
            className="flex-1 w-full"
          >
            {loading ? "Saving..." : "Save & Continue"}
          </PrimaryButton>
          <SecondaryButton
            type="button"
            onClick={onSkip}
            className="w-full sm:w-auto"
          >
            Skip for Now
          </SecondaryButton>
        </div>
      </form>
    </div>
  );
}
