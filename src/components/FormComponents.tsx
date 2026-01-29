export const Input = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${className}`}
    {...props}
  />
);

export const TextArea = ({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none ${className}`}
    {...props}
  />
);

export const Select = ({ className = "", ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white ${className}`}
    {...props}
  />
);

export const PrimaryButton = ({ className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={`px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 active:bg-emerald-800 font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  />
);

export const SecondaryButton = ({ className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={`px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 font-semibold transition-all ${className}`}
    {...props}
  />
);

export const Label = ({ className = "", ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label
    className={`block text-sm font-semibold text-gray-700 mb-2 ${className}`}
    {...props}
  />
);
