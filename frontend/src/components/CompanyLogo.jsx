import React, { useState } from 'react';

const logoOverrides = {
  "Coalition Technologies": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Coalition_Technologies_Logo.png",
  "LawnStarter": "https://upload.wikimedia.org/wikipedia/commons/b/b8/LawnStarter_Logo.png",
  "The Obesity Society": "https://upload.wikimedia.org/wikipedia/commons/1/12/The_Obesity_Society_Logo.png",
  "Lemon.io": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Wikimedia_Commons_logo.svg", // safe default vector
  "Clipster": "https://upload.wikimedia.org/wikipedia/commons/b/b5/YouTube_Play_Button_Icon.svg",
  "Mitre Media": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Medium_logo_template.svg",
  "Google": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
  "Microsoft": "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  "Amazon": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  "Apple": "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  "Meta": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
  "Netflix": "https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg",
  "OpenAI": "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg",
  "Stripe": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
  "Spotify": "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo.svg",
  "Airbnb": "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg",
  "Uber": "https://upload.wikimedia.org/wikipedia/commons/5/58/Uber_logo_2018.svg",
  "GitHub": "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
};

export default function CompanyLogo({ src, company, size = "w-12 h-12 text-sm" }) {
  const [error, setError] = useState(false);

  // Generate initials (up to 2 letters)
  const getInitials = (name) => {
    if (!name) return 'C';
    const parts = name.split(' ').filter(p => p.length > 0);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Generate a consistent, attractive color based on company name hash
  const getColorClass = (name) => {
    if (!name) return 'bg-[#7ED321]/10 text-[#59C414] border-[#7ED321]/20';
    const colors = [
      'bg-emerald-50 text-emerald-600 border-emerald-200',
      'bg-indigo-50 text-indigo-600 border-indigo-200',
      'bg-blue-50 text-blue-600 border-blue-200',
      'bg-violet-50 text-violet-600 border-violet-200',
      'bg-amber-50 text-amber-600 border-amber-200',
      'bg-rose-50 text-rose-600 border-rose-200',
      'bg-cyan-50 text-cyan-600 border-cyan-200',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  // Check if we have a hardcoded URL override for this company
  const imageUrl = logoOverrides[company] || src;

  if (!imageUrl || error) {
    return (
      <div className={`${size} rounded-xl border flex items-center justify-center font-bold flex-shrink-0 tracking-tight ${getColorClass(company)}`}>
        {getInitials(company)}
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={`${company} logo`}
      onError={() => setError(true)}
      className={`${size} rounded-xl object-contain border border-[#E6E6E2] bg-white p-1 flex-shrink-0`}
      loading="lazy"
    />
  );
}
