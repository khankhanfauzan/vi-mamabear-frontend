import AdminNavbar from "@/components/layout/admin-navigation/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen lg:pl-[var(--admin-sidebar-width)]">
      <AdminNavbar />
      {/* Pages like Home, Search, Product Detail render here */}
      <main className="page-max-width w-full page-spacing my-4 lg:my-8">{children}</main>
    </div>
  );
}
