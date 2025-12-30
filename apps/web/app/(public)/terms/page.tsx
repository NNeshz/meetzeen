import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos de Servicio | Meetzeen",
  description: "Términos y condiciones de uso de Meetzeen - Reglas y condiciones para usar nuestra plataforma",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-40">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-2 text-brand">Términos de Servicio</h1>
        <p className="text-muted-foreground mb-8">
          Última actualización: 30 de Diciembre de 2025
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Aceptación de los Términos</h2>
          <p>
            Bienvenido a Meetzeen. Estos Términos de Servicio ("Términos") constituyen un acuerdo legal entre usted 
            ("Usuario", "usted" o "su") y Meetzeen ("nosotros", "nuestro" o "la Plataforma") que rige su acceso y uso 
            de nuestro servicio de gestión de citas y reservas disponible a través de nuestro sitio web y aplicaciones 
            (colectivamente, el "Servicio").
          </p>
          <p>
            Al acceder o utilizar nuestro Servicio, usted acepta estar sujeto a estos Términos. Si no está de acuerdo 
            con alguna parte de estos Términos, no debe utilizar nuestro Servicio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Descripción del Servicio</h2>
          <p>
            Meetzeen es una plataforma de gestión de citas y reservas que permite a las organizaciones y sus miembros 
            gestionar citas, clientes, servicios, equipos y otras funcionalidades relacionadas con la gestión de 
            reservas. El Servicio incluye, entre otros:
          </p>
          <ul>
            <li>Gestión de organizaciones y equipos</li>
            <li>Programación y gestión de citas</li>
            <li>Gestión de clientes y su información</li>
            <li>Gestión de servicios y categorías</li>
            <li>Sincronización con Google Calendar</li>
            <li>Análisis y métricas de negocio</li>
            <li>Gestión de pagos y transacciones</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Elegibilidad y Registro</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">3.1. Requisitos de Elegibilidad</h3>
          <p>Para utilizar nuestro Servicio, usted debe:</p>
          <ul>
            <li>Tener al menos 18 años de edad</li>
            <li>Tener la capacidad legal para celebrar contratos vinculantes</li>
            <li>Proporcionar información precisa, actual y completa durante el registro</li>
            <li>Mantener y actualizar su información de cuenta según sea necesario</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.2. Cuenta de Usuario</h3>
          <p>
            Para acceder a ciertas funcionalidades del Servicio, debe crear una cuenta. Usted es responsable de:
          </p>
          <ul>
            <li>Mantener la confidencialidad de sus credenciales de acceso</li>
            <li>Todas las actividades que ocurran bajo su cuenta</li>
            <li>Notificarnos inmediatamente de cualquier uso no autorizado de su cuenta</li>
            <li>Asegurarse de que toda la información proporcionada sea precisa y actualizada</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.3. Autenticación de Terceros</h3>
          <p>
            Puede registrarse utilizando proveedores de autenticación de terceros (como Google). Al hacerlo, acepta 
            que compartimos información necesaria con estos proveedores según sus políticas de privacidad.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Organizaciones y Equipos</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">4.1. Creación de Organizaciones</h3>
          <p>
            Puede crear una organización en Meetzeen para gestionar su negocio. Al crear una organización, usted se 
            convierte en el administrador de esa organización y es responsable de:
          </p>
          <ul>
            <li>Gestionar los miembros y sus permisos</li>
            <li>Configurar la información de la organización</li>
            <li>Mantener la información de la organización actualizada</li>
            <li>Cumplir con todas las leyes y regulaciones aplicables</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.2. Miembros del Equipo</h3>
          <p>
            Puede invitar a otros usuarios a unirse a su organización como miembros del equipo. Usted es responsable de:
          </p>
          <ul>
            <li>Gestionar los roles y permisos de los miembros</li>
            <li>Asegurar que los miembros cumplan con estos Términos</li>
            <li>Remover miembros cuando sea apropiado</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.3. Responsabilidad de la Organización</h3>
          <p>
            La organización y su administrador son responsables de todas las actividades realizadas por los miembros 
            de la organización dentro de la plataforma.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Uso del Servicio</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">5.1. Uso Permitido</h3>
          <p>Usted puede utilizar nuestro Servicio únicamente para fines legales y de acuerdo con estos Términos.</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.2. Uso Prohibido</h3>
          <p>Está prohibido utilizar nuestro Servicio para:</p>
          <ul>
            <li>Actividades ilegales o no autorizadas</li>
            <li>Violar cualquier ley, estatuto, ordenanza o regulación</li>
            <li>Infringir los derechos de propiedad intelectual de otros</li>
            <li>Transmitir virus, malware o código malicioso</li>
            <li>Intentar obtener acceso no autorizado al Servicio o sistemas relacionados</li>
            <li>Interferir con o interrumpir el funcionamiento del Servicio</li>
            <li>Recopilar información de otros usuarios sin su consentimiento</li>
            <li>Utilizar el Servicio para spam, phishing o actividades fraudulentas</li>
            <li>Suplantar la identidad de otra persona o entidad</li>
            <li>Manipular o falsificar información en el Servicio</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.3. Gestión de Citas</h3>
          <p>
            Usted es responsable de gestionar las citas de manera adecuada, incluyendo:
          </p>
          <ul>
            <li>Proporcionar información precisa sobre las citas</li>
            <li>Gestionar las cancelaciones de manera apropiada</li>
            <li>Respetar los horarios y compromisos establecidos</li>
            <li>Tratar a los clientes de manera profesional y ética</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.4. Información de Clientes</h3>
          <p>
            Al gestionar información de clientes, usted se compromete a:
          </p>
          <ul>
            <li>Obtener el consentimiento necesario para recopilar y procesar información personal</li>
            <li>Proteger la privacidad y confidencialidad de la información del cliente</li>
            <li>Cumplir con las leyes de protección de datos aplicables</li>
            <li>Utilizar la información únicamente para los fines previstos del Servicio</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Integraciones de Terceros</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">6.1. Google Calendar</h3>
          <p>
            Si conecta su cuenta de Google Calendar, acepta que:
          </p>
          <ul>
            <li>Compartimos información necesaria con Google según sus políticas de privacidad</li>
            <li>Google puede acceder a su calendario para sincronizar citas</li>
            <li>Usted es responsable de gestionar los permisos de Google Calendar</li>
            <li>Puede desconectar la integración en cualquier momento</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">6.2. Otras Integraciones</h3>
          <p>
            Cualquier integración con servicios de terceros está sujeta a los términos y políticas de privacidad 
            de esos servicios. No somos responsables de las prácticas de privacidad o seguridad de servicios de terceros.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Pagos y Facturación</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">7.1. Gestión de Pagos</h3>
          <p>
            Si utiliza funcionalidades de pago en el Servicio, usted es responsable de:
          </p>
          <ul>
            <li>Gestionar los pagos de manera precisa y ética</li>
            <li>Procesar reembolsos cuando sea apropiado</li>
            <li>Cumplir con las leyes y regulaciones de pago aplicables</li>
            <li>Mantener registros precisos de todas las transacciones</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">7.2. Procesadores de Pago</h3>
          <p>
            Si utilizamos procesadores de pago de terceros, las transacciones están sujetas a los términos de esos 
            procesadores. No somos responsables de los errores o problemas con los procesadores de pago de terceros.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Propiedad Intelectual</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">8.1. Propiedad de Meetzeen</h3>
          <p>
            El Servicio y todo su contenido, incluyendo pero no limitado a texto, gráficos, logos, iconos, imágenes, 
            compilaciones de datos, software y código, son propiedad de Meetzeen o sus proveedores de contenido y están 
            protegidos por leyes de derechos de autor, marcas registradas y otras leyes de propiedad intelectual.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">8.2. Licencia de Uso</h3>
          <p>
            Le otorgamos una licencia limitada, no exclusiva, no transferible y revocable para acceder y utilizar el 
            Servicio únicamente para sus fines comerciales legítimos, de acuerdo con estos Términos.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">8.3. Su Contenido</h3>
          <p>
            Usted conserva todos los derechos sobre el contenido que proporciona o crea en el Servicio. Al utilizar el 
            Servicio, nos otorga una licencia mundial, no exclusiva, libre de regalías para usar, reproducir, modificar 
            y distribuir su contenido únicamente para proporcionar y mejorar el Servicio.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">8.4. Marcas Comerciales</h3>
          <p>
            "Meetzeen" y otros nombres, logos y marcas comerciales que aparecen en el Servicio son propiedad de Meetzeen 
            o sus respectivos propietarios. No puede utilizar estas marcas sin nuestro permiso previo por escrito.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Limitación de Responsabilidad</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">9.1. Servicio "Tal Como Está"</h3>
          <p>
            El Servicio se proporciona "tal como está" y "según disponibilidad". No garantizamos que el Servicio será 
            ininterrumpido, libre de errores, seguro o libre de virus u otros componentes dañinos.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">9.2. Exclusión de Garantías</h3>
          <p>
            En la máxima medida permitida por la ley, renunciamos a todas las garantías, expresas o implícitas, incluyendo 
            pero no limitado a garantías de comerciabilidad, idoneidad para un propósito particular y no infracción.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">9.3. Limitación de Daños</h3>
          <p>
            En ningún caso seremos responsables de daños indirectos, incidentales, especiales, consecuentes o punitivos, 
            incluyendo pero no limitado a pérdida de beneficios, datos, uso, buena voluntad u otras pérdidas intangibles, 
            resultantes de su uso o incapacidad para usar el Servicio.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">9.4. Responsabilidad del Usuario</h3>
          <p>
            Usted es responsable de todas las decisiones y acciones tomadas al utilizar el Servicio. No somos responsables 
            de las pérdidas o daños resultantes de su uso del Servicio, incluyendo pero no limitado a pérdidas relacionadas 
            con citas canceladas, clientes insatisfechos o problemas de negocio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Indemnización</h2>
          <p>
            Usted acepta indemnizar, defender y mantener indemne a Meetzeen, sus afiliados, directores, funcionarios, 
            empleados y agentes de y contra cualquier reclamo, demanda, pérdida, responsabilidad y gasto (incluyendo honorarios 
            de abogados) que surjan de o estén relacionados con:
          </p>
          <ul>
            <li>Su uso del Servicio</li>
            <li>Su violación de estos Términos</li>
            <li>Su violación de cualquier derecho de terceros</li>
            <li>Cualquier contenido que proporcione o publique en el Servicio</li>
            <li>Su violación de cualquier ley o regulación aplicable</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Terminación</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">11.1. Terminación por el Usuario</h3>
          <p>
            Puede terminar su cuenta en cualquier momento eliminando su cuenta a través de la configuración del Servicio 
            o contactándonos directamente.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">11.2. Terminación por Meetzeen</h3>
          <p>
            Nos reservamos el derecho de suspender o terminar su acceso al Servicio inmediatamente, sin previo aviso, 
            por cualquier motivo, incluyendo pero no limitado a:
          </p>
          <ul>
            <li>Violación de estos Términos</li>
            <li>Uso fraudulento o abusivo del Servicio</li>
            <li>Actividades ilegales</li>
            <li>No pago de tarifas cuando corresponda</li>
            <li>Inactividad prolongada de la cuenta</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">11.3. Efectos de la Terminación</h3>
          <p>
            Al terminar su cuenta:
          </p>
          <ul>
            <li>Su derecho a utilizar el Servicio cesará inmediatamente</li>
            <li>Podemos eliminar o anonimizar su información según nuestra Política de Privacidad</li>
            <li>Las disposiciones de estos Términos que por su naturaleza deben sobrevivir continuarán en vigor</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">12. Modificaciones del Servicio</h2>
          <p>
            Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto del Servicio en cualquier 
            momento, con o sin previo aviso. No seremos responsables ante usted ni ante ningún tercero por cualquier 
            modificación, suspensión o discontinuación del Servicio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">13. Modificaciones de los Términos</h2>
          <p>
            Podemos modificar estos Términos en cualquier momento. Le notificaremos sobre cambios significativos publicando 
            los nuevos Términos en esta página y actualizando la fecha de "Última actualización". Su uso continuado del 
            Servicio después de que se publiquen los cambios constituye su aceptación de los Términos revisados.
          </p>
          <p>
            Si no está de acuerdo con los Términos modificados, debe dejar de utilizar el Servicio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">14. Ley Aplicable y Jurisdicción</h2>
          <p>
            Estos Términos se regirán e interpretarán de acuerdo con las leyes del país donde Meetzeen opera, sin tener 
            en cuenta sus disposiciones sobre conflictos de leyes.
          </p>
          <p>
            Cualquier disputa que surja de o esté relacionada con estos Términos o el Servicio será resuelta en los 
            tribunales competentes de la jurisdicción correspondiente.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">15. Disposiciones Generales</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">15.1. Acuerdo Completo</h3>
          <p>
            Estos Términos, junto con nuestra Política de Privacidad, constituyen el acuerdo completo entre usted y 
            Meetzeen respecto al uso del Servicio.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">15.2. Divisibilidad</h3>
          <p>
            Si alguna disposición de estos Términos se considera inválida o inaplicable, las disposiciones restantes 
            permanecerán en pleno vigor y efecto.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">15.3. Renuncia</h3>
          <p>
            Nuestra falta de ejercer o hacer valer cualquier derecho o disposición de estos Términos no constituirá una 
            renuncia a tal derecho o disposición.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">15.4. Cesión</h3>
          <p>
            No puede ceder o transferir estos Términos o sus derechos u obligaciones aquí bajo sin nuestro consentimiento 
            previo por escrito. Podemos ceder estos Términos sin restricciones.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">15.5. Fuerza Mayor</h3>
          <p>
            No seremos responsables por cualquier falla o retraso en el cumplimiento debido a causas más allá de nuestro 
            control razonable, incluyendo pero no limitado a desastres naturales, guerra, terrorismo, huelgas, fallas 
            de infraestructura o interrupciones de Internet.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mt-8 mb-4">16. Contacto</h2>
          <p>
            Si tiene preguntas sobre estos Términos de Servicio, puede contactarnos:
          </p>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="mb-2"><strong>Meetzeen</strong></p>
            <p className="mb-2">Email: legal@meetzeen.com</p>
            <p>
              Por favor, incluya "Términos de Servicio" en el asunto de su correo electrónico para una respuesta más rápida.
            </p>
          </div>
        </section>

        <div className="mt-12 pt-8">
          <p className="text-sm text-muted-foreground">
            Estos términos de servicio son efectivos a partir de la fecha indicada arriba y se aplican a todos los usuarios 
            de Meetzeen, independientemente de cuándo se registraron.
          </p>
        </div>
      </div>
    </div>
  );
}