import { useState } from "react";
import {
  User,
  MapPin,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Info,
  Activity,
  Camera,
  Shield,
  Hospital,
  Microscope,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface TimelineCaseProps {
  onNavigate: (
    view: "dashboard" | "docs-general" | "docs-organ" | "tickets" | "search"
  ) => void;
  caseData?: any;
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  date: string;
  time: string;
  type: "incident" | "police" | "hospital" | "iml" | "general";
  title: string;
  description: string;
  author: string;
  location?: string;
  attachments?: string[];
  status: "completed" | "in_progress" | "pending";
  priority: "high" | "medium" | "low";
}

const eventTypes = {
  incident: { label: "Incidente", icon: AlertCircle, color: "bg-red-500" },
  police: { label: "Polícia", icon: Shield, color: "bg-blue-500" },
  hospital: { label: "Hospital", icon: Hospital, color: "bg-emerald-500" },
  iml: { label: "POLITEC", icon: Microscope, color: "bg-purple-500" },
  general: { label: "Geral", icon: Info, color: "bg-slate-500" },
};

export default function TimelineCase({
  onNavigate,
  caseData,
}: TimelineCaseProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: "1",
      timestamp: "2024-01-15T14:30:00",
      date: "15/01/2024",
      time: "14:30",
      type: "incident",
      title: "Ocorrência Registrada",
      description:
        "Homicídio registrado na Central de Emergência. Vítima encontrada sem vida em residência.",
      author: "Central 190",
      location: "Rua das Flores, 123 - Centro",
      status: "completed",
      priority: "high",
    },
    {
      id: "2",
      timestamp: "2024-01-15T14:45:00",
      date: "15/01/2024",
      time: "14:45",
      type: "police",
      title: "Polícia Deslocada",
      description:
        "Equipe policial deslocada para o local. Isolamento da área iniciado.",
      author: "Del. João Carlos",
      location: "Rua das Flores, 123 - Centro",
      status: "completed",
      priority: "high",
    },
    {
      id: "3",
      timestamp: "2024-01-15T15:20:00",
      date: "15/01/2024",
      time: "15:20",
      type: "iml",
      title: "IML Notificado",
      description:
        "Instituto Médico Legal notificado para remoção do corpo e necropsia.",
      author: "Del. João Carlos",
      location: "IML Regional",
      status: "completed",
      priority: "high",
    },
    {
      id: "4",
      timestamp: "2024-01-15T16:00:00",
      date: "15/01/2024",
      time: "16:00",
      type: "police",
      title: "Boletim de Ocorrência",
      description:
        "BO registrado com número 2024-001234. Início das investigações.",
      author: "Del. João Carlos",
      status: "completed",
      priority: "medium",
    },
    {
      id: "5",
      timestamp: "2024-01-16T09:00:00",
      date: "16/01/2024",
      time: "09:00",
      type: "iml",
      title: "Necropsia Agendada",
      description: "Exame necroscópico agendado para 17/01/2024 às 08:00h.",
      author: "Dr. Carlos Mendes - IML",
      location: "IML Regional",
      status: "completed",
      priority: "medium",
    },
    {
      id: "6",
      timestamp: "2024-01-17T08:00:00",
      date: "17/01/2024",
      time: "08:00",
      type: "iml",
      title: "Necropsia Realizada",
      description: "Exame necroscópico concluído. Aguardando laudo pericial.",
      author: "Dr. Carlos Mendes - IML",
      location: "IML Regional",
      status: "completed",
      priority: "high",
    },
    {
      id: "7",
      timestamp: "2024-01-18T10:30:00",
      date: "18/01/2024",
      time: "10:30",
      type: "police",
      title: "Evidências Coletadas",
      description:
        "Materiais coletados no local enviados para análise na POLITEC.",
      author: "Perito Silva",
      location: "POLITEC Regional",
      status: "in_progress",
      priority: "high",
    },
    {
      id: "8",
      timestamp: "2024-01-20T14:00:00",
      date: "20/01/2024",
      time: "14:00",
      type: "iml",
      title: "Análise em Andamento",
      description:
        "Análise de DNA e impressões digitais em processo. Prazo estimado: 5 dias.",
      author: "Dr. Ana Lima - POLITEC",
      location: "POLITEC Regional",
      status: "in_progress",
      priority: "medium",
    },
  ]);

  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<TimelineEvent>>({
    type: "general",
    status: "pending",
    priority: "medium",
  });

  const defaultCaseData = {
    victimName: "Maria Silva Santos",
    caseNumber: "BO-2024-001234",
    incidentDate: "15/01/2024",
    incidentType: "Homicídio",
    status: "Em Investigação",
    assignedOfficer: "Del. João Carlos",
    priority: "Alta",
  };

  const currentCaseData = caseData || defaultCaseData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.description || !newEvent.author) return;

    const event: TimelineEvent = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString("pt-BR"),
      time: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: newEvent.type as any,
      title: newEvent.title,
      description: newEvent.description,
      author: newEvent.author,
      location: newEvent.location,
      status: newEvent.status as any,
      priority: newEvent.priority as any,
    };

    setEvents([event, ...events]);
    setNewEvent({
      type: "general",
      status: "pending",
      priority: "medium",
    });
    setIsAddEventOpen(false);
  };

  const generateReport = () => {
    const caseNumber = currentCaseData.caseNumber || "-";
    const victimName = currentCaseData.victimName || "-";
    const incidentType = currentCaseData.incidentType || "-";
    const incidentDate = currentCaseData.incidentDate || "-";
    const assignedOfficer = currentCaseData.assignedOfficer || "-";

    // Dados fictícios para o relatório (podem ser substituídos por dados reais depois)
    const mock = {
      protocolos: {
        ml: "ML-2025-004321",
        dna: "DNA-2025-000987",
        tox: "TOX-2025-001256",
      },
      requisicao: {
        numero: "REQ-2025-7788",
        data: "16/01/2024",
        autoridade: "Delegado Regional - 5ª DR",
      },
      envolvidos: {
        autoridades:
          "Delegado João Carlos; Perita Ana Lima; Escrivão Pedro Rocha",
        nomes: "Maria Silva Santos (vítima); Carlos Souza (suspeito)",
        relatoVitima:
          "Vítima foi encontrada em residência por vizinhos após ruído de discussão na madrugada.",
      },
      datas: {
        fato: incidentDate,
        coleta: "16/01/2024",
      },
      amostras: {
        quantidade: "3",
        tipo: "Material biológico e objeto",
        descricao: "Swab sanguíneo; fragmento de tecido; faca de cozinha",
        lacre: "LAC-55821, LAC-55822, LAC-55823",
        procedencia: "Polícia Civil - Equipe de Perícia de Local",
      },
    };

    const eventsRows = events
      .map(
        (e) => `
          <tr>
            <td>${e.date} ${e.time}</td>
            <td>${eventTypes[e.type].label}</td>
            <td>${e.title}</td>
            <td>${e.description || ""}</td>
            <td>${e.author || ""}</td>
            <td>${e.location || ""}</td>
            <td>${e.status}</td>
            <td>${e.priority}</td>
          </tr>`
      )
      .join("");

    const html = `
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Relatório do Caso ${caseNumber}</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; color: #0f172a; margin: 24px; }
            h1 { font-size: 22px; margin: 0 0 8px; }
            h2 { font-size: 16px; margin: 24px 0 8px; }
            .muted { color: #475569; }
            .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
            .section { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
            .kv { display: grid; grid-template-columns: 220px 1fr; gap: 8px; margin: 4px 0; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #e2e8f0; padding: 8px; font-size: 12px; vertical-align: top; }
            th { background: #f8fafc; text-align: left; }
            .footer { margin-top: 24px; font-size: 12px; color: #64748b; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="no-print" style="display:flex; gap:8px; margin-bottom:16px;">
            <button onclick="window.print()" style="padding:8px 12px;border:1px solid #cbd5e1;border-radius:6px;background:#0ea5e9;color:white;cursor:pointer;">Imprimir / Salvar como PDF</button>
          </div>
          <h1>Relatório do Caso ${caseNumber}</h1>
          <div class="muted">Gerado em ${new Date().toLocaleString(
            "pt-BR"
          )}</div>

          <div class="section" style="margin-top:16px;">
            <h2>Resumo do Caso</h2>
            <div class="kv"><div>Número do Caso</div><div>${caseNumber}</div></div>
            <div class="kv"><div>Vítima</div><div>${victimName}</div></div>
            <div class="kv"><div>Tipo de Incidente</div><div>${incidentType}</div></div>
            <div class="kv"><div>Data do Incidente</div><div>${incidentDate}</div></div>
            <div class="kv"><div>Responsável</div><div>${assignedOfficer}</div></div>
          </div>

          <div class="grid" style="margin-top:16px;">
            <div class="section">
              <h2>Protocolos</h2>
              <div class="kv"><div>Nº protocolo ML</div><div>${
                mock.protocolos.ml
              }</div></div>
              <div class="kv"><div>Nº protocolo DNA</div><div>${
                mock.protocolos.dna
              }</div></div>
              <div class="kv"><div>Nº protocolo TOX</div><div>${
                mock.protocolos.tox
              }</div></div>
            </div>
            <div class="section">
              <h2>Requisição</h2>
              <div class="kv"><div>Nº de requisição</div><div>${
                mock.requisicao.numero
              }</div></div>
              <div class="kv"><div>Data da requisição</div><div>${
                mock.requisicao.data
              }</div></div>
              <div class="kv"><div>Autoridade requisitante</div><div>${
                mock.requisicao.autoridade
              }</div></div>
            </div>
            <div class="section">
              <h2>Envolvidos</h2>
              <div class="kv"><div>Autoridades envolvidas</div><div>${
                mock.envolvidos.autoridades
              }</div></div>
              <div class="kv"><div>Nomes dos envolvidos</div><div>${
                mock.envolvidos.nomes
              }</div></div>
              <div class="kv"><div>Relato da vítima</div><div>${
                mock.envolvidos.relatoVitima
              }</div></div>
            </div>
          </div>

          <div class="grid" style="margin-top:16px;">
            <div class="section">
              <h2>Datas</h2>
              <div class="kv"><div>Data do fato</div><div>${
                mock.datas.fato
              }</div></div>
              <div class="kv"><div>Data da coleta</div><div>${
                mock.datas.coleta
              }</div></div>
            </div>
            <div class="section" style="grid-column: span 2;">
              <h2>Amostras</h2>
              <div class="kv"><div>Quantidade</div><div>${
                mock.amostras.quantidade
              }</div></div>
              <div class="kv"><div>Tipo (biológico/objeto)</div><div>${
                mock.amostras.tipo
              }</div></div>
              <div class="kv"><div>Descrição</div><div>${
                mock.amostras.descricao
              }</div></div>
              <div class="kv"><div>Lacre</div><div>${
                mock.amostras.lacre
              }</div></div>
              <div class="kv"><div>Procedência (quem enviou)</div><div>${
                mock.amostras.procedencia
              }</div></div>
            </div>
          </div>

          <div class="section" style="margin-top:16px;">
            <h2>Cronologia de Eventos</h2>
            <table>
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Tipo</th>
                  <th>Título</th>
                  <th>Descrição</th>
                  <th>Autor</th>
                  <th>Local</th>
                  <th>Status</th>
                  <th>Prioridade</th>
                </tr>
              </thead>
              <tbody>
                ${eventsRows}
              </tbody>
            </table>
          </div>

          <div class="footer">Este documento foi gerado automaticamente pelo sistema. Utilize "Imprimir" para salvar como PDF.</div>
        </body>
      </html>
    `;

    const reportWindow = window.open("", "_blank");
    if (!reportWindow) return;
    reportWindow.document.open();
    reportWindow.document.write(html);
    reportWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Timeline do Caso - {currentCaseData.caseNumber}
          </h1>
          <p className="text-slate-600">
            Cronologia completa dos eventos do caso
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => onNavigate("dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Caso
          </Button>
          <Button variant="outline" onClick={generateReport}>
            Gerar Relatório
          </Button>
          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Evento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Evento</DialogTitle>
                <DialogDescription>
                  Registre um novo evento na timeline do caso
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título do Evento</Label>
                  <Input
                    id="title"
                    value={newEvent.title || ""}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                    placeholder="Ex: Necropsia realizada"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description || ""}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, description: e.target.value })
                    }
                    placeholder="Descreva o evento..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="author">Responsável</Label>
                  <Input
                    id="author"
                    value={newEvent.author || ""}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, author: e.target.value })
                    }
                    placeholder="Ex: Del. João Carlos"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Local (opcional)</Label>
                  <Input
                    id="location"
                    value={newEvent.location || ""}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, location: e.target.value })
                    }
                    placeholder="Ex: IML Regional"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      value={newEvent.type}
                      onValueChange={(value: string) =>
                        setNewEvent({ ...newEvent, type: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="incident">Incidente</SelectItem>
                        <SelectItem value="police">Polícia</SelectItem>
                        <SelectItem value="hospital">Hospital</SelectItem>
                        <SelectItem value="iml">POLITEC</SelectItem>
                        <SelectItem value="general">Geral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newEvent.status}
                      onValueChange={(value: string) =>
                        setNewEvent({ ...newEvent, status: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="in_progress">
                          Em Andamento
                        </SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddEventOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleAddEvent}>Adicionar</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Case Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Resumo do Caso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-slate-600 text-sm">Vítima</p>
              <p className="text-slate-900 font-medium">
                {currentCaseData.victimName}
              </p>
            </div>
            <div>
              <p className="text-slate-600 text-sm">Tipo de Incidente</p>
              <p className="text-slate-900 font-medium">
                {currentCaseData.incidentType}
              </p>
            </div>
            <div>
              <p className="text-slate-600 text-sm">Investigador Responsável</p>
              <p className="text-slate-900 font-medium">
                {currentCaseData.assignedOfficer}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          Cronologia dos Eventos ({events.length})
        </h2>

        <div className="relative pl-2 sm:pl-0">
          {/* Timeline Line - centralizada com o ícone */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-200"></div>

          {events.map((event) => {
            const EventIcon = eventTypes[event.type].icon;
            const eventColor = eventTypes[event.type].color;

            return (
              <div
                key={event.id}
                className="relative flex items-start gap-4 pb-8"
              >
                {/* Timeline Icon */}
                <div
                  className={`relative z-10 ${eventColor} w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center flex-shrink-0 mt-1`}
                >
                  <EventIcon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>

                {/* Event Content */}
                <div className="flex-1 min-w-0">
                  <Card className="hover:shadow-sm transition-shadow border-slate-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">
                              {event.title}
                            </CardTitle>
                            <Badge className={getStatusColor(event.status)}>
                              {event.status === "completed"
                                ? "Concluído"
                                : event.status === "in_progress"
                                ? "Em Andamento"
                                : "Pendente"}
                            </Badge>
                            <Badge className={getPriorityColor(event.priority)}>
                              {event.priority === "high"
                                ? "Alta"
                                : event.priority === "medium"
                                ? "Média"
                                : "Baixa"}
                            </Badge>
                          </div>
                          <CardDescription className="text-sm">
                            {event.date} às {event.time} •{" "}
                            {eventTypes[event.type].label}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-700 mb-3">{event.description}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {event.author}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                        )}
                      </div>
                      {event.attachments && event.attachments.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Camera className="w-4 h-4" />
                            <span>{event.attachments.length} anexo(s)</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas da Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {events.filter((e) => e.status === "completed").length}
              </div>
              <div className="text-sm text-slate-600">Eventos Concluídos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {events.filter((e) => e.status === "in_progress").length}
              </div>
              <div className="text-sm text-slate-600">Em Andamento</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {events.filter((e) => e.status === "pending").length}
              </div>
              <div className="text-sm text-slate-600">Pendentes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-600">
                {events.length}
              </div>
              <div className="text-sm text-slate-600">Total de Eventos</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
