import { Footer } from "@/components/Footer";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <header></header>
        <main className="flex-1">
            {children}
        </main>
        <footer></footer>
    </>
  );
}