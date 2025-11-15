import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/table";
import { cn } from "@/lib/cn";
import { formatDate, formatTime } from "@/lib/date";
import type { AdminAppointmentListItem } from "../types";

function renderStatusLabel(status: AdminAppointmentListItem["statut"]) {
  switch (status) {
    case "CONFIRME":
      return <Badge variant="success">Confirmé</Badge>;
    case "PLANIFIE":
      return <Badge variant="neutral">Planifié</Badge>;
    case "ANNULE":
      return <Badge variant="danger">Annulé</Badge>;
    case "HONORE":
      return <Badge variant="success">Honoré</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

export function AdminAppointmentsTable({ appointments }: { appointments: AdminAppointmentListItem[] }) {
  return (
    <Card className="overflow-hidden border border-sky-100">
      <CardContent className="p-0">
        <Table>
          <Thead>
            <Tr>
              <Th>Rendez-vous</Th>
              <Th>Médecin</Th>
              <Th>Patient</Th>
              <Th>Statut</Th>
            </Tr>
          </Thead>
          <Tbody>
            {appointments.map((appointment, index) => {
              const start = new Date(appointment.debut);
              const end = new Date(appointment.fin);
              const isEven = index % 2 === 0;

              return (
                <Tr
                  key={appointment.id}
                  className={cn(
                    "group transition duration-200 hover:bg-sky-50/80",
                    isEven ? "bg-white" : "bg-sky-50/40",
                  )}
                >
                  <Td>
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f172a]">
                        <span className="h-2 w-2 rounded-full bg-sky-500" aria-hidden />
                        {formatDate(start, { weekday: "long", day: "2-digit", month: "long" })}
                      </span>
                      <span className="text-xs text-[#475569]">
                        {formatTime(start)} - {formatTime(end)}
                      </span>
                      <span className="text-xs font-semibold text-[#0f766e]">{appointment.motif}</span>
                      {appointment.commentaire && (
                        <span className="text-xs text-[#94a3b8]">{appointment.commentaire}</span>
                      )}
                    </div>
                  </Td>
                  <Td>
                    {appointment.medecin ? (
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="font-semibold text-[#0f172a]">{appointment.medecin.fullName}</span>
                        {appointment.medecin.specialty && (
                          <span className="text-xs text-[#64748b]">{appointment.medecin.specialty}</span>
                        )}
                        {appointment.medecin.email && (
                          <span className="text-xs text-[#94a3b8]">{appointment.medecin.email}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-[#94a3b8]">Non assigné</span>
                    )}
                  </Td>
                  <Td>
                    {appointment.patient ? (
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="font-semibold text-[#0f172a]">{appointment.patient.fullName}</span>
                        {appointment.patient.email && (
                          <span className="text-xs text-[#94a3b8]">{appointment.patient.email}</span>
                        )}
                        {appointment.patient.phone && (
                          <span className="text-xs text-[#64748b]">{appointment.patient.phone}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-[#94a3b8]">Non renseigné</span>
                    )}
                  </Td>
                  <Td>{renderStatusLabel(appointment.statut)}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </CardContent>
    </Card>
  );
}
