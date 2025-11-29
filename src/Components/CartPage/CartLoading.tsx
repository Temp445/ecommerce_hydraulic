const CartLoading = () => {
  return (
    <div className="min-h-screen bg-slate-50">
        <div className="bg-black text-white py-6 px-4 shadow">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse" />
              <div>
                <div className="w-32 h-6 bg-gray-700 rounded animate-pulse mb-2" />
                <div className="w-20 h-4 bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
            <div className="w-40 h-8 bg-gray-700 rounded animate-pulse" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 animate-pulse"
              >
                <div className="flex flex-col md:flex-row gap-5">
                  <div className="w-full md:w-32 h-32 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <div className="w-3/4 h-5 bg-gray-200 rounded" />
                    <div className="w-1/3 h-4 bg-gray-200 rounded" />
                    <div className="w-1/2 h-6 bg-gray-200 rounded" />
                    <div className="flex gap-3 mt-4">
                      <div className="w-10 h-10 bg-gray-200 rounded" />
                      <div className="w-10 h-10 bg-gray-200 rounded" />
                      <div className="w-10 h-10 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-pulse">
              <div className="w-1/2 h-6 bg-gray-200 rounded mb-6" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between mb-4">
                  <div className="w-1/3 h-4 bg-gray-200 rounded" />
                  <div className="w-1/4 h-4 bg-gray-200 rounded" />
                </div>
              ))}
              <div className="w-full h-12 bg-gray-300 rounded mt-8" />
            </div>
          </div>
        </div>
      </div>
  );
};

export default CartLoading;
