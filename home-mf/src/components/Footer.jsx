import React from "react";

const Footer = ({ 
  brandName = "EcoMart",
  brandDescription = "Sustainable products for a greener planet. Shop eco-friendly essentials that reduce waste and protect nature.",
  socialLinks = [],
  onLinkClick = () => {}
}) => {
  
  const categoryLinks = [
    { id: 1, label: "Eco Detergents", href: "/category/eco-detergents" },
    { id: 2, label: "Bamboo Essentials", href: "/category/bamboo-essentials" },
    { id: 3, label: "Reusable Products", href: "/category/reusable-products" },
    { id: 4, label: "Eco Kitchen", href: "/category/eco-kitchen" },
  ];

  const companyLinks = [
    { id: 1, label: "About Us", href: "/about" },
    { id: 2, label: "Sustainability", href: "/sustainability" },
    { id: 3, label: "Contact", href: "/contact" },
    { id: 4, label: "Blog", href: "/blog" },
  ];

  const supportLinks = [
    { id: 1, label: "FAQs", href: "/faqs" },
    { id: 2, label: "Shipping", href: "/shipping" },
    { id: 3, label: "Returns", href: "/returns" },
    { id: 4, label: "Privacy Policy", href: "/privacy" },
  ];

  return (
    <footer className="footer p-10 bg-base-200 text-base-content mt-10">
      <aside>
        <h2 className="text-2xl font-bold text-primary mb-3">{brandName}</h2>
        <p className="max-w-xs mb-4">
          {brandDescription}
        </p>
        
        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="flex gap-3 mt-4">
            {socialLinks.map((social) => (
              <a 
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm btn-circle"
                aria-label={social.platform}
              >
                {social.icon}
              </a>
            ))}
          </div>
        )}
      </aside>

      <nav>
        <h6 className="footer-title">Categories</h6>
        {categoryLinks.map((link) => (
          <a 
            key={link.id}
            href={link.href}
            className="link link-hover"
            onClick={(e) => {
              e.preventDefault();
              onLinkClick(link);
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <nav>
        <h6 className="footer-title">Company</h6>
        {companyLinks.map((link) => (
          <a 
            key={link.id}
            href={link.href}
            className="link link-hover"
            onClick={(e) => {
              e.preventDefault();
              onLinkClick(link);
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <nav>
        <h6 className="footer-title">Support</h6>
        {supportLinks.map((link) => (
          <a 
            key={link.id}
            href={link.href}
            className="link link-hover"
            onClick={(e) => {
              e.preventDefault();
              onLinkClick(link);
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
};

export default Footer;