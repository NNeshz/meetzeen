import { db, account } from "@meetzeen/database";
import { eq, and } from "drizzle-orm";

interface CalendarEventData {
  summary: string;
  description: string;
  location?: string;
  startDateTime: string; // ISO 8601 format
  endDateTime: string; // ISO 8601 format
  timezone: string;
  attendees: { email: string; displayName?: string }[];
  organizerEmail: string;
}

interface GoogleTokens {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date | null;
}

export class GoogleCalendarService {
  private readonly GOOGLE_CALENDAR_API_URL =
    "https://www.googleapis.com/calendar/v3";

  /**
   * Obtiene los tokens de Google de un usuario
   */
  async getUserGoogleTokens(userId: string): Promise<GoogleTokens | null> {
    const googleAccount = await db.query.account.findFirst({
      where: and(eq(account.userId, userId), eq(account.providerId, "google")),
    });

    if (!googleAccount || !googleAccount.accessToken) {
      return null;
    }

    return {
      accessToken: googleAccount.accessToken,
      refreshToken: googleAccount.refreshToken,
      expiresAt: googleAccount.accessTokenExpiresAt
        ? new Date(googleAccount.accessTokenExpiresAt)
        : null,
    };
  }

  /**
   * Refresca el access token si ha expirado
   */
  private async refreshAccessToken(
    userId: string,
    refreshToken: string
  ): Promise<string | null> {
    try {
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }),
      });

      if (!response.ok) {
        console.error("Error refreshing token:", await response.text());
        return null;
      }

      const data = (await response.json()) as {
        access_token: string;
        expires_in: number;
      };
      const newAccessToken = data.access_token;
      const expiresIn = data.expires_in;

      // Actualizar el token en la base de datos
      await db
        .update(account)
        .set({
          accessToken: newAccessToken,
          accessTokenExpiresAt: new Date(
            Date.now() + expiresIn * 1000
          ).toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .where(and(eq(account.userId, userId), eq(account.providerId, "google")));

      return newAccessToken;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      return null;
    }
  }

  /**
   * Obtiene un access token válido (refrescando si es necesario)
   */
  private async getValidAccessToken(userId: string): Promise<string | null> {
    const tokens = await this.getUserGoogleTokens(userId);

    if (!tokens) {
      return null;
    }

    // Verificar si el token ha expirado (con 5 minutos de margen)
    const isExpired =
      tokens.expiresAt && tokens.expiresAt.getTime() < Date.now() + 5 * 60 * 1000;

    if (isExpired && tokens.refreshToken) {
      return await this.refreshAccessToken(userId, tokens.refreshToken);
    }

    return tokens.accessToken;
  }

  /**
   * Crea un evento en Google Calendar
   */
  async createCalendarEvent(
    userId: string,
    eventData: CalendarEventData
  ): Promise<{ success: boolean; eventId?: string; error?: string }> {
    const accessToken = await this.getValidAccessToken(userId);

    if (!accessToken) {
      return {
        success: false,
        error:
          "No se encontraron credenciales de Google para este usuario. El usuario debe volver a iniciar sesión.",
      };
    }

    try {
      const event = {
        summary: eventData.summary,
        description: eventData.description,
        location: eventData.location,
        start: {
          dateTime: eventData.startDateTime,
          timeZone: eventData.timezone,
        },
        end: {
          dateTime: eventData.endDateTime,
          timeZone: eventData.timezone,
        },
        attendees: eventData.attendees.map((attendee) => ({
          email: attendee.email,
          displayName: attendee.displayName,
        })),
        // Configuración de recordatorios: 1 hora antes
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 60 },
            { method: "popup", minutes: 60 },
          ],
        },
        // Enviar notificaciones a los invitados
        guestsCanModify: false,
        guestsCanInviteOthers: false,
        guestsCanSeeOtherGuests: true,
      };

      const response = await fetch(
        `${this.GOOGLE_CALENDAR_API_URL}/calendars/primary/events?sendUpdates=all`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error creating calendar event:", errorText);
        return {
          success: false,
          error: `Error al crear el evento en Google Calendar: ${response.status}`,
        };
      }

      const createdEvent = (await response.json()) as { id: string };
      return {
        success: true,
        eventId: createdEvent.id,
      };
    } catch (error) {
      console.error("Error creating calendar event:", error);
      return {
        success: false,
        error: "Error inesperado al crear el evento en Google Calendar",
      };
    }
  }

  /**
   * Actualiza un evento existente en Google Calendar
   */
  async updateCalendarEvent(
    userId: string,
    eventId: string,
    eventData: Partial<CalendarEventData>
  ): Promise<{ success: boolean; error?: string }> {
    const accessToken = await this.getValidAccessToken(userId);

    if (!accessToken) {
      return {
        success: false,
        error: "No se encontraron credenciales de Google para este usuario",
      };
    }

    try {
      const updateBody: Record<string, unknown> = {};

      if (eventData.summary) updateBody.summary = eventData.summary;
      if (eventData.description) updateBody.description = eventData.description;
      if (eventData.location) updateBody.location = eventData.location;
      if (eventData.startDateTime && eventData.timezone) {
        updateBody.start = {
          dateTime: eventData.startDateTime,
          timeZone: eventData.timezone,
        };
      }
      if (eventData.endDateTime && eventData.timezone) {
        updateBody.end = {
          dateTime: eventData.endDateTime,
          timeZone: eventData.timezone,
        };
      }
      if (eventData.attendees) {
        updateBody.attendees = eventData.attendees.map((attendee) => ({
          email: attendee.email,
          displayName: attendee.displayName,
        }));
      }

      const response = await fetch(
        `${this.GOOGLE_CALENDAR_API_URL}/calendars/primary/events/${eventId}?sendUpdates=all`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error updating calendar event:", errorText);
        return {
          success: false,
          error: `Error al actualizar el evento: ${response.status}`,
        };
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating calendar event:", error);
      return {
        success: false,
        error: "Error inesperado al actualizar el evento",
      };
    }
  }

  /**
   * Elimina un evento de Google Calendar
   */
  async deleteCalendarEvent(
    userId: string,
    eventId: string
  ): Promise<{ success: boolean; error?: string }> {
    const accessToken = await this.getValidAccessToken(userId);

    if (!accessToken) {
      return {
        success: false,
        error: "No se encontraron credenciales de Google para este usuario",
      };
    }

    try {
      const response = await fetch(
        `${this.GOOGLE_CALENDAR_API_URL}/calendars/primary/events/${eventId}?sendUpdates=all`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok && response.status !== 410) {
        // 410 = ya eliminado
        const errorText = await response.text();
        console.error("Error deleting calendar event:", errorText);
        return {
          success: false,
          error: `Error al eliminar el evento: ${response.status}`,
        };
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting calendar event:", error);
      return {
        success: false,
        error: "Error inesperado al eliminar el evento",
      };
    }
  }
}

