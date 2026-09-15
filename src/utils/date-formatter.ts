// Proporciona formato localizado amigable sin alterar el valor ISO 8601 del modelo.
export function formatDate(isoDate: string): string {
  if (!isoDate) {
    return '—';
  }

  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) {
      return isoDate;
    }

    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoDate;
  }
}
