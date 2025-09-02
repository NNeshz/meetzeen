export function normalizeText(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      // Reemplazar acentos y caracteres especiales
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      // Reemplazar espacios y caracteres especiales con guiones
      .replace(/[^a-z0-9]+/g, "-")
      // Eliminar guiones al inicio y final
      .replace(/^-+|-+$/g, "")
      // Eliminar guiones consecutivos
      .replace(/-+/g, "-")
  );
}