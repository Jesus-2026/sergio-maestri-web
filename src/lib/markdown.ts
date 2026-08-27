/**
 * Markdown en línea para los ítems de prensa, blog y otras publicaciones.
 *
 * Solo soporta lo que el contenido realmente usa —cursivas y enlaces—
 * y evita sumar una dependencia como `marked` para diez líneas.
 *
 * Escapa el HTML ANTES de aplicar los patrones: el contenido viene del
 * panel de administración y no debe poder inyectar etiquetas.
 */
const escapar = (s: string): string =>
  s.replace(/&/g, '&amp;')
   .replace(/</g, '&lt;')
   .replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;');

export function inline(texto: string): string {
  return escapar(texto)
    // [texto](https://url) — solo http(s) y mailto
    .replace(
      /\[([^\]]+)\]\(((?:https?:|mailto:)[^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>'
    )
    // *cursiva*
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}
