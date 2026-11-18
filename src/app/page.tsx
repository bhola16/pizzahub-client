import FeaturedMenu from "@/components/shared/FeaturedMenu";
import HeroSection from "@/components/shared/HeroSection";
import HowPizzaHubWorks from "@/components/shared/HowPizzaHubWorks";
import PizzaCategories from "@/components/shared/PizzaCategories";
import WhyChoosePizzaHub from "@/components/shared/WhyChoosePizzaHub";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturedMenu />
      <PizzaCategories />
      <WhyChoosePizzaHub />
      <HowPizzaHubWorks />
    </main>
  );
}
