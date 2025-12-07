import { CompanyLogo } from "@/modules/company/components/company-logo";
import { CompanyName } from "@/modules/company/components/company-name";
import { CompanySlug } from "@/modules/company/components/company-slug";
import { CompanyTimezone } from "@/modules/company/components/company-timezone";
import { CompanyCurrency } from "@/modules/company/components/company-currency";

export default function SettingsPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-8">
        <CompanyLogo />
        <CompanyName />
        <CompanySlug />
        <CompanyTimezone />
        <CompanyCurrency />
      </div>
    </div>
  );
}
