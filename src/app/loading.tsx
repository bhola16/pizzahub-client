import LoadingSpinner from "@/components/ui/loading-spinner";

export default function Loading() {
  return (
    <LoadingSpinner
      text="Preparing your PizzaHub experience..."
      fullScreen
      size="lg"
    />
  );
}
