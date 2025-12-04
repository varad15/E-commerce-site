// src/components/ServiceStrips.jsx
// Service highlights section - FIXED with key props

import React from 'react';

const ServiceStrips = ({ services }) => {
  const defaultServices = [
    {
      id: 1,
      icon: "🚚",
      title: "Free Shipping",
      description: "On orders over ₹50"
    },
    {
      id: 2,
      icon: "♻️",
      title: "Eco-Friendly",
      description: "100% sustainable products"
    },
    {
      id: 3,
      icon: "🔒",
      title: "Secure Payment",
      description: "Safe & encrypted"
    },
    {
      id: 4,
      icon: "⚡",
      title: "Fast Delivery",
      description: "Within 3-5 business days"
    }
  ];

  const serviceList = services || defaultServices;

  return (
    <section className="py-12 bg-base-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceList.map((service, index) => (
            <div 
              key={service.id || index}
              className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="card-body items-center text-center">
                <div className="text-5xl mb-2">{service.icon}</div>
                <h3 className="card-title text-lg">{service.title}</h3>
                <p className="text-sm text-base-content/70">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceStrips;