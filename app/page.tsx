"use client";

import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// ─── Datos estáticos y posiciones ───────────────────────────
const fontStyle = "'Source Sans 3', 'Helvetica Neue', Arial, sans-serif";

// y en px sobre canvas 1008x696 (separación ~30px desde y=185)
const TOPS_PX = [185, 215, 245, 275, 305, 335, 365, 395, 425, 455, 480];

const BLUE = "rgb(0, 51, 204)";
const LEFT_PX = 140;       // más a la derecha en el PDF
const LEFT_PCT = "13.9%";  // equivalente porcentual para la preview
const FONT_SIZE_PDF = 15;
const FONT_SIZE_PREVIEW = "2cqw";

const LABELS = [
  "Fecha de instalación:",
  "N° Certificado:",
  "Empresa:",
  "Instalador:",
  "RUT:",
  "Dirección:",
  "Vidrios lat. delanteros:",
  "Vidrios lat. traseros:",
  "Luneta trasera:",
  "Patente:",
  "Vehículo:",
];

const STATIC_VALUES: Record<number, string> = {
  2: "Polarizado Piloto 21",
  3: "Pedro Gatica Rojas",
  4: "10.552.964-3",
  5: "Tocornal 750, Santiago.",
};

// ─── Certificado para PDF (tamaño fijo en px) ───────────────
function CertificadoPDF({
  refEl,
  values,
}: {
  refEl: React.RefObject<HTMLDivElement | null>;
  values: string[];
}) {
  const W = 1008;
  const H = 696;

  return (
    <div
      ref={refEl}
      style={{
        position: "relative",
        width: W,
        height: H,
        overflow: "hidden",
        backgroundColor: "#ffffff",
        flexShrink: 0,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/certificado-base.png"
        alt=""
        crossOrigin="anonymous"
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: W, height: H,
          objectFit: "fill",
          display: "block",
        }}
      />

      {LABELS.map((label, i) => (
        <div
          key={i}
          style={{
            position:   "absolute",
            top:        TOPS_PX[i],
            left:       LEFT_PX,
            fontSize:   FONT_SIZE_PDF,
            fontFamily: fontStyle,
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          <span style={{ fontWeight: 800, color: BLUE, marginRight: 5 }}>{">"}</span>
          <span style={{ fontWeight: 700, color: "#1a1a2e" }}>{label} </span>
          <span style={{ fontWeight: 600, color: BLUE }}>{values[i]}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Vista previa (escala proporcional con CSS) ──────────────
function CertificadoPreview({ values }: { values: string[] }) {
  return (
    <div
      className="rounded-lg overflow-hidden shadow border"
      style={{
        width: "100%",
        aspectRatio: "1008 / 696",
        position: "relative",
        containerType: "inline-size",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/certificado-base.png"
        alt="certificado"
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "fill",
        }}
        draggable={false}
      />

      {LABELS.map((label, i) => (
        <div
          key={i}
          style={{
            position:   "absolute",
            top:        `${(TOPS_PX[i] / 696) * 100}%`,
            left:       LEFT_PCT,
            fontSize:   FONT_SIZE_PREVIEW,
            fontFamily: fontStyle,
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          <span style={{ fontWeight: 800, color: BLUE, marginRight: "0.3em" }}>{">"}</span>
          <span style={{ fontWeight: 700, color: "#1a1a2e" }}>{label} </span>
          <span style={{ fontWeight: 600, color: BLUE }}>{values[i]}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Página principal ────────────────────────────────────────
export default function Home() {
  const hiddenRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

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

  // Armar el array de valores en el mismo orden que LABELS
  const values = [
    form.fechaInstalacion,
    form.certificado,
    STATIC_VALUES[2],
    STATIC_VALUES[3],
    STATIC_VALUES[4],
    STATIC_VALUES[5],
    form.delanteros,
    form.traseros,
    form.luneta,
    form.patente,
    form.vehiculo,
  ];

  const handleDownload = async () => {
    if (!hiddenRef.current) return;
    setGenerating(true);
    try {
      await new Promise((r) => setTimeout(r, 120));

      const canvas = await html2canvas(hiddenRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
        imageTimeout: 15000,
        width: 1008,
        height: 696,
      });

      const imgData = canvas.toDataURL("image/png", 1.0);

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [1008, 696],
        hotfixes: ["px_scaling"],
      });

      pdf.addImage(imgData, "PNG", 0, 0, 1008, 696);
      pdf.save(
        `certificado-${form.certificado || "sin-numero"}-${form.patente || "sin-patente"}.pdf`
      );
    } catch (err) {
      console.error(err);
      alert("Error al generar el PDF. Intenta de nuevo.");
    } finally {
      setGenerating(false);
    }
  };

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

          {/* FORMULARIO */}
          <div className="bg-white p-5 rounded-xl shadow w-full">
            <h2 className="text-base font-semibold mb-4 text-gray-700 border-b pb-2">
              Datos del Certificado
            </h2>

            <div className="space-y-2">
              {[
                { name: "fechaInstalacion", label: "Fecha de instalación"    },
                { name: "certificado",      label: "N° Certificado"          },
                { name: "delanteros",       label: "Vidrios lat. delanteros" },
                { name: "traseros",         label: "Vidrios lat. traseros"   },
                { name: "luneta",           label: "Luneta trasera"          },
                { name: "patente",          label: "Patente"                 },
                { name: "vehiculo",         label: "Vehículo"                },
              ].map(({ name, label }) => (
                <div key={name}>
                  <label className="block text-xs font-medium text-gray-500 mb-0.5">
                    {label}
                  </label>
                  <input
                    className="w-full border border-gray-300 p-1.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 bg-white"
                    name={name}
                    value={form[name as keyof typeof form]}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleDownload}
              disabled={generating}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
            >
              {generating ? "Generando PDF..." : "Descargar PDF"}
            </button>
          </div>

          {/* VISTA PREVIA */}
          <div className="flex flex-col">
            <h2 className="text-base font-semibold mb-3 text-gray-700">Vista Previa</h2>
            <CertificadoPreview values={values} />
            <p className="text-xs text-gray-400 mt-1.5">
              * Vista previa en tiempo real. El PDF descargado será igual a esta vista.
            </p>
          </div>

        </div>
      </div>

      {/* DIV OCULTO — tamaño exacto 1008x696px, capturado por html2canvas */}
      <div
        style={{
          position: "fixed",
          top: -9999,
          left: -9999,
          zIndex: -1,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <CertificadoPDF refEl={hiddenRef} values={values} />
      </div>
    </main>
  );
}
