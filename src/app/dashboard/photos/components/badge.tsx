import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className, ...props }: BadgeProps) {
  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}
