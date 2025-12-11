// // src/components/CategorySection.jsx
// // Grid view of categories - CLICKABLE

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCategories } from '../hooks/useApi';

// export default function CategorySection({ featured = false, limit = 6 }) {
//   const navigate = useNavigate();
//   const { categories, loading } = useCategories(featured);

//   const handleCategoryClick = (slug) => {
//     navigate(`/category/${slug}`);
//   };

//   const displayCategories = limit ? categories.slice(0, limit) : categories;

//   if (loading) {
//     return (
//       <div className="w-full py-8">
//         <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {[...Array(6)].map((_, i) => (
//             <div key={i} className="card bg-base-200 shadow-lg">
//               <div className="skeleton h-48 w-full"></div>
//               <div className="card-body">
//                 <div className="skeleton h-4 w-3/4 mb-2"></div>
//                 <div className="skeleton h-3 w-full">
//                   category section
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (categories.length === 0) return null;

//   return (
//     <div className="w-full py-8">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-bold">
//           {featured ? 'Featured Categories' : 'Shop by Category'}
//         </h2>
//         {limit && categories.length > limit && (
//           <a href="/products" className="link link-primary">
//             View All →
//           </a>
//         )}
//       </div>

//       {/* Categories Grid */}
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {displayCategories.map((category) => (
//           <div
//             key={category._id}
//             onClick={() => handleCategoryClick(category.slug)}
//             className="card bg-base-200 shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
//           >
//             <figure className="relative overflow-hidden h-48">
//               <img
//                 src={category.image}
//                 alt={category.name}
//                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//               />
//               {category.featured && (
//                 <div className="badge badge-secondary absolute top-2 right-2">
//                   Featured
//                 </div>
//               )}
//               {/* Hover Overlay */}
//               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
//                 <div className="absolute bottom-4 left-4 right-4">
//                   <button className="btn btn-primary btn-sm w-full">
//                     Explore Category
//                   </button>
//                 </div>
//               </div>
//             </figure>

//             <div className="card-body p-4">
//               <h3 className="card-title text-base font-bold">
//                 {category.name}
//               </h3>
//               <p className="text-sm text-base-content/70 line-clamp-2">
//                 {category.description}
//               </p>
//               <div className="card-actions justify-between items-center mt-2">
//                 {category.productCount && (
//                   <div className="badge badge-outline badge-sm">
//                     {category.productCount} products
//                   </div>
//                 )}
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* View All Button (Mobile) */}
//       {limit && categories.length > limit && (
//         <div className="text-center mt-6 lg:hidden">
//           <a href="/products" className="btn btn-outline btn-primary">
//             View All Categories
//           </a>
//         </div>
//       )}
//     </div>
//   );
// }