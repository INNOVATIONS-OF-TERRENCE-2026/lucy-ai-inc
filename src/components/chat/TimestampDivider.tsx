import { format, isToday, isYesterday } from 'date-fns';

interface TimestampDividerProps {
  timestamp: string;
}

export function TimestampDivider({ timestamp }: TimestampDividerProps) {
  const date = new Date(timestamp);
  
  const getDateLabel = () => {
    if (isToday(date)) {
      return `Today – ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday – ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMMM d, yyyy – h:mm a');
    }
  };

  return (
    <div className="flex items-center gap-4 my-8">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent shadow-glow-violet" />
      <span className="text-xs text-muted-foreground font-medium tracking-wide px-3 py-1.5 rounded-full glass-card">
        {getDateLabel()}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent shadow-glow-violet" />
    </div>
  );
}
