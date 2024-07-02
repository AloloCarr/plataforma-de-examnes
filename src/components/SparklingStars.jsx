// SparklingStars.jsx
import React, { useEffect } from 'react';
import '../pages/style.css';

const SparklingStars = () => {
  const getRandom = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  useEffect(() => {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
      const top = getRandom(0, 100) + 'vh';
      const left = getRandom(0, 100) + 'vw';
      const delay = getRandom(0, 1) + 's';

      star.style.top = top;
      star.style.left = left;
      star.style.animationDelay = delay;
    });
  }, []);

  return (
    <div className="sparkling-container">
      {[...Array(50)].map((_, index) => (
        <div key={index} className="star"></div>
      ))}
    </div>
  );
};

export default SparklingStars;
