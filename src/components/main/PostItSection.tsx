"use client";

import Link from "next/link";

type PostIt = {
  title: string;
  subtitle: string;
  icon: string;
  href: string;
  color: string;
};

const postIts: PostIt[] = [
  { title: "Registro RCP", subtitle: "Inicia un registro de eventos de RCP", icon: "❤️", href: "/rcp", color: "bg-pink-200" },
  { title: "Vademécum", subtitle: "Información sobre preparación y administración de fármacos EV", icon: "📖", href: "/vademecum", color: "bg-yellow-200" },
  { title: "Pendientes", subtitle: "Gestiona tus tareas con Google Tasks", icon: "📝", href: "/pendientes", color: "bg-green-200" },
  { title: "Calculadoras", subtitle: "Cálculos clínicos útiles", icon: "🧮", href: "/calculadoras", color: "bg-blue-200" },
  { title: "Compatibilidad LM y Embarazo", subtitle: "Compatibilidad de medicamentos y otras sustancias", icon: "🤱", href: "/compatibilidad", color: "bg-purple-200" },
  { title: "Salud Infantil", subtitle: "Evaluación integral de salud de niñas, niños y adolescentes", icon: "👶", href: "/salud-infantil", color: "bg-red-200" },
  { title: "Trivia", subtitle: "¡Prueba tus conocimientos!", icon: "🎲", href: "/trivia", color: "bg-orange-200" },
  { title: "Mis Pacientes", subtitle: "Gestiona la información clínica de tus pacientes", icon: "👩‍⚕️", href: "/pacientes", color: "bg-teal-200" },
  { title: "Mis Notas", subtitle: "Anota información útil que debas recordar", icon: "🗒️", href: "/notas", color: "bg-indigo-200" },
  { title: "Mis Turnos", subtitle: "Lleva control de tus turnos trabajados", icon: "📅", href: "/turnos", color: "bg-cyan-200" },
  { title: "Lista de Compras", subtitle: "¿Vayamos al súper?", icon: "🛒", href: "/compras", color: "bg-lime-200" },
  { title: "Mis Finanzas", subtitle: "Las cuentas claras", icon: "💰", href: "/finanzas", color: "bg-rose-200" },
  { title: "Pastillero", subtitle: "Que no se te olvide la pastillita", icon: "💊", href: "/pastillero", color: "bg-fuchsia-200" },
  { title: "Mi ciclo menstrual", subtitle: "Que no te pille desprevenida", icon: "🌸", href: "/ciclo", color: "bg-amber-200" },
];

export default function PostItSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {postIts.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className={`${item.color} p-4 rounded-2xl shadow-lg hover:rotate-1 hover:scale-105 transition-transform cursor-pointer flex flex-col items-center justify-center`}
        >
          <div className="text-4xl mb-2">{item.icon}</div>
          <h3 className="font-bold text-lg">{item.title}</h3>
          <p className="text-sm text-center">{item.subtitle}</p>
        </Link>
      ))}
    </div>
  );
}
