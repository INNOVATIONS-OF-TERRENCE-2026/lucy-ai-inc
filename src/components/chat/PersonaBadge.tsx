import { Badge } from "@/components/ui/badge";
import { PERSONAS } from "@/lib/lucyPersonas";

interface PersonaBadgeProps {
  personaId: string;
  className?: string;
}

export function PersonaBadge({ personaId, className }: PersonaBadgeProps) {
  const persona = PERSONAS[personaId] || PERSONAS.default;
  
  if (personaId === 'default') return null;
  
  return (
    <Badge 
      variant="secondary" 
      className={`text-xs ${className}`}
    >
      {persona.emoji} {persona.name}
    </Badge>
  );
}
