"use client"

import { Badge } from "@meetzeen/ui/src/components/badge";
import { useSlugQuery } from "@/modules/landing/slug/hooks/useSlugs"
import { IconUser, IconTag } from "@tabler/icons-react"
import Image from "next/image"

interface Employee {
  id: string;
  name: string;
  imageUrl: string | null;
  categories: {
    id: string;
    name: string;
  }[]
}

interface Organization {
  employees: Employee[];
}

interface ApiResponse {
  status: number;
  message: string;
  data: Organization;
}

interface TeamProps {
  slugName: string;
}

export function Team({ slugName }: TeamProps) {
  const { data, isLoading, isError } = useSlugQuery(slugName)
  
  if (isLoading || isError || !data) {
    return null;
  }

  const organization = (data as ApiResponse).data;
  const employees = organization.employees || [];

  if (employees.length === 0) {
    return (
      <div className="py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Nuestro Equipo</h2>
          <p className="text-muted-foreground">No hay empleados disponibles en este momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Nuestro Equipo</h2>
        <p className="text-muted-foreground">
          Conoce a nuestros profesionales
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {employees.map((employee) => (
          <div 
            key={employee.id} 
            className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all duration-200 text-center"
          >
            {/* Imagen del empleado */}
            <div className="mb-4 flex justify-center">
              {employee.imageUrl ? (
                <Image
                  src={employee.imageUrl}
                  alt={employee.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                  <IconUser className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>
            
            {/* Nombre del empleado */}
            <h4 className="text-lg font-medium text-card-foreground mb-3">
              {employee.name}
            </h4>
            
            {/* Categorías/Especialidades */}
            {employee.categories && employee.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {employee.categories.map((category) => (
                  <Badge 
                    key={category.id} 
                    variant="outline" 
                    className="flex items-center space-x-1 text-xs"
                  >
                    <IconTag className="w-3 h-3" />
                    <span>{category.name}</span>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}