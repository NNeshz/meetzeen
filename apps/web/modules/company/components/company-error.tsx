export function CompanyError() {
  return (
    <div className="w-full border border-border">
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-lg">
              Error al obtener la compañia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
