
import React from 'react';

interface FeatureBadgeProps {
  text: string;
}

export const FeatureBadge: React.FC<FeatureBadgeProps> = ({ text }) => (
  <span className="px-4 py-2 bg-teal-500/20 text-white rounded-full text-sm font-medium">
    {text}
  </span>
);
