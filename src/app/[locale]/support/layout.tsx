import Footer from "@/app/components/common/Footer";
import Header from "@/app/components/common/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
