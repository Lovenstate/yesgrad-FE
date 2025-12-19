export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About YesGrad</h1>
          <p className="text-xl text-gray-600 mb-6">
            We&apos;re on a mission to make quality education accessible to everyone.
          </p>
          <p className="text-gray-600">
            Founded in {new Date().getFullYear()}, YesGrad connects students with expert tutors for personalized learning experiences.
          </p>
        </div>
      </main>
    </div>
  );
}