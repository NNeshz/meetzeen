import { db, member, invitation, organization, user } from "@meetzeen/database";
import { and, eq } from "drizzle-orm";
import { hasAdminPermissions } from "@meetzeen/api/src/modules/company/constants/company.constants";
import { nanoid } from "nanoid";
import { sendInvitationEmail } from "@meetzeen/auth/email";

export class InvitationsService {
  constructor() {}

  async createInvitation(
    email: string,
    role: string,
    userId: string,
    organizationId: string
  ) {
    // Obtener el miembro con los datos del usuario
    const memberRecord = await db
      .select({
        id: member.id,
        organizationId: member.organizationId,
        userId: member.userId,
        role: member.role,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
        userName: user.name,
        userEmail: user.email,
      })
      .from(member)
      .innerJoin(user, eq(member.userId, user.id))
      .where(
        and(
          eq(member.userId, userId),
          eq(member.organizationId, organizationId)
        )
      )
      .then((res) => res[0]);

    if (!memberRecord || !hasAdminPermissions(memberRecord.role)) {
      throw new Error(
        "No tienes permisos para invitar usuarios a esta organización."
      );
    }

    // Verificar si ya existe una invitación pendiente para el email
    const invitationRecord = await db
      .select()
      .from(invitation)
      .where(
        and(
          eq(invitation.email, email),
          eq(invitation.organizationId, organizationId)
        )
      );

    if (invitationRecord.length > 0) {
      throw new Error("Ya existe una invitación pendiente para este email.");
    }

    // Crear el token y la invitación
    const token = nanoid(32);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Crear objeto de invitación
    const newInvitation = {
      email,
      organizationId,
      role,
      token,
      inviterId: userId,
      status: "pending",
      expiresAt: expiresAt.toISOString(),
    };

    const [insertedInvitation] = await db
      .insert(invitation)
      .values(newInvitation)
      .returning();

    if (!insertedInvitation) {
      throw new Error("Error al crear la invitación");
    }

    const company = await db
      .select()
      .from(organization)
      .where(eq(organization.id, organizationId))
      .then((res) => res[0]);

    if (!company) {
      throw new Error("Organización no encontrada");
    }

    // Crear magic link
    const magicLink = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/accept-invitation?token=${token}`;

    // Enviar email
    await sendInvitationEmail(
      email,
      company.name,
      memberRecord.userName || memberRecord.userEmail,
      magicLink,
      role
    );

    return {
      success: true,
      message: "Invitación enviada exitosamente",
      invitation: {
        id: insertedInvitation.id,
        email: insertedInvitation.email,
        role: insertedInvitation.role,
        expiresAt: insertedInvitation.expiresAt,
      },
    };
  }

  async acceptInvitation(token: string) {
    // Obtener la invitación
    const invitationRecord = await db
      .select()
      .from(invitation)
      .where(eq(invitation.token, token))
      .then((res) => res[0]);

    if (!invitationRecord) {
      throw new Error("Invitación no encontrada");
    }

    // Verificar estado de la invitación y expiración
    if (invitationRecord.status !== "pending") {
      throw new Error("Esta invitación ya fue usada");
    }

    if (new Date() > new Date(invitationRecord.expiresAt)) {
      await db
        .update(invitation)
        .set({ status: "expired" })
        .where(eq(invitation.id, invitationRecord.id));

      throw new Error("Esta invitación ha expirado");
    }

    // Verificar si el usuario ya existe
    const invitationEmail = invitationRecord.email;
    let userId: string;
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, invitationEmail))
      .then((res) => res[0]);

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Crear nuevo usuario
      const now = new Date().toISOString();
      const emailParts = invitationEmail.split("@");
      const userName = emailParts[0] || "Usuario";
      const newUser = {
        email: invitationEmail,
        name: userName,
        image: "",
        emailVerified: true,
        createdAt: now,
        updatedAt: now,
      };

      const [insertedUser] = await db.insert(user).values(newUser).returning();
      if (!insertedUser) {
        throw new Error("Error al crear el usuario");
      }
      userId = insertedUser.id;
    }

    // Verificar si ya es miembro de la organización
    const existingMember = await db
      .select()
      .from(member)
      .where(
        and(
          eq(member.userId, userId),
          eq(member.organizationId, invitationRecord.organizationId)
        )
      )
      .then((res) => res[0]);

    if (existingMember) {
      // Si ya es miembro, solo actualizar la invitación como aceptada
      await db
        .update(invitation)
        .set({ status: "accepted" })
        .where(eq(invitation.id, invitationRecord.id));

      return {
        success: true,
        message: "Ya eres miembro de esta organización",
        member: {
          id: existingMember.id,
          role: existingMember.role,
        },
      };
    }

    // Crear miembro con el rol de la invitación
    const now = new Date().toISOString();
    const newMember = {
      organizationId: invitationRecord.organizationId,
      userId: userId,
      role: invitationRecord.role || "employee",
      createdAt: now,
      updatedAt: now,
    };

    const [insertedMember] = await db
      .insert(member)
      .values(newMember)
      .returning();

    if (!insertedMember) {
      throw new Error("Error al crear el miembro");
    }

    // Obtener información de la organización
    const org = await db
      .select()
      .from(organization)
      .where(eq(organization.id, invitationRecord.organizationId))
      .then((res) => res[0]);

    // Marcar la invitación como aceptada
    await db
      .update(invitation)
      .set({ status: "accepted" })
      .where(eq(invitation.id, invitationRecord.id));

    return {
      success: true,
      message: "Invitación aceptada exitosamente",
      member: {
        id: insertedMember.id,
        role: insertedMember.role,
        organizationId: insertedMember.organizationId,
      },
      organization: org
        ? {
            id: org.id,
            name: org.name,
          }
        : null,
    };
  }

  async verifyToken(token: string) {
    // Obtener la invitación
    const invitationRecord = await db
      .select()
      .from(invitation)
      .where(eq(invitation.token, token))
      .then((res) => res[0]);

    if (!invitationRecord) {
      return {
        valid: false,
        message: "Invitación no encontrada",
      };
    }

    // Verificar estado de la invitación
    if (invitationRecord.status !== "pending") {
      return {
        valid: false,
        message:
          invitationRecord.status === "accepted"
            ? "Esta invitación ya fue aceptada"
            : invitationRecord.status === "expired"
              ? "Esta invitación ha expirado"
              : "Esta invitación no está disponible",
        status: invitationRecord.status,
      };
    }

    // Verificar expiración
    const now = new Date();
    const expiresAt = new Date(invitationRecord.expiresAt);
    const isExpired = now > expiresAt;

    if (isExpired) {
      // Marcar como expirada si aún no lo está
      await db
        .update(invitation)
        .set({ status: "expired" })
        .where(eq(invitation.id, invitationRecord.id));

      return {
        valid: false,
        message: "Esta invitación ha expirado",
        status: "expired",
      };
    }

    // Obtener información de la organización
    const org = await db
      .select()
      .from(organization)
      .where(eq(organization.id, invitationRecord.organizationId))
      .then((res) => res[0]);

    // Obtener información del invitador
    const inviter = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
      })
      .from(user)
      .where(eq(user.id, invitationRecord.inviterId))
      .then((res) => res[0]);

    return {
      valid: true,
      message: "Invitación válida",
      invitation: {
        id: invitationRecord.id,
        email: invitationRecord.email,
        role: invitationRecord.role,
        expiresAt: invitationRecord.expiresAt,
        createdAt: invitationRecord.createdAt,
      },
      organization: org
        ? {
            id: org.id,
            name: org.name,
            logo: org.logo,
          }
        : null,
      inviter: inviter || null,
    };
  }

  async getSendedInvitations(organizationId: string) {
    const invitations = await db
      .select()
      .from(invitation)
      .where(eq(invitation.organizationId, organizationId))
      .then((res) => res);

    return invitations;
  }
}
