"use client";

import { useState } from "react";
import { Input, PrimaryButton, SecondaryButton, Label } from "@/components/FormComponents";
import { tutorProfileAPI } from "@/lib/api";
import { TutorEducationsRequest } from "@/types/api";

interface EducationStepProps {
  tutorId: number | null;
  onNext: () => void;
  onSkip: () => void;
}

interface Education {
  school: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: number;
}

export default function EducationStep({ tutorId, onNext, onSkip }: EducationStepProps) {
  const [educations, setEducations] = useState<Education[]>([
    { school: "", degree: "", fieldOfStudy: "", graduationYear: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAdd = () => {
    setEducations([...educations, { school: "", degree: "", fieldOfStudy: "", graduationYear: 0 }]);
  };

  const handleRemove = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof Education, value: string) => {
    setEducations(
      educations.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu))
    );
    if (errors[`${field}_${index}`]) {
      setErrors({ ...errors, [`${field}_${index}`]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const currentYear = new Date().getFullYear();

    educations.forEach((edu, index) => {
      if (edu.school || edu.degree || edu.fieldOfStudy || edu.graduationYear) {
        if (!edu.school || edu.school.trim().length < 3) {
          newErrors[`school_${index}`] = "School name is required (min 3 characters)";
        }
        if (!edu.degree || edu.degree.trim().length < 2) {
          newErrors[`degree_${index}`] = "Degree is required";
        }
        if (!edu.fieldOfStudy || edu.fieldOfStudy.trim().length < 2) {
          newErrors[`fieldOfStudy_${index}`] = "Field of study is required";
        }
        const year = edu.graduationYear;
        if (!edu.graduationYear || isNaN(year) || year < 1950 || year > currentYear + 10) {
          newErrors[`graduationYear_${index}`] = `Year must be between 1950 and ${currentYear + 10}`;
        }
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

      const educationRequest: TutorEducationsRequest = {
        educations: educations
      }

      await tutorProfileAPI.createTutorEducation(educationRequest, tutorId!);
      onNext();
      
    } catch (err) {
      console.error("Failed to save education:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Education Background</h2>
        <p className="text-sm md:text-base text-gray-600">Add your educational qualifications</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        {educations.map((edu, index) => (
          <div key={index} className="border-2 border-gray-200 rounded-xl p-4 md:p-6 bg-gradient-to-br from-gray-50 to-white">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900">Education {index + 1}</h3>
              {educations.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-red-600 hover:text-red-700 text-sm font-semibold"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="col-span-2">
                <Label>School/University</Label>
                <Input
                  type="text"
                  value={edu.school}
                  onChange={(e) => handleChange(index, "school", e.target.value)}
                  placeholder="e.g., Harvard University"
                  className={errors[`school_${index}`] ? "border-red-500" : ""}
                />
                {errors[`school_${index}`] && (
                  <p className="text-red-600 text-xs mt-1">{errors[`school_${index}`]}</p>
                )}
              </div>

              <div>
                <Label>Degree</Label>
                <Input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleChange(index, "degree", e.target.value)}
                  placeholder="e.g., Bachelor's"
                  className={errors[`degree_${index}`] ? "border-red-500" : ""}
                />
                {errors[`degree_${index}`] && (
                  <p className="text-red-600 text-xs mt-1">{errors[`degree_${index}`]}</p>
                )}
              </div>

              <div>
                <Label>Field of Study</Label>
                <Input
                  type="text"
                  value={edu.fieldOfStudy}
                  onChange={(e) => handleChange(index, "fieldOfStudy", e.target.value)}
                  placeholder="e.g., Mathematics"
                  className={errors[`fieldOfStudy_${index}`] ? "border-red-500" : ""}
                />
                {errors[`fieldOfStudy_${index}`] && (
                  <p className="text-red-600 text-xs mt-1">{errors[`fieldOfStudy_${index}`]}</p>
                )}
              </div>

              <div className="col-span-2">
                <Label>Graduation Year</Label>
                <Input
                  type="number"
                  value={edu.graduationYear}
                  onChange={(e) => handleChange(index, "graduationYear", e.target.value)}
                  placeholder="e.g., 2020"
                  min="1950"
                  max={new Date().getFullYear() + 10}
                  className={errors[`graduationYear_${index}`] ? "border-red-500" : ""}
                />
                {errors[`graduationYear_${index}`] && (
                  <p className="text-red-600 text-xs mt-1">{errors[`graduationYear_${index}`]}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAdd}
          className="w-full py-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-emerald-400 hover:text-emerald-600 font-semibold transition-all"
        >
          + Add Another Education
        </button>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <PrimaryButton
            type="submit"
            disabled={loading}
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
