import DashboardLayout from "@/components/ui/DashboardLayout";
import { UserRole } from "@/lib/constants";

export default function CSLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardLayout role={UserRole.CUSTOMER_SERVICE} userName="Sarah Smith">
            {children}
        </DashboardLayout>
    );
}
