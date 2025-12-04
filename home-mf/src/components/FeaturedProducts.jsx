export const featuredProducts = [
  {
    id: 101,
    name: "Eco-Friendly Detergent (1L)",
    price: 12.99,
    imageUrl: "home-mf\src\assets\images\maria-ilves-XXRyh-ybxDs-unsplash.jpg",
  },
  {
    id: 102,
    name: "Bamboo Toothbrush (Pack of 4)",
    price: 6.99,
    imageUrl: "home-mf\src\assets\images\maria-ilves-XXRyh-ybxDs-unsplash.jpg",
  },
  {
    id: 103,
    name: "Reusable Steel Straws",
    price: 4.50,
    imageUrl: "home-mf\src\assets\images\maria-ilves-XXRyh-ybxDs-unsplash.jpg",
  },
  {
    id: 104,
    name: "Organic Dishwash Bar",
    price: 5.00,
    imageUrl: "home-mf\src\assets\images\maria-ilves-XXRyh-ybxDs-unsplash.jpg",
  },
];


export default function FeaturedProducts() {
  return (
    <div className="px-6 pb-10">
      <h2 className="text-2xl font-bold mb-5">Featured Eco Products</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {featuredProducts.map((p, i) => (
          <div key={i} className="card shadow hover:shadow-lg">
            <figure>
              <img src={p.img} alt={p.name} className="h-36 w-full object-cover" />
            </figure>
            <div className="card-body p-3">
              <h3 className="text-sm font-bold">{p.name}</h3>
              <p className="text-primary font-semibold">{p.price}</p>
              <button className="btn btn-sm btn-outline mt-2">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}