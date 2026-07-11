import React from 'react';

const HeroSection = () => {
  return (
    <section 
      className="hero-about"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1586528116311-ad8dd3c831c7?q=80&w=2070')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center'
      }}
    >
      <div className="max-w-4xl mx-auto px-6 pt-20">
        <p className="text-yellow-400 uppercase tracking-widest text-sm mb-4">
          THE MIRACLE OF GLOBAL TRADE
        </p>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Elevating Every Bid into a Legacy
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Meen Yazweed ? is more than an auction house. We are the architects of prestige, 
          connecting the world's most discerning collectors with assets of incomparable value.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-4 rounded-lg transition">
            Explore the Collection
          </button>
          <button className="border-2 border-white hover:bg-white hover:text-black font-semibold px-8 py-4 rounded-lg transition">
            Our Pedigree
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;