import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getUser } from "@/app/lib/dal";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  return (
    <>
        <Header name={user?.user.name} />
        <main className="flex flex-1">
            {children}
        </main>
        <Footer />
    </>
  );
}