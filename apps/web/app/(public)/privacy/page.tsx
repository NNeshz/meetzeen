import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | Meetzeen",
  description: "Política de privacidad de Meetzeen - Cómo recopilamos, usamos y protegemos tu información",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-40">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-2 text-brand">Política de Privacidad</h1>
        <p className="text-muted-foreground mb-8">
          Última actualización: 30 de Diciembre de 2025
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introducción</h2>
          <p>
            En Meetzeen ("nosotros", "nuestro" o "la Plataforma"), nos comprometemos a proteger y respetar su privacidad. 
            Esta Política de Privacidad explica cómo recopilamos, utilizamos, divulgamos y protegemos su información personal 
            cuando utiliza nuestro servicio de gestión de citas y reservas.
          </p>
          <p>
            Al utilizar Meetzeen, usted acepta las prácticas descritas en esta política. Si no está de acuerdo con esta política, 
            le pedimos que no utilice nuestros servicios.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Información que Recopilamos</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">2.1. Información de Cuenta de Usuario</h3>
          <p>Cuando se registra en Meetzeen, recopilamos la siguiente información:</p>
          <ul>
            <li>Nombre completo</li>
            <li>Dirección de correo electrónico</li>
            <li>Imagen de perfil</li>
            <li>Número de teléfono (opcional)</li>
            <li>Información de autenticación a través de proveedores de terceros (como Google)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.2. Información de Organización</h3>
          <p>Si crea o se une a una organización, recopilamos:</p>
          <ul>
            <li>Nombre de la organización</li>
            <li>Zona horaria</li>
            <li>Moneda</li>
            <li>Logo de la organización</li>
            <li>Ubicación</li>
            <li>Horarios de trabajo</li>
            <li>Enlaces a redes sociales (Facebook, Instagram, WhatsApp, TikTok)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.3. Información de Clientes</h3>
          <p>Cuando gestiona clientes a través de nuestra plataforma, recopilamos:</p>
          <ul>
            <li>Nombre y apellido</li>
            <li>Dirección de correo electrónico</li>
            <li>Número de teléfono</li>
            <li>Notas sobre el cliente</li>
            <li>Historial de citas</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.4. Información de Citas</h3>
          <p>Para cada cita programada, recopilamos:</p>
          <ul>
            <li>Información del cliente (nombre, email, teléfono, notas)</li>
            <li>Información del miembro del equipo asignado</li>
            <li>Fecha y hora de la cita</li>
            <li>Servicios solicitados</li>
            <li>Estado de la cita (programada, confirmada, en progreso, completada, cancelada)</li>
            <li>Información de pago (estado, método, monto pagado)</li>
            <li>Razones de cancelación (si aplica)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.5. Información de Servicios</h3>
          <p>Recopilamos información sobre los servicios que ofrece, incluyendo:</p>
          <ul>
            <li>Nombre y descripción del servicio</li>
            <li>Precio y duración</li>
            <li>Descuentos aplicables</li>
            <li>Categorías de servicios</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.6. Información Técnica</h3>
          <p>Cuando utiliza nuestros servicios, recopilamos automáticamente:</p>
          <ul>
            <li>Dirección IP</li>
            <li>Información del navegador y dispositivo (user agent)</li>
            <li>Tokens de sesión</li>
            <li>Fechas y horas de acceso</li>
            <li>Actividad en la plataforma</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.7. Integración con Google Calendar</h3>
          <p>
            Si conecta su cuenta de Google Calendar, accedemos a su calendario para sincronizar citas. 
            Esto incluye permisos para leer y crear eventos en su calendario. Esta información se utiliza 
            únicamente para proporcionar la funcionalidad de sincronización de calendario.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Cómo Utilizamos su Información</h2>
          <p>Utilizamos la información recopilada para los siguientes propósitos:</p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">3.1. Prestación del Servicio</h3>
          <ul>
            <li>Gestionar su cuenta y autenticación</li>
            <li>Procesar y gestionar citas y reservas</li>
            <li>Enviar confirmaciones y recordatorios de citas</li>
            <li>Sincronizar con Google Calendar</li>
            <li>Proporcionar soporte al cliente</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.2. Comunicación</h3>
          <ul>
            <li>Enviar notificaciones sobre citas</li>
            <li>Enviar recordatorios y actualizaciones</li>
            <li>Responder a sus consultas y solicitudes</li>
            <li>Enviar información importante sobre cambios en nuestros servicios</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.3. Mejora del Servicio</h3>
          <ul>
            <li>Analizar el uso de la plataforma para mejorar nuestros servicios</li>
            <li>Desarrollar nuevas funcionalidades</li>
            <li>Personalizar su experiencia</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.4. Seguridad y Cumplimiento</h3>
          <ul>
            <li>Detectar y prevenir fraudes o actividades no autorizadas</li>
            <li>Cumplir con obligaciones legales</li>
            <li>Proteger nuestros derechos y los de nuestros usuarios</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Compartir su Información</h2>
          <p>No vendemos su información personal. Podemos compartir su información en las siguientes circunstancias:</p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">4.1. Dentro de su Organización</h3>
          <p>
            Los miembros de su organización pueden acceder a la información relevante para gestionar citas y clientes 
            dentro del contexto de su organización.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.2. Proveedores de Servicios</h3>
          <p>
            Podemos compartir información con proveedores de servicios que nos ayudan a operar nuestra plataforma, 
            como servicios de hosting, análisis y procesamiento de pagos. Estos proveedores están obligados a mantener 
            la confidencialidad de su información.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.3. Integraciones de Terceros</h3>
          <p>
            Cuando utiliza integraciones como Google Calendar, compartimos la información necesaria con estos servicios 
            según sus propias políticas de privacidad.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.4. Requisitos Legales</h3>
          <p>
            Podemos divulgar información si es requerido por ley, orden judicial, o proceso legal, o para proteger 
            nuestros derechos, propiedad o seguridad, o la de nuestros usuarios.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.5. Transferencias Comerciales</h3>
          <p>
            En caso de una fusión, adquisición o venta de activos, su información puede ser transferida como parte 
            de esa transacción.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Seguridad de los Datos</h2>
          <p>
            Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger su información personal 
            contra acceso no autorizado, alteración, divulgación o destrucción. Estas medidas incluyen:
          </p>
          <ul>
            <li>Cifrado de datos en tránsito y en reposo</li>
            <li>Autenticación segura mediante tokens</li>
            <li>Acceso restringido a información personal</li>
            <li>Monitoreo regular de nuestros sistemas de seguridad</li>
            <li>Copias de seguridad regulares</li>
          </ul>
          <p>
            Sin embargo, ningún método de transmisión por Internet o almacenamiento electrónico es 100% seguro. 
            Aunque nos esforzamos por proteger su información, no podemos garantizar su seguridad absoluta.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Retención de Datos</h2>
          <p>
            Conservamos su información personal durante el tiempo necesario para cumplir con los propósitos descritos 
            en esta política, a menos que la ley requiera o permita un período de retención más largo. Cuando ya no 
            necesitemos su información, la eliminaremos de forma segura o la anonimizaremos.
          </p>
          <p>
            Si elimina su cuenta, eliminaremos o anonimizaremos su información personal, excepto cuando estemos 
            legalmente obligados a conservarla (por ejemplo, para cumplir con obligaciones fiscales o legales).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Sus Derechos</h2>
          <p>Dependiendo de su ubicación, puede tener los siguientes derechos respecto a su información personal:</p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">7.1. Derecho de Acceso</h3>
          <p>Puede solicitar una copia de la información personal que tenemos sobre usted.</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">7.2. Derecho de Rectificación</h3>
          <p>Puede corregir cualquier información personal inexacta o incompleta.</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">7.3. Derecho de Eliminación</h3>
          <p>Puede solicitar que eliminemos su información personal en ciertas circunstancias.</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">7.4. Derecho de Oposición</h3>
          <p>Puede oponerse al procesamiento de su información personal para ciertos fines.</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">7.5. Derecho de Portabilidad</h3>
          <p>Puede solicitar que transfiramos su información personal a otro proveedor de servicios.</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">7.6. Derecho de Retirar el Consentimiento</h3>
          <p>
            Si el procesamiento se basa en su consentimiento, puede retirarlo en cualquier momento. 
            Esto no afectará la legalidad del procesamiento realizado antes de la retirada.
          </p>

          <p className="mt-4">
            Para ejercer estos derechos, puede contactarnos utilizando la información de contacto proporcionada 
            al final de esta política.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Cookies y Tecnologías Similares</h2>
          <p>
            Utilizamos cookies y tecnologías similares para mejorar su experiencia, analizar el uso de la plataforma 
            y personalizar el contenido. Puede controlar el uso de cookies a través de la configuración de su navegador.
          </p>
          <p>
            Las cookies esenciales son necesarias para el funcionamiento de la plataforma y no se pueden desactivar. 
            Otras cookies pueden ser desactivadas, pero esto puede afectar la funcionalidad del servicio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Privacidad de Menores</h2>
          <p>
            Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos intencionalmente información 
            personal de menores. Si descubrimos que hemos recopilado información de un menor sin el consentimiento 
            de los padres, tomaremos medidas para eliminar esa información.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Transferencias Internacionales</h2>
          <p>
            Su información puede ser transferida y procesada en países distintos al suyo. Al utilizar nuestros servicios, 
            usted consiente la transferencia de su información a estos países. Nos aseguramos de que se implementen 
            salvaguardias apropiadas para proteger su información en estas transferencias.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Cambios a esta Política</h2>
          <p>
            Podemos actualizar esta Política de Privacidad ocasionalmente. Le notificaremos sobre cambios significativos 
            publicando la nueva política en esta página y actualizando la fecha de "Última actualización". 
            Le recomendamos que revise esta política periódicamente.
          </p>
          <p>
            Su uso continuado de nuestros servicios después de que se publiquen los cambios constituye su aceptación 
            de la política revisada.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">12. Contacto</h2>
          <p>
            Si tiene preguntas, inquietudes o solicitudes relacionadas con esta Política de Privacidad o el procesamiento 
            de su información personal, puede contactarnos:
          </p>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="mb-2"><strong>Meetzeen</strong></p>
            <p className="mb-2">Email: privacy@meetzeen.com</p>
            <p>
              Por favor, incluya "Política de Privacidad" en el asunto de su correo electrónico para una respuesta más rápida.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">13. Autoridad Supervisora</h2>
          <p>
            Si reside en la Unión Europea y no está satisfecho con cómo manejamos su información personal, tiene derecho 
            a presentar una queja ante su autoridad de protección de datos local.
          </p>
        </section>

        <div className="mt-12 pt-8">
          <p className="text-sm text-muted-foreground">
            Esta política de privacidad es efectiva a partir de la fecha indicada arriba y se aplica a todos los usuarios 
            de Meetzeen, independientemente de cuándo se registraron.
          </p>
        </div>
      </div>
    </div>
  );
}