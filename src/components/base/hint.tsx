import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

type HintProps = {
  text?: string;
  children?: React.ReactNode;
};

export default function Hint({ text, children }: HintProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  );
}
