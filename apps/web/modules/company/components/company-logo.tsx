export function CompanyLogo() {
  return (
    <div className="w-full border border-border">
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div>
          <p className="font-semibold text-lg">Logo de la empresa</p>
          <p className="text-sm text-muted-foreground">
            Este es el logo de tu empresa. Haz click para subir un nuevo logo
            desde tus archivos.
          </p>
        </div>
        <div className="bg-red-500 aspect-square w-16 h-16">
          
        </div>
      </div>
      <div className="p-4 text-sm text-muted-foreground">Un logo es opcional pero demasiado recomendado.</div>
    </div>
  );
}
