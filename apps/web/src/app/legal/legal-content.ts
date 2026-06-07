export type LegalSection = {
  title: string;
  body: string;
};

export type LegalPage = {
  slug: string;
  title: string;
  description: string;
  updatedAt: string;
  sections: LegalSection[];
};

export const legalPages: LegalPage[] = [
  {
    slug: "terminos-de-servicio",
    title: "Términos de Servicio",
    description:
      "Condiciones generales para usar MC Market, comprar recursos y publicar contenido en la plataforma.",
    updatedAt: "7 de junio de 2026",
    sections: [
      {
        title: "Aceptación de los términos",
        body:
          "Al acceder o utilizar MC Market aceptas estos términos y las políticas aplicables de la plataforma. Si no estás de acuerdo, debes dejar de usar el sitio y sus servicios.",
      },
      {
        title: "Uso de la plataforma",
        body:
          "MC Market permite descubrir, comprar y descargar recursos digitales para servidores de Minecraft. Debes usar la plataforma de forma legal, respetuosa y sin intentar afectar su seguridad, disponibilidad o funcionamiento.",
      },
      {
        title: "Cuentas y seguridad",
        body:
          "Eres responsable de mantener segura tu cuenta, tus credenciales y cualquier actividad realizada desde ella. Podemos restringir o suspender cuentas que incumplan estos términos o representen riesgo para otros usuarios.",
      },
      {
        title: "Compras y licencias",
        body:
          "Los recursos adquiridos se entregan como productos digitales. Cada recurso puede incluir condiciones de licencia propias definidas por su creador, incluyendo límites de uso, redistribución, modificación o soporte.",
      },
      {
        title: "Contenido de usuarios",
        body:
          "Los creadores conservan los derechos sobre su contenido, pero otorgan a MC Market una licencia para alojarlo, mostrarlo, distribuirlo y promocionarlo dentro de la plataforma.",
      },
      {
        title: "Cambios del servicio",
        body:
          "Podemos actualizar funciones, precios, políticas y disponibilidad del servicio cuando sea necesario. Los cambios importantes se publicarán en la plataforma o se comunicarán por los canales disponibles.",
      },
    ],
  },
  {
    slug: "politica-de-privacidad",
    title: "Política de Privacidad",
    description:
      "Cómo recopilamos, usamos y protegemos la información relacionada con tu cuenta y actividad en MC Market.",
    updatedAt: "7 de junio de 2026",
    sections: [
      {
        title: "Información que recopilamos",
        body:
          "Podemos recopilar datos de cuenta, información de contacto, historial de compras, descargas, actividad dentro de la plataforma y datos técnicos necesarios para operar el servicio.",
      },
      {
        title: "Uso de la información",
        body:
          "Usamos la información para autenticar usuarios, procesar compras, entregar recursos, brindar soporte, mejorar la plataforma, prevenir abusos y cumplir obligaciones legales.",
      },
      {
        title: "Pagos",
        body:
          "Los pagos pueden ser procesados por proveedores externos. MC Market no almacena datos completos de tarjetas bancarias; el tratamiento de esos datos depende del proveedor de pago correspondiente.",
      },
      {
        title: "Cookies y analítica",
        body:
          "Podemos usar cookies o tecnologías similares para mantener sesiones activas, recordar preferencias, analizar rendimiento y entender cómo se utiliza la plataforma.",
      },
      {
        title: "Compartición de datos",
        body:
          "No vendemos información personal. Podemos compartir datos con proveedores técnicos, procesadores de pago, servicios de soporte o autoridades cuando sea necesario para operar el servicio o cumplir la ley.",
      },
      {
        title: "Tus derechos",
        body:
          "Puedes solicitar acceso, corrección o eliminación de tus datos cuando corresponda. Algunas solicitudes pueden estar limitadas por obligaciones legales, antifraude o registros necesarios de transacciones.",
      },
    ],
  },
  {
    slug: "politica-de-reembolso",
    title: "Política de Reembolso",
    description:
      "Criterios para solicitar reembolsos en compras digitales realizadas dentro de MC Market.",
    updatedAt: "7 de junio de 2026",
    sections: [
      {
        title: "Productos digitales",
        body:
          "Los recursos vendidos en MC Market son productos digitales. Una vez entregado o descargado un recurso, los reembolsos pueden estar limitados por la naturaleza inmediata del acceso digital.",
      },
      {
        title: "Casos elegibles",
        body:
          "Podemos considerar reembolsos cuando el recurso no se entregue, tenga fallas críticas verificables, no corresponda claramente con su descripción o exista un cargo duplicado accidental.",
      },
      {
        title: "Casos no elegibles",
        body:
          "Normalmente no se aprueban reembolsos por cambio de opinión, incompatibilidad no revisada previamente, falta de conocimientos técnicos, incumplimiento de requisitos publicados o uso indebido del recurso.",
      },
      {
        title: "Solicitud de revisión",
        body:
          "Para solicitar un reembolso, contacta al soporte con el comprobante de compra, el recurso adquirido, una explicación clara del problema y evidencia suficiente para revisar el caso.",
      },
      {
        title: "Resolución",
        body:
          "Cada caso se evalúa individualmente. Podemos pedir información adicional, proponer una corrección, contactar al creador o aprobar el reembolso cuando corresponda.",
      },
    ],
  },
  {
    slug: "dmca",
    title: "DMCA",
    description:
      "Proceso para reportar contenido que presuntamente infringe derechos de autor en MC Market.",
    updatedAt: "7 de junio de 2026",
    sections: [
      {
        title: "Reportes de infracción",
        body:
          "Si crees que un recurso publicado en MC Market infringe tus derechos de autor, puedes enviar un aviso con información suficiente para identificar el contenido y verificar tu reclamación.",
      },
      {
        title: "Información requerida",
        body:
          "Incluye la URL del contenido, una descripción de la obra protegida, tus datos de contacto, una declaración de buena fe, una declaración de veracidad y tu firma física o electrónica.",
      },
      {
        title: "Retiro de contenido",
        body:
          "Cuando recibamos un aviso válido, podremos retirar o restringir el acceso al contenido reportado mientras revisamos la reclamación y notificamos al usuario responsable.",
      },
      {
        title: "Contranotificación",
        body:
          "El usuario afectado puede enviar una contranotificación si considera que el retiro fue un error o que tiene autorización para publicar el contenido.",
      },
      {
        title: "Abuso del proceso",
        body:
          "Los reportes falsos, incompletos o enviados de mala fe pueden derivar en rechazo de la solicitud, restricciones de cuenta u otras medidas permitidas por la ley.",
      },
    ],
  },
];

export function getLegalPage(slug: string) {
  return legalPages.find((page) => page.slug === slug);
}
