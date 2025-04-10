import React from 'react';
import { Icon, EvervaultCard } from './evervault-card';

interface EvauvaultContainerProps {
  title: string;
  authorName: string;
}

const EvauvaultContainer: React.FC<EvauvaultContainerProps> = ({ title, authorName }) => {
  return (
    <div className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col items-start max-w-sm mx-auto p-4 relative h-[30rem]">
      <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

      <EvervaultCard text={title} />

      <h2 className="dark:text-white text-black mt-4 text-sm font-light">
        {authorName}
      </h2>
    </div>
  );
};

export default EvauvaultContainer;