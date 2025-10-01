'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@meetzeen/ui/components/card'
import { Button } from '@meetzeen/ui/components/button'
import { Badge } from '@meetzeen/ui/components/badge'
import { Separator } from '@meetzeen/ui/components/separator'
import { 
  Clock, 
  Calendar, 
  User, 
  DollarSign, 
  GripVertical,
  Edit,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useBookingStore, type ServiceSlot } from '../store/useBookingStore'
import { useStepsStore } from '../store/useStepsStore'

interface ServiceItem {
  id: string
  service: any
  employee: any
  selection: any
  originalIndex: number
}

interface SortableServiceItemProps {
  item: ServiceItem
  index: number
  isUsingSlot: boolean
  isDragOverlay?: boolean
}

function SortableServiceItem({ item, index, isUsingSlot, isDragOverlay = false }: SortableServiceItemProps) {
  const { service, employee, selection } = item
  const canDrag = isUsingSlot && !isDragOverlay
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: item.id,
    disabled: !canDrag
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const formatServiceDuration = (duration: string) => {
    if (/^\d+$/.test(duration)) {
      return `${duration} min`
    }
    return duration
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`
        p-4 border rounded-lg transition-all duration-200
        ${isDragging ? 'opacity-50' : ''}
        ${isDragOverlay ? 'shadow-lg' : ''}
        ${canDrag ? 'cursor-move hover:border-muted-foreground/50' : ''}
        border-border bg-background
      `}
    >
      <div className="flex items-start gap-3">
        {canDrag && (
          <div 
            className="flex items-center"
            {...listeners}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        )}

        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-foreground">{service.name}</h4>
              <p className="text-sm text-muted-foreground">
                con {employee.name}
              </p>
            </div>
            <div className="text-right">
              <div className="font-medium text-foreground">${service.price}</div>
              <div className="text-sm text-muted-foreground">
                {formatServiceDuration(service.duration)}
              </div>
            </div>
          </div>

          {selection.selectedDate && selection.selectedTime && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {selection.selectedDate.toLocaleDateString('es-ES', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{selection.selectedTime}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function Resume() {
  const { 
    selectedServicesWithEmployees,
    serviceSelections,
    isUsingSlot,
    reorderSlotServices,
    getServiceSelection,
    customerData
  } = useBookingStore()
  const { nextStep, prevStep } = useStepsStore()
  
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Obtener servicios ordenados
  const getOrderedServices = (): ServiceItem[] => {
    const services: ServiceItem[] = []

    selectedServicesWithEmployees.forEach((item, serviceIndex) => {
      item.selectedEmployees.forEach((employee, empIndex) => {
        const selection = getServiceSelection(item.service.id, employee.id)
        if (selection) {
          services.push({
            id: `${item.service.id}-${employee.id}`,
            service: item.service,
            employee,
            selection,
            originalIndex: services.length
          })
        }
      })
    })

    // Ordenar por order si está usando slot, sino por índice original
    if (isUsingSlot) {
      return services.sort((a, b) => (a.selection.order || 0) - (b.selection.order || 0))
    }
    
    return services
  }

  const orderedServices = getOrderedServices()

  // Calcular totales
  const calculateTotals = () => {
    let totalPrice = 0
    let totalDuration = 0

    orderedServices.forEach(({ service }) => {
      totalPrice += service.price
      
      // Parsear duración
      const duration = service.duration
      if (/^\d+$/.test(duration)) {
        totalDuration += parseInt(duration)
      } else {
        let minutes = 0
        const hourMatch = duration.match(/(\d+)h/)
        const minuteMatch = duration.match(/(\d+)m/)
        
        if (hourMatch) minutes += parseInt(hourMatch[1]) * 60
        if (minuteMatch) minutes += parseInt(minuteMatch[1])
        
        totalDuration += minutes
      }
    })

    return { totalPrice, totalDuration }
  }

  const { totalPrice, totalDuration } = calculateTotals()

  // Formatear duración total
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins} min`
    } else if (hours > 0) {
      return `${hours}h`
    } else {
      return `${mins} min`
    }
  }

  // Handlers para drag and drop
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id && over?.id) {
      const oldIndex = orderedServices.findIndex(item => item.id === active.id)
      const newIndex = orderedServices.findIndex(item => item.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(orderedServices, oldIndex, newIndex)

        // Crear el nuevo orden de slots para enviar al store
        const updatedSlots: ServiceSlot[] = newOrder.map((item, index) => ({
          serviceId: item.service.id,
          employeeId: item.employee.id,
          startTime: '', // Se calculará en el store
          endTime: '', // Se calculará en el store
          order: index + 1
        }))

        reorderSlotServices(updatedSlots)
        
        // Mostrar toast de confirmación
        toast.success('Orden actualizado', {
          description: 'Los horarios se han ajustado automáticamente'
        })
      }
    }

    setActiveId(null)
  }

  // Renderizar información del cliente
  const renderCustomerInfo = () => {
    if (!customerData.name && !customerData.email && !customerData.phone) {
      return null
    }

    return (
      <Card className="mb-6 border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            Información del cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {customerData.name && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nombre:</span>
              <span className="font-medium">{customerData.name}</span>
            </div>
          )}
          {customerData.email && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{customerData.email}</span>
            </div>
          )}
          {customerData.phone && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Teléfono:</span>
              <span className="font-medium">{customerData.phone}</span>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Encontrar el item activo para el drag overlay
  const activeItem = activeId ? orderedServices.find(item => item.id === activeId) : null

  if (orderedServices.length === 0) {
    return (
      <div className="py-12 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No hay servicios seleccionados</h3>
        <p className="text-muted-foreground mb-6">
          Regresa al paso anterior para seleccionar tus servicios y horarios.
        </p>
        <Button onClick={prevStep} variant="outline">
          Regresar
        </Button>
      </div>
    )
  }

  return (
    <div className="py-12 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Resumen de tu cita</h2>
        <p className="text-muted-foreground">
          Revisa los detalles de tu reserva antes de confirmar
        </p>
      </div>

      {/* Información del cliente */}
      {renderCustomerInfo()}

      {/* Lista de servicios */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5" />
              Servicios programados
            </span>
            {isUsingSlot && orderedServices.length > 1 && (
              <Badge variant="secondary" className="text-xs">
                Arrastra para reordenar
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={orderedServices.map(item => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {orderedServices.map((item, index) => (
                  <SortableServiceItem
                    key={item.id}
                    item={item}
                    index={index}
                    isUsingSlot={isUsingSlot}
                  />
                ))}
              </div>
            </SortableContext>
            
            <DragOverlay>
              {activeItem ? (
                <SortableServiceItem
                  item={activeItem}
                  index={orderedServices.findIndex(item => item.id === activeItem.id)}
                  isUsingSlot={isUsingSlot}
                  isDragOverlay={true}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </CardContent>
      </Card>

      {/* Resumen de totales */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5" />
            Resumen de costos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {orderedServices.map(({ service, employee, id }) => (
              <div key={id} className="flex justify-between text-sm">
                <span className="text-foreground">{service.name} - {employee.name}</span>
                <span className="font-medium">${service.price}</span>
              </div>
            ))}
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-foreground">Total</div>
                <div className="text-sm text-muted-foreground">
                  Duración total: {formatDuration(totalDuration)}
                </div>
              </div>
              <div className="text-xl font-bold">${totalPrice}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información adicional para slots */}
      {isUsingSlot && orderedServices.length > 1 && (
        <Card className="border-muted bg-muted/30">
          <CardContent>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-foreground mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-1">
                  Servicios programados consecutivamente
                </h4>
                <p className="text-sm text-muted-foreground">
                  Tus servicios están programados uno después del otro. 
                  Puedes cambiar el orden arrastrando los elementos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botones de navegación */}
      <div className="flex justify-between items-center">
        <Button onClick={prevStep} variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Modificar selección
        </Button>
        
        <Button onClick={nextStep} size="sm">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Mis datos
        </Button>
      </div>
    </div>
  )
}