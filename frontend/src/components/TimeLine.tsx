import { Children, type ReactNode } from 'react';
import { cn } from '../utils/cn';

type TimeLineProps = {
  children?: ReactNode;
  lineColor?: string;
  itemGap?: number;
  verticalPadding?: number;
};

export default function TimeLine({
  children,
  itemGap,
  verticalPadding,
  lineColor = 'bg-zinc-300',
}: Readonly<TimeLineProps>) {
  // Normalizza i children in array per render uniforme.
  const items = Children.toArray(children);
  // Converte valori in "unità Tailwind" (step da 0.25rem) in stile inline.
  const spacingStyle =
    verticalPadding === undefined
      ? undefined
      : {
          paddingTop: `${verticalPadding * 0.25}rem`,
          paddingBottom: `${verticalPadding * 0.25}rem`,
        };
  const itemsStyle = itemGap === undefined ? undefined : { gap: `${itemGap * 0.25}rem` };

  return (
    <div className={'max-w-7xl'}>
      <div className="relative" style={spacingStyle}>
        {/* Linea verticale principale della timeline. */}
        <span
          className={`absolute top-0 left-[0.3rem] h-full w-0.5 ${lineColor} rounded-full`}
        ></span>
        <div className="flex flex-col gap-4" style={itemsStyle}>
          {items.map(item => item)}
        </div>
      </div>
    </div>
  );
}

type TimeLineItemProps = {
  children?: ReactNode;
  dotStyle?: string;
};

export function TimeLineItem({ children, dotStyle }: Readonly<TimeLineItemProps>) {
  return (
    <div className="relative flex flex-col gap-4">
      {/* Punto di ancoraggio del singolo elemento timeline. */}
      <span
        className={cn(`absolute -left-[0.1rem] mt-0.5 h-4 w-4 rounded-full bg-zinc-300`, dotStyle)}
      ></span>
      <div className="ml-6 w-full">{children}</div>
    </div>
  );
}
