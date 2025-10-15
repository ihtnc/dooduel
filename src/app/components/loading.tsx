"use client";

import { cn } from '@utilities/index';
import RefreshIcon from './icons/refreshIcon';

const Loading = ({
  className = ""
}: {
  className?: string
}) => {
  return (
    <RefreshIcon
      alt="Loading"
      className={cn("animate-spin", "size-12", className.split(" ") || [])}
    />
  );
};

export default Loading;