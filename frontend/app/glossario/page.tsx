import Link from "next/link";

const terms = [
  { id: "drivers", term: "Drivers", def: "Programas que permitem que o sistema operacional se comunique com dispositivos de hardware (placa de vídeo, som, rede, etc.). Sem o driver correto, o hardware pode não funcionar ou funcionar de forma limitada." },
];

export default function GlossarioPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-800">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-purple-600 hover:underline text-sm">&larr; Voltar ao roadmap</Link>
        <h1 className="text-2xl font-bold mt-4 mb-6">Glossário</h1>
        <div className="flex flex-col gap-4">
          {terms.map((t) => (
            <div key={t.id} id={t.id} className="rounded-lg border bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold">{t.term}</h2>
              <p className="mt-1 text-gray-600 leading-relaxed">{t.def}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
