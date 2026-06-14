import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST(req: Request) {
  const data = await req.json();

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = 750;

  const addLine = (text: string) => {
    page.drawText(text, {
      x: 50,
      y,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });
    y -= 25;
  };

  addLine(`CERTIFICADO PILOTO 21`);
  addLine(`----------------------`);

  addLine(`Fecha instalación: ${data.fechaInstalacion}`);
  addLine(`Certificado: ${data.certificado}`);
  addLine(`Empresa: Polarizado Piloto 21`);
  addLine(`Instalador: Pedro Gatica Rojas`);
  addLine(`RUT: 10.552.964-3`);
  addLine(`Dirección: Tocornal 750`);
  addLine(`Vidrios delanteros: ${data.delanteros}`);
  addLine(`Vidrios traseros: ${data.traseros}`);
  addLine(`Luneta: ${data.luneta}`);
  addLine(`Patente: ${data.patente}`);
  addLine(`Vehículo: ${data.vehiculo}`);

  const pdfBytes = await pdfDoc.save();
  const pdfBuffer = Buffer.from(pdfBytes);

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=certificado.pdf",
    },
  });
}