import React from 'react';

const CoreValues = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Redefining Digital Exclusivity through Uncompromising Trust
            </h2>
            <p className="text-gray-600 text-lg">
              Founded on the principle that rare assets deserve a rare experience, Meen Yazweed ? 
              bridges the gap between traditional auction house gravitas and digital efficiency.
            </p>

            <div className="flex gap-10 mt-10">
              <div>
                <h3 className="text-4xl font-bold text-yellow-600">$2.48B+</h3>
                <p className="text-gray-500">Transaction Volume</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-yellow-600">140+</h3>
                <p className="text-gray-500">Countries Reached</p>
              </div>
            </div>

            <div className="mt-10 bg-gray-900 text-white p-8 rounded-xl italic">
              "Excellence is not an act, but a habit."
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1611590027211-b954fd027f51?w=800" 
              alt="Luxury Watch Movement"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Core Values */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Our Core Values</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 border border-gray-200 rounded-2xl hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold mb-4">Unyielding Trust</h3>
            <p className="text-gray-600">
              Transparency is our currency. Every asset on our platform undergoes a multi-point verification process.
            </p>
          </div>

          <div className="p-8 bg-gray-900 text-white rounded-2xl hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold mb-4">Curated Excellence</h3>
            <p>
              We don't just host auctions; we curate experiences. Our selection represents the absolute peak of craftsmanship.
            </p>
          </div>

          <div className="p-8 border border-gray-200 rounded-2xl hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold mb-4">Pure Authenticity</h3>
            <p className="text-gray-600">
              We honor the heritage of every item. Our platform preserves the stories and provenance of rare objects.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreValues;