import DashboardLayout from "@/components/ui/DashboardLayout";
import { UserRole } from "@/lib/constants";

export default function BranchLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardLayout role={UserRole.BRANCH_CONTROLLER} userName="Mike Johnson">
            {children}
        </DashboardLayout>
    );
}
