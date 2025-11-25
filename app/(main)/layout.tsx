export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
            {children}
        </div>
    );
}
