import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export const TestAnimations = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Testing motion.g SVG animations</h1>
      
      <svg width="400" height="300" viewBox="0 0 400 300" className="border border-gray-300">
        {/* Test 1: motion.g with scale */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2 }}
          style={{ transformOrigin: '100px 100px' }}
        >
          <circle cx="100" cy="100" r="40" fill="red" />
          <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" fill="white">
            Scale Test
          </text>
        </motion.g>
        
        {/* Test 2: motion.circle */}
        <motion.circle
          cx="300"
          cy="100"
          r="40"
          fill="blue"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2 }}
          style={{ transformOrigin: '300px 100px' }}
        />
        
        {/* Test 3: Simple rect without animation */}
        <rect x="50" y="200" width="80" height="80" fill="green" />
        
        {/* Test 4: motion.rect */}
        <motion.rect
          x="180"
          y="200"
          width="80"
          height="80"
          fill="orange"
          initial={{ scaleX: 0, scaleY: 0, opacity: 0 }}
          animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
          transition={{ duration: 2 }}
          style={{ transformOrigin: '220px 240px' }}
        />
      </svg>
      
      <p className="mt-4 text-sm text-gray-600">
        If you see animations (smooth growing), then motion.g works with SVG.
        Check browser console for any errors.
      </p>
    </div>
  );
};

export default TestAnimations;
