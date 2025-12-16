"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const [slug, setSlug] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Extraer el slug de los params
    const slugParam = params.slug as string;
    setSlug(slugParam || null);
    setIsInitializing(false);
  }, [params]);

  // Mostrar loader mientras se inicializa
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay slug
  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="mt-2 text-gray-600">No se encontró el parámetro slug</p>
        </div>
      </div>
    );
  }

  // Vista principal con el slug
  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Página Dinámica</h1>
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Slug Detectado:
            </h2>
            <p className="text-2xl font-bold text-blue-600">{slug}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Información:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                Ruta actual:{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">/[slug]</code>
              </li>
              <li>
                Valor del slug:{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">{slug}</code>
              </li>
              <li>
                URL completa:{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  localhost:3000/{slug}
                </code>
              </li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              💡 <strong>Tip:</strong> Puedes usar este slug para cargar datos
              específicos, hacer consultas a tu API, o cualquier otra lógica de
              negocio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
