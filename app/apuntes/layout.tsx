import SidebarNav from "@/components/Navbar_Apuntes";

export default function ApuntesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden">
      <SidebarNav />
      <main className="flex-1 overflow-y-auto p-6 md:p-10">{children}</main>
    </div>
  );
}