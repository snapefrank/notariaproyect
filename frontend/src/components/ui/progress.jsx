import React from 'react';
import { cn } from '@/lib/utils';

const Progress = React.forwardRef(({ className, value = 0, ...props }, ref) => {
  const safeValue = Math.min(100, Math.max(0, Number(value) || 0));
  
  return (
    <div
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-gray-200",
        className
      )}
      {...props}
    >
      <div
        className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
});

Progress.displayName = "Progress";

export { Progress };