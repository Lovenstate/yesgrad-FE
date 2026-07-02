export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a237e] mb-4">About YesGrad</h1>
            <p className="text-lg text-gray-600">We're on a mission to make quality education accessible to everyone.</p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-gray-600 text-lg mb-6">
              Founded in {new Date().getFullYear()}, YesGrad connects students with expert tutors for personalized learning experiences.
              Our all-in-one platform covers tutoring, test prep, academic support, events and more.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {[
                { icon: '🎓', title: 'Our Mission', desc: 'Make quality education accessible and affordable for every student, everywhere.' },
                { icon: '👩‍🏫', title: 'Expert Tutors', desc: 'Every tutor is carefully vetted and verified to ensure the highest quality teaching.' },
                { icon: '🏆', title: 'Student Success', desc: 'We measure our success by the success of our students. 98% satisfaction rate.' },
              ].map((item) => (
                <div key={item.title} className="bg-blue-50 rounded-xl p-6 text-center border border-blue-100">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-[#1a237e] mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#1a237e] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '10,000+', label: 'Happy Students' },
                { value: '500+', label: 'Expert Tutors' },
                { value: '50+', label: 'Subjects Covered' },
                { value: '98%', label: 'Success Rate' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-4xl font-bold text-[#f5a623] mb-2">{stat.value}</div>
                  <div className="text-blue-200 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
