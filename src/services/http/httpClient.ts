import { API_BASE_URL } from '../../constants/config';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type QueryParamValue = string | number | undefined;

function buildQueryString(params?: Record<string, QueryParamValue>): string {
  if (!params) return '';

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

export async function request<T>(
  path: string,
  params?: Record<string, QueryParamValue>,
): Promise<T> {
  const url = `${API_BASE_URL}${path}${buildQueryString(params)}`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor. Verifica tu conexión.');
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new ApiError(404, 'El recurso solicitado no existe.');
    }
    throw new ApiError(response.status, 'Ocurrió un error en el servidor. Intenta nuevamente.');
  }

  return (await response.json()) as T;
}
