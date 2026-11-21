import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  text?: string;
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function LoadingSpinner({
  text = "Loading...",
  fullScreen = false,
  size = "md",
}: LoadingSpinnerProps) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-7 w-7",
    lg: "h-10 w-10",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${
        fullScreen ? "min-h-screen" : "py-12"
      }`}>
      <Loader2 className={`${sizes[size]} animate-spin text-primary`} />
      <p className="text-sm font-medium text-muted-foreground">{text}</p>
    </div>
  );
}
