import React from "react";
import { Logo } from "./Logo";
import { FeatureBadge } from "./FeatureBadge";

export const BrandSection: React.FC = () => (
  <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1C8CA8] to-[#157A93] p-12 flex-col justify-between">
    <div className="flex flex-col items-center justify-center flex-1 space-y-8">
      <Logo />

      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">SmartClinic</h1>
        <h2 className="text-2xl font-semibold text-white">
          Dialysis Management System
        </h2>
        <p className="text-cyan-50 max-w-md text-lg leading-relaxed">
          Advanced healthcare management platform for dialysis centers,
          providing comprehensive patient care and operational excellence.
        </p>
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        <FeatureBadge text="Patient Management" />
        <FeatureBadge text="Session Tracking" />
        <FeatureBadge text="Lab Integration" />
      </div>
    </div>
  </div>
);
