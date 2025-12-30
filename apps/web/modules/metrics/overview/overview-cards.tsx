import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@meetzeen/ui/src/components/card";
import {
  IconCalendarEvent,
  IconCancel,
  IconCheck,
  IconClock,
  IconCurrencyDollar,
  IconAlertCircle,
} from "@tabler/icons-react";

export function OverviewCards() {
  return (
    <div className="flex overflow-x-auto pb-4 gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0 w-full snap-x snap-mandatory ">
      <Card className="min-w-[300px] flex-shrink-0 snap-center h-56 flex flex-col hover:bg-card/50 transition-colors md:min-w-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <IconCalendarEvent className="w-4 h-4" /> Total de citas
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Total de citas agendadas
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 justify-end mt-auto">
          <div className="text-4xl font-semibold">120</div>
          <p className="text-sm text-muted-foreground">
            Total de citas agendadas
          </p>
        </CardContent>
      </Card>

      <Card className="min-w-[300px] flex-shrink-0 snap-center h-56 flex flex-col hover:bg-card/50 transition-colors md:min-w-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <IconCheck className="w-4 h-4" /> Citas completadas
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Total de citas completadas
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 justify-end mt-auto">
          <div className="text-4xl font-semibold">80</div>
          <p className="text-sm text-muted-foreground">
            Citas completadas este mes
          </p>
        </CardContent>
      </Card>

      <Card className="min-w-[300px] flex-shrink-0 snap-center h-56 flex flex-col hover:bg-card/50 transition-colors md:min-w-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <IconCancel className="w-4 h-4" /> Citas canceladas
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Citas canceladas este mes
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 justify-end mt-auto">
          <div className="text-4xl font-semibold">20</div>
          <p className="text-sm text-muted-foreground">
            Citas canceladas este mes
          </p>
        </CardContent>
      </Card>

      <Card className="min-w-[300px] flex-shrink-0 snap-center h-56 flex flex-col hover:bg-card/50 transition-colors md:min-w-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <IconClock className="w-4 h-4" /> Citas pendientes
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Citas pendientes este mes
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 justify-end mt-auto">
          <div className="text-4xl font-semibold">20</div>
          <p className="text-sm text-muted-foreground">
            Citas pendientes este mes
          </p>
        </CardContent>
      </Card>

      <Card className="min-w-[300px] flex-shrink-0 snap-center h-56 flex flex-col hover:bg-card/50 transition-colors md:min-w-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <IconCalendarEvent className="w-4 h-4" /> Clientes nuevos
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Clientes nuevos este mes
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 justify-end mt-auto">
          <div className="text-4xl font-semibold">10</div>
          <p className="text-sm text-muted-foreground">
            3% más comparado con el mes anterior
          </p>
        </CardContent>
      </Card>

      <Card className="min-w-[300px] flex-shrink-0 snap-center h-56 flex flex-col hover:bg-card/50 transition-colors md:min-w-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <IconCalendarEvent className="w-4 h-4" /> Clientes totales
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Clientes totales en la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 justify-end mt-auto">
          <div className="text-4xl font-semibold">100</div>
          <p className="text-sm text-muted-foreground">
            Clientes totales en la plataforma
          </p>
        </CardContent>
      </Card>

      <Card className="min-w-[300px] flex-shrink-0 snap-center h-56 flex flex-col hover:bg-card/50 transition-colors md:min-w-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <IconAlertCircle className="w-4 h-4" /> Perdidas en dinero
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Perdidas en dinero este mes
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 justify-end mt-auto">
          <div className="text-4xl font-semibold">$230</div>
          <p className="text-sm text-muted-foreground">
            Perdidas en dinero este mes
          </p>
        </CardContent>
      </Card>

      <Card className="min-w-[300px] flex-shrink-0 snap-center h-56 flex flex-col hover:bg-card/50 transition-colors md:min-w-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <IconCurrencyDollar className="w-4 h-4" /> Ganancias en dinero
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Ganancias en dinero este mes
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 justify-end mt-auto">
          <div className="text-4xl font-semibold">$1040</div>
          <p className="text-sm text-muted-foreground">
            Ganancias en dinero este mes
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
