
import StudentProfileStep from "../../../student/steps/StudentProfileStep";
import StudentAvailabilityStep from "../../../student/steps/StudentAvailabilityStep";
import StudentAvailabilityStep from "../../../student/steps/StudentAvailabilityStep";

const STEPS = [
  { id: 1, name: "Profile", component: StudentPro },
  { id: 2, name: "Subjects", component: SubjectsStep },
  { id: 3, name: "Education", component: EducationStep },
  { id: 4, name: "Availability", component: AvailabilityStep }
];