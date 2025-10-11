import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@meetzeen/ui/src/components/card"
import { Button } from "@meetzeen/ui/src/components/button"

export function DeleteForm() {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Eliminar Empresa</CardTitle>
        <CardDescription>
          Eliminar tu empresa de Meetzeen. Esta acción es irreversible.
        </CardDescription>
      </CardHeader>
      <CardFooter className="justify-end">
        <Button variant="destructive">Eliminar empresa</Button>
      </CardFooter>
    </Card>
  )
}