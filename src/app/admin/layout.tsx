import DashboardLayout from "@/components/ui/DashboardLayout";
import { UserRole } from "@/lib/constants";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardLayout role={UserRole.ADMIN} userName="System Admin">
            {children}
        </DashboardLayout>
    );
}
