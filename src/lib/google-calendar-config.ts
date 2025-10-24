// src/lib/google-calendar-config.ts

// IMPORTANTE: Reemplaza este Client ID con el tuyo propio obtenido de Google Cloud Console.
// Visita: https://console.cloud.google.com/apis/credentials
// Crea credenciales de tipo "ID de cliente de OAuth 2.0" para "Aplicación web".
// Asegúrate de añadir los orígenes de JavaScript autorizados (ej. http://localhost:3000 para desarrollo)
// y los URI de redireccionamiento autorizados (aunque para este flujo de token del lado del cliente, el redireccionamiento es manejado por el pop-up).
export const GOOGLE_CLIENT_ID = "1086526560028-kslhmr8trq08v95otbmgnpu03jo64oo5.apps.googleusercontent.com"; 

// Define los permisos que tu aplicación solicitará.
// Esto ahora incluye scopes para tanto Calendar como Tasks.
export const GOOGLE_API_SCOPES = "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/tasks";

// El API Key generalmente no es necesario para flujos OAuth 2.0 del lado del cliente con GSI,
// ya que el token de acceso se usa directamente para las llamadas a la API de Google.
// Se usaría más si se accede a APIs públicas de Google sin autenticación de usuario o
// para ciertos flujos del lado del servidor.
// export const GOOGLE_API_KEY = '1086526560028-kslhmr8trq08v95otbmgnpu03jo64oo5.apps.googleusercontent.com';
