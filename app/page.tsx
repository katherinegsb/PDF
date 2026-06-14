"use client";
import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    fechaInstalacion: "",
    certificado: "",
    delanteros: "",
    traseros: "",
    luneta: "",
    patente: "",
    vehiculo: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDownload = async () => {
    const res = await fetch("/api/generar-certificado", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("Error al generar el PDF");
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const nombrePDF = `certificado-${form.certificado || "sin-numero"}-${form.patente || "sin-patente"}.pdf`;

    const a = document.createElement("a");
    a.href = url;
    a.download = nombrePDF;
    a.click();

    URL.revokeObjectURL(url);
  };

  const fontStyle =
    "'Source Sans 3', 'Helvetica Neue', Arial, sans-serif";
  const FS = "1.65cqw";

  const lineas = [
    { label: "Fecha de instalación:", top: 26.58, value: form.fechaInstalacion },
    { label: "N° Certificado:", top: 30.89, value: form.certificado },
    { label: "Empresa:", top: 35.20, value: "Polarizado Piloto 21" },
    { label: "Instalador:", top: 39.51, value: "Pedro Gatica Rojas" },
    { label: "RUT:", top: 43.82, value: "10.552.964-3" },
    { label: "Dirección:", top: 48.13, value: "Tocornal 750, Santiago." },
    { label: "Vidrios lat. delanteros:", top: 52.44, value: form.delanteros },
    { label: "Vidrios lat. traseros:", top: 56.75, value: form.traseros },
    { label: "Luneta trasera:", top: 61.06, value: form.luneta },
    { label: "Patente:", top: 65.37, value: form.patente },
    { label: "Vehículo:", top: 68.97, value: form.vehiculo },
  ];

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap');
      `}</style>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Generador de Certificados — Piloto 21
        </h1>

        <div className="grid md:grid-cols-[320px_1fr] gap-6 items-start">

          {/* FORM */}
          <div className="bg-white p-5 rounded-xl shadow w-full">
            <h2 className="text-base font-semibold mb-4 text-gray-700 border-b pb-2">
              Datos del Certificado
            </h2>

            <div className="space-y-2">
              {[
                { name: "fechaInstalacion", label: "Fecha de instalación" },
                { name: "certificado", label: "N° Certificado" },
                { name: "delanteros", label: "Vidrios lat. delanteros" },
                { name: "traseros", label: "Vidrios lat. traseros" },
                { name: "luneta", label: "Luneta trasera" },
                { name: "patente", label: "Patente" },
                { name: "vehiculo", label: "Vehículo" },
              ].map(({ name, label }) => (
                <div key={name}>
                  <label className="block text-xs font-medium text-gray-500 mb-0.5">
                    {label}
                  </label>
                  <input
                    className="w-full border border-gray-200 p-1.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    name={name}
                    value={form[name as keyof typeof form]}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleDownload}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
            >
              Descargar PDF
            </button>
          </div>

          {/* PREVIEW */}
          <div className="flex flex-col">
            <h2 className="text-base font-semibold mb-3 text-gray-700">
              Vista Previa
            </h2>

            <div
              className="relative w-full rounded-lg overflow-hidden shadow border bg-white"
              style={{
                aspectRatio: "1008 / 696",
                containerType: "inline-size",
              }}
            >
              <img
                src="/certificado-base.png"
                alt="certificado"
                className="absolute inset-0 w-full h-full object-fill"
              />

              {lineas.map(({ label, top, value }) => (
                <div
                  key={label}
                  className="absolute leading-none"
                  style={{
                    top: `${top}%`,
                    left: "15%",
                    fontSize: FS,
                    fontFamily: fontStyle,
                    whiteSpace: "nowrap",
                  }}
                >
                  {/* > */}
                  <span
                    style={{
                      color: "#1a56db",
                      fontWeight: 900,
                      marginRight: 6,
                    }}
                  >
                    &gt;
                  </span>

                  {/* LABEL */}
                  <span style={{ fontWeight: 700, color: "#1a1a2e" }}>
                    {label}
                  </span>

                  {/* VALOR */}
                  <span
                    style={{
                      marginLeft: 6,
                      fontWeight: 600,
                      color: "#1a56db",
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 mt-1.5">
              * Vista previa en tiempo real. El PDF tendrá las posiciones exactas.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}