import { useState } from "react";
import {
  Plus,
  Filter,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { organs, type OrganType } from "../App";

interface TicketSystemProps {
  onNavigate: (
    view: "dashboard" | "docs-general" | "docs-organ" | "tickets"
  ) => void;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  from: OrganType;
  to: OrganType;
  createdAt: string;
  updatedAt: string;
  messages: number;
}

const mockTickets: Ticket[] = [
  {
    id: "T-001",
    title: "Solicitação de laudo pericial - Caso #4567",
    description:
      "Necessário laudo pericial urgente para conclusão de investigação em andamento.",
    status: "in-progress",
    priority: "high",
    category: "Perícia",
    from: "policia",
    to: "iml",
    createdAt: "2025-10-13 14:30",
    updatedAt: "2025-10-14 09:15",
    messages: 5,
  },
  {
    id: "T-002",
    title: "Transferência de corpo para necropsia",
    description:
      "Paciente faleceu em circunstâncias suspeitas. Necessária necropsia.",
    status: "resolved",
    priority: "urgent",
    category: "Necropsia",
    from: "hospital",
    to: "iml",
    createdAt: "2025-10-13 08:00",
    updatedAt: "2025-10-13 16:45",
    messages: 8,
  },
  {
    id: "T-003",
    title: "Análise toxicológica de paciente",
    description:
      "Solicito análise toxicológica completa para paciente internado com sintomas de intoxicação.",
    status: "open",
    priority: "medium",
    category: "Análise Laboratorial",
    from: "hospital",
    to: "iml",
    createdAt: "2025-10-14 10:20",
    updatedAt: "2025-10-14 10:20",
    messages: 0,
  },
  {
    id: "T-004",
    title: "Atualização de sistema - Erro ao exportar relatório",
    description:
      "Sistema apresenta erro ao tentar exportar relatório mensal de ocorrências.",
    status: "in-progress",
    priority: "low",
    category: "Suporte Técnico",
    from: "policia",
    to: "policia",
    createdAt: "2025-10-12 15:45",
    updatedAt: "2025-10-14 08:30",
    messages: 12,
  },
  {
    id: "T-005",
    title: "Compartilhamento de informações - Vítima identificada",
    description:
      "Vítima de crime foi identificada no IML. Necessário atualizar boletim de ocorrência.",
    status: "resolved",
    priority: "high",
    category: "Integração",
    from: "iml",
    to: "policia",
    createdAt: "2025-10-11 13:20",
    updatedAt: "2025-10-12 11:00",
    messages: 4,
  },
];

export default function TicketSystem({ onNavigate }: TicketSystemProps) {
  const [tickets] = useState<Ticket[]>(mockTickets);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "",
    from: "policia" as OrganType,
    to: "iml" as OrganType,
  });

  const statusConfig = {
    open: {
      label: "Aberto",
      icon: AlertCircle,
      color: "bg-blue-100 text-blue-700",
    },
    "in-progress": {
      label: "Em Andamento",
      icon: Clock,
      color: "bg-yellow-100 text-yellow-700",
    },
    resolved: {
      label: "Resolvido",
      icon: CheckCircle,
      color: "bg-green-100 text-green-700",
    },
    closed: {
      label: "Fechado",
      icon: XCircle,
      color: "bg-slate-100 text-slate-700",
    },
  };

  const priorityConfig = {
    low: { label: "Baixa", color: "bg-slate-100 text-slate-700" },
    medium: { label: "Média", color: "bg-blue-100 text-blue-700" },
    high: { label: "Alta", color: "bg-orange-100 text-orange-700" },
    urgent: { label: "Urgente", color: "bg-red-100 text-red-700" },
  };

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTicket = () => {
    console.log("Creating ticket:", newTicket);
    setIsDialogOpen(false);
    setNewTicket({
      title: "",
      description: "",
      priority: "medium",
      category: "",
      from: "policia",
      to: "iml",
    });
  };

  // Atualiza contadores globais na navbar
  const unreadTickets = tickets.filter(
    (t) => t.messages > 0 && t.status !== "closed"
  );
  const unreadCount = unreadTickets.length;
  const openInProgressCount = tickets.filter(
    (t) => t.status === "open" || t.status === "in-progress"
  ).length;
  if (typeof window !== "undefined") {
    try {
      const current = parseInt(
        localStorage.getItem("ticketsUnreadCount") || "-1",
        10
      );
      const list = unreadTickets.map((t) => ({
        id: t.id,
        title: t.title,
        messages: t.messages,
      }));
      const prevListStr = localStorage.getItem("ticketsUnreadList") || "[]";
      const prevList = JSON.parse(prevListStr);
      const listsAreDifferent =
        JSON.stringify(prevList) !== JSON.stringify(list);
      if (current !== unreadCount || listsAreDifferent) {
        localStorage.setItem("ticketsUnreadCount", String(unreadCount));
        localStorage.setItem("ticketsUnreadList", JSON.stringify(list));
        window.dispatchEvent(new Event("ticketsUnreadUpdate"));
      }

      const prevOpenInProgress = parseInt(
        localStorage.getItem("ticketsOpenInProgressCount") || "-1",
        10
      );
      if (prevOpenInProgress !== openInProgressCount) {
        localStorage.setItem(
          "ticketsOpenInProgressCount",
          String(openInProgressCount)
        );
        window.dispatchEvent(new Event("ticketsOpenInProgressUpdate"));
      }
    } catch (_) {}
  }

  const getTicketsByStatus = (status: string) => {
    return filteredTickets.filter((t) => t.status === status);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900">Sistema de Tickets</h1>
          <p className="text-slate-600">
            Gerencie solicitações e suporte entre secretarias
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onNavigate("dashboard")}>
            Voltar ao Dashboard
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Novo Ticket</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes da solicitação ou problema
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    placeholder="Descreva brevemente o ticket"
                    value={newTicket.title}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Forneça detalhes sobre a solicitação"
                    rows={4}
                    value={newTicket.description}
                    onChange={(e) =>
                      setNewTicket({
                        ...newTicket,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from">De</Label>
                    <Select
                      value={newTicket.from}
                      onValueChange={(value: string) =>
                        setNewTicket({ ...newTicket, from: value as OrganType })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {organs.map((organ) => (
                          <SelectItem key={organ.id} value={organ.id}>
                            {organ.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to">Para</Label>
                    <Select
                      value={newTicket.to}
                      onValueChange={(value: string) =>
                        setNewTicket({ ...newTicket, to: value as OrganType })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {organs.map((organ) => (
                          <SelectItem key={organ.id} value={organ.id}>
                            {organ.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select
                      value={newTicket.priority}
                      onValueChange={(value: string) =>
                        setNewTicket({ ...newTicket, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Input
                      id="category"
                      placeholder="Ex: Perícia, Suporte"
                      value={newTicket.category}
                      onChange={(e) =>
                        setNewTicket({ ...newTicket, category: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleCreateTicket}>Criar Ticket</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Abertos</p>
                <p className="text-slate-900 mt-1">
                  {getTicketsByStatus("open").length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Em Andamento</p>
                <p className="text-slate-900 mt-1">
                  {getTicketsByStatus("in-progress").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Resolvidos</p>
                <p className="text-slate-900 mt-1">
                  {getTicketsByStatus("resolved").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total</p>
                <p className="text-slate-900 mt-1">{tickets.length}</p>
              </div>
              <Filter className="w-8 h-8 text-slate-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            placeholder="Buscar tickets..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Tickets List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            Todos ({filteredTickets.length})
          </TabsTrigger>
          <TabsTrigger value="open">
            Abertos ({getTicketsByStatus("open").length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            Em Andamento ({getTicketsByStatus("in-progress").length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolvidos ({getTicketsByStatus("resolved").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-6">
          {filteredTickets.map((ticket) => {
            const fromOrgan = organs.find((o) => o.id === ticket.from);
            const toOrgan = organs.find((o) => o.id === ticket.to);
            const FromIcon = fromOrgan?.icon || AlertCircle;
            const ToIcon = toOrgan?.icon || AlertCircle;

            return (
              <Card
                key={ticket.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {ticket.id}
                        </Badge>
                        <Badge className={statusConfig[ticket.status].color}>
                          {statusConfig[ticket.status].label}
                        </Badge>
                        <Badge
                          className={priorityConfig[ticket.priority].color}
                        >
                          {priorityConfig[ticket.priority].label}
                        </Badge>
                        <Badge variant="outline">{ticket.category}</Badge>
                      </div>
                      <h3 className="text-slate-900 mb-2">{ticket.title}</h3>
                      <p className="text-slate-600 text-sm mb-3">
                        {ticket.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                          <div
                            className={`${fromOrgan?.color} w-6 h-6 rounded flex items-center justify-center`}
                          >
                            <FromIcon className="w-3 h-3 text-white" />
                          </div>
                          <span>{fromOrgan?.name}</span>
                          <span>→</span>
                          <div
                            className={`${toOrgan?.color} w-6 h-6 rounded flex items-center justify-center`}
                          >
                            <ToIcon className="w-3 h-3 text-white" />
                          </div>
                          <span>{toOrgan?.name}</span>
                        </div>
                        <span>•</span>
                        <span>Criado em {ticket.createdAt}</span>
                        {ticket.messages > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>{ticket.messages} mensagens</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {["open", "in-progress", "resolved"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-3 mt-6">
            {getTicketsByStatus(status).map((ticket) => {
              const fromOrgan = organs.find((o) => o.id === ticket.from);
              const toOrgan = organs.find((o) => o.id === ticket.to);
              const FromIcon = fromOrgan?.icon || AlertCircle;
              const ToIcon = toOrgan?.icon || AlertCircle;

              return (
                <Card
                  key={ticket.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {ticket.id}
                          </Badge>
                          <Badge className={statusConfig[ticket.status].color}>
                            {statusConfig[ticket.status].label}
                          </Badge>
                          <Badge
                            className={priorityConfig[ticket.priority].color}
                          >
                            {priorityConfig[ticket.priority].label}
                          </Badge>
                          <Badge variant="outline">{ticket.category}</Badge>
                        </div>
                        <h3 className="text-slate-900 mb-2">{ticket.title}</h3>
                        <p className="text-slate-600 text-sm mb-3">
                          {ticket.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <div className="flex items-center gap-2">
                            <div
                              className={`${fromOrgan?.color} w-6 h-6 rounded flex items-center justify-center`}
                            >
                              <FromIcon className="w-3 h-3 text-white" />
                            </div>
                            <span>{fromOrgan?.name}</span>
                            <span>→</span>
                            <div
                              className={`${toOrgan?.color} w-6 h-6 rounded flex items-center justify-center`}
                            >
                              <ToIcon className="w-3 h-3 text-white" />
                            </div>
                            <span>{toOrgan?.name}</span>
                          </div>
                          <span>•</span>
                          <span>Criado em {ticket.createdAt}</span>
                          {ticket.messages > 0 && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" />
                                <span>{ticket.messages} mensagens</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
