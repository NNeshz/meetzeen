import { BasicInfoForm } from "./components/basic-info-form";
import { ContactInfoForm } from "./components/contact-info-form";

export function Negocio() {
  return (
    <div className="space-y-12">
      <BasicInfoForm />
      <ContactInfoForm />
    </div>
  )
}