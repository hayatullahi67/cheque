import DashboardLayout from "@/components/ui/DashboardLayout";
import { UserRole } from "@/lib/constants";

export default function TellerLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardLayout role={UserRole.TELLER} userName="Alice Wong">
            {children}
        </DashboardLayout>
    );
}
