import DashboardLayout from "@/components/ui/DashboardLayout";
import { UserRole } from "@/lib/constants";

export default function TreasuryLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardLayout role={UserRole.TREASURY} userName="Robert Brown">
            {children}
        </DashboardLayout>
    );
}
