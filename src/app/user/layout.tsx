import DashboardLayout from "@/components/ui/DashboardLayout";
import { UserRole } from "@/lib/constants";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardLayout role={UserRole.USER} userName="John Doe">
            {children}
        </DashboardLayout>
    );
}
