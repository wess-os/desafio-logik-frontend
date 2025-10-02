import ProtectedRoute from "../components/ProtectedRoute";

// este layout envolverá todas as páginas dentro da pasta (admin)
export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
}