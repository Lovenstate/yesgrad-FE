const categories = [
  { name: 'Textbooks', description: 'New and used textbooks for all subjects', items: ['Math Textbooks', 'Science Books', 'Literature', 'History Books'], icon: '📖' },
  { name: 'Study Materials', description: 'Essential supplies for effective studying', items: ['Notebooks', 'Highlighters', 'Sticky Notes', 'Planners'], icon: '📝' },
  { name: 'Technology', description: 'Digital tools and accessories', items: ['Calculators', 'Tablets', 'Headphones', 'Webcams'], icon: '💻' },
  { name: 'Art Supplies', description: 'Materials for creative subjects', items: ['Drawing Pencils', 'Paints', 'Brushes', 'Sketchbooks'], icon: '🎨' },
];

const featuredProducts = [
  { name: 'Scientific Calculator', price: 89.99, originalPrice: 119.99, rating: 4.8, reviews: 234 },
  { name: 'Study Planner Set', price: 24.99, originalPrice: 34.99, rating: 4.9, reviews: 156 },
  { name: 'Noise-Canceling Headphones', price: 149.99, originalPrice: 199.99, rating: 4.7, reviews: 89 },
];

export default function Supplies() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a237e] mb-4">Educational Supplies Shop</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find everything you need for successful learning — textbooks, technology, and more.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#1a237e] mb-8 text-center">Shop by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer p-6 text-center group">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-[#1a237e] mb-2">{category.name}</h3>
                  <p className="text-gray-500 text-sm mb-3">{category.description}</p>
                  <ul className="text-xs text-gray-400 space-y-1">
                    {category.items.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#1a237e] mb-8 text-center">Featured Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Product Image</span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-500 text-xs">({product.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-[#1a237e]">${product.price}</span>
                        <span className="text-gray-400 line-through text-sm ml-2">${product.originalPrice}</span>
                      </div>
                      <button className="bg-[#1a237e] text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors text-sm font-medium">Add to Cart</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#1a237e] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Full Shop Coming Soon!</h2>
            <p className="text-blue-200 mb-8 max-w-2xl mx-auto">Sign up to be notified when we launch our full store.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white text-sm" />
              <button className="bg-[#f5a623] text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors text-sm">Notify Me</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
