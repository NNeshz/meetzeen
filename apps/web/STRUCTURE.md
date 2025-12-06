# Estructura de Carpetas - Meetzeen Web

## 📁 Estructura Propuesta

```
apps/web/
├── lib/                          # Configuraciones y clientes globales
│   ├── api/                      # Cliente API y configuración
│   │   └── client.ts            # apiClient (movido desde api/)
│   ├── auth/                     # Utilidades de autenticación
│   │   └── client.ts            # Funciones de auth (movido desde utils/)
│   └── query-client.ts          # React Query client config
│
├── modules/                      # Features organizados por dominio
│   ├── company/                  # Módulo de compañías
│   │   ├── components/          # Componentes específicos
│   │   │   └── create-form.tsx
│   │   ├── hooks/               # Hooks personalizados
│   │   │   └── use-company.ts
│   │   ├── services/            # Servicios/API calls
│   │   │   └── company.service.ts
│   │   ├── stores/              # Zustand stores
│   │   │   └── company.store.ts
│   │   ├── types/               # Tipos TypeScript
│   │   │   └── company.types.ts
│   │   ├── constants/           # Constantes del módulo
│   │   │   ├── timezones.ts
│   │   │   └── currencies.ts
│   │   ├── utils/               # Utilidades específicas
│   │   │   └── company.utils.ts
│   │   └── index.ts             # Barrel exports
│   │
│   ├── dashboard/                # Módulo de dashboard
│   │   ├── components/
│   │   │   └── common/          # Componentes compartidos
│   │   ├── hooks/
│   │   ├── stores/
│   │   └── index.ts
│   │
│   └── landing/                  # Módulo de landing
│       ├── components/
│       └── index.ts
│
├── app/                          # Next.js App Router
│   └── (private)/
│       └── (create)/
│           └── create/
│               └── page.tsx
│
└── utils/                        # Utilidades globales compartidas
    └── format.ts                 # Funciones de formato, etc.
```

## 🎯 Principios de Organización

### 1. **Feature-Based Architecture**
Cada módulo es autocontenido con todo lo que necesita:
- Componentes
- Hooks
- Servicios
- Stores
- Tipos
- Constantes
- Utilidades

### 2. **Barrel Exports (index.ts)**
Cada módulo exporta su API pública a través de `index.ts`:
```typescript
// modules/company/index.ts
export { CreateForm } from './components/create-form';
export { useCompany } from './hooks/use-company';
export { companyService } from './services/company.service';
export { useCompanyStore } from './stores/company.store';
export type { Company, CreateCompanyDto } from './types/company.types';
```

### 3. **Separación de Responsabilidades**
- **lib/**: Configuraciones globales, clientes compartidos
- **modules/**: Lógica de negocio por feature
- **app/**: Rutas y layouts de Next.js
- **utils/**: Utilidades genéricas reutilizables

## 📝 Convenciones de Nombres

- **Componentes**: PascalCase (ej: `CreateForm.tsx`)
- **Hooks**: camelCase con prefijo `use-` (ej: `use-company.ts`)
- **Servicios**: camelCase con sufijo `.service.ts` (ej: `company.service.ts`)
- **Stores**: camelCase con sufijo `.store.ts` (ej: `company.store.ts`)
- **Tipos**: camelCase con sufijo `.types.ts` (ej: `company.types.ts`)
- **Constantes**: camelCase con sufijo `.ts` (ej: `timezones.ts`)
- **Utils**: camelCase con sufijo `.utils.ts` (ej: `company.utils.ts`)

## ✅ Migración Completada

1. ✅ Movido `api/api-connection.ts` → `lib/api/client.ts`
2. ✅ Movido `utils/auth-connection.ts` → `lib/auth/client.ts`
3. ✅ Reorganizado `modules/create/` → `modules/company/`
4. ✅ Separadas constantes (timezones, currencies) en `constants/`
5. ✅ Creado store de Zustand en `stores/company.store.ts`
6. ✅ Creados tipos en `types/company.types.ts`
7. ✅ Creado barrel export en `index.ts`

## 📦 Ejemplo de Uso

### Importar desde el módulo
```typescript
// Importar todo desde el barrel export
import { 
  CreateForm, 
  useCompany, 
  companyService,
  useCompanyStore,
  type Company 
} from "@/modules/company";

// O importar específicamente
import { CreateForm } from "@/modules/company/components/create-form";
import { useCompany } from "@/modules/company/hooks/use-company";
```

### Usar el hook
```typescript
const { createCompany, isCreating } = useCompany();

createCompany({
  name: "Mi Compañía",
  timezone: "America/Mexico_City",
  currency: "MXN"
}, {
  onSuccess: () => {
    // Redirigir o mostrar mensaje
  }
});
```

### Usar el store de Zustand
```typescript
const { currentCompany, setCurrentCompany } = useCompanyStore();
```

## 🎨 Próximos Pasos Recomendados

1. **Agregar más módulos** siguiendo la misma estructura
2. **Crear un query client** en `lib/query-client.ts` para React Query
3. **Agregar validación de errores** en los servicios
4. **Crear hooks de query** para listar compañías
5. **Agregar tests** para cada módulo
