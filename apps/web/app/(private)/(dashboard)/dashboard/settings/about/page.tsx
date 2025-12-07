import { CompanyHoraryOpen } from "@/modules/company/components/company-horary-open";
import { CompanyHoraryClose } from "@/modules/company/components/company-horary-close";
import { CompanyWorkdays } from "@/modules/company/components/company-workdays";
import { CompanySocials } from "@/modules/company/components/company-socials";
import { CompanyLocation } from "@/modules/company/components/company-location";

export default function SettingsAboutPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-8">
        <CompanyWorkdays />
        <CompanyHoraryOpen />
        <CompanyHoraryClose />
        <CompanyLocation />
        <CompanySocials />
      </div>
    </div>
  );
}