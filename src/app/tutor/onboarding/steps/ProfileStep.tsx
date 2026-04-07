"use client";

import { useState } from "react";
import { z } from "zod";
import { Input, TextArea, Select, PrimaryButton, SecondaryButton, Label } from "@/components/FormComponents";
import { tutorProfileAPI} from "@/lib/api";
import { TutorProfileRequest } from "@/types/api";

const profileSchema = z.object({
  headline: z.string().min(10, "Headline must be at least 10 characters").max(100, "Headline must be less than 100 characters").optional().or(z.literal("")),
  bio: z.string().min(50, "Bio must be at least 50 characters to showcase your expertise").max(1000, "Bio must be less than 1000 characters").optional().or(z.literal("")),
  cancellationPolicy: z.enum(["24_HOURS", "48_HOURS", "FLEXIBLE"]),
  travelPolicy: z.enum(["ONLINE_ONLY", "IN_PERSON", "BOTH"]),
});

const photoSchema = z.object({
  size: z.number().max(5 * 1024 * 1024, "File size must be less than 5MB"),
  type: z.string().refine((type) => type.startsWith("image/"), "File must be an image (JPG, PNG, or GIF)"),
});

interface ProfileStepProps {
  tutorId: number | null;
  onNext: () => void;
  onSkip: () => void;
}

export default function ProfileStep({ tutorId, onNext, onSkip }: ProfileStepProps) {
  const [formData, setFormData] = useState({
    headline: "",
    bio: "",
    cancellationPolicy: "24_HOURS",
    travelPolicy: "ONLINE_ONLY",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const result = photoSchema.safeParse({ size: file.size, type: file.type });
      
      if (!result.success) {
        const error = result.error.issues[0].message;
        setErrors({ ...errors, photo: error });
        return;
      }
      
      // Revoke old URL to prevent memory leak
      if (photoPreview) URL.revokeObjectURL(photoPreview);

      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setErrors({ ...errors, photo: "" });
    }
  };

  const validateForm = () => {
    const result = profileSchema.safeParse(formData);
    
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((error) => {
        if (error.path[0]) {
          newErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {

      // Upload photo first if exists
      if (photoFile) {
        await tutorProfileAPI.uploadPhoto(photoFile);
      }

      const updateRequest: TutorProfileRequest = {
        bio: formData.bio,
        headline: formData.headline,
        cancellationPolicy: formData.cancellationPolicy,
        travelPolicy: formData.travelPolicy
      }

      const response = await tutorProfileAPI.updateProfile(updateRequest)

      if (response.success) {
        onNext();
      } else {
        setErrors({ form: response.message || "Failed to save profile. Please try again." });
      }
    } catch (err) {
       setErrors({ form: err instanceof Error ? err.message : "Failed to save profile" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Create Your Profile</h2>
        <p className="text-sm md:text-base text-gray-600">Tell students about yourself and stand out</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        <div>
          <Label>Profile Photo</Label>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Preview"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-emerald-100 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 border-4 border-gray-100 shadow-sm">
                <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            <div className="flex-1 w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 sm:file:py-3 sm:file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 file:cursor-pointer file:transition-all"
              />
              <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max 5MB.</p>
              {errors.photo && (
                <p className="text-red-600 text-xs mt-1">{errors.photo}</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <Label>Headline</Label>
          <Input
            type="text"
            value={formData.headline}
            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            placeholder="e.g., Experienced Math Tutor | 10+ Years Teaching"
            className={errors.headline ? "border-red-500" : ""}
          />
          {errors.headline && (
            <p className="text-red-600 text-xs mt-1">{errors.headline}</p>
          )}
        </div>

        <div>
          <Label>Bio</Label>
          <TextArea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={6}
            placeholder="Share your teaching experience, approach, and what makes you unique...&#10;&#10;Example: I'm passionate about making complex concepts simple and engaging. With over 10 years of experience, I've helped hundreds of students achieve their academic goals."
            className={errors.bio ? "border-red-500" : ""}
          />
          {errors.bio && (
            <p className="text-red-600 text-xs mt-1">{errors.bio}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <Label>Cancellation Policy</Label>
            <Select
              value={formData.cancellationPolicy}
              onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
            >
              <option value="24_HOURS">24 Hours Notice</option>
              <option value="48_HOURS">48 Hours Notice</option>
              <option value="FLEXIBLE">Flexible</option>
            </Select>
          </div>

          <div>
            <Label>Travel Policy</Label>
            <Select
              value={formData.travelPolicy}
              onChange={(e) => setFormData({ ...formData, travelPolicy: e.target.value })}
            >
              <option value="ONLINE_ONLY">Online Only</option>
              <option value="IN_PERSON">In-Person Only</option>
              <option value="BOTH">Both</option>
            </Select>
          </div>
        </div>

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
