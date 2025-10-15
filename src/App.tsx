import { useEffect, useState } from "react";
import {
  Shield,
  Hospital,
  Microscope,
  Home,
  FileText,
  Ticket,
  Search,
  Bell,
} from "lucide-react";
import Dashboard from "./components/Dashboard";
import DocumentationGeneral from "./components/DocumentationGeneral";
import DocumentationOrgan from "./components/DocumentationOrgan";
import TicketSystem from "./components/TicketSystem";
import SearchCase from "./components/SearchCase";
import TimelineCase from "./components/TimelineCase";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";

export type OrganType = "policia" | "hospital" | "iml";

export interface Organ {
  id: OrganType;
  name: string;
  icon: typeof Shield;
  color: string;
  description: string;
}

export const organs: Organ[] = [
  {
    id: "policia",
    name: "Polícia Civil",
    icon: Shield,
    color: "bg-blue-600",
    description: "Secretaria de Segurança Pública",
  },
  {
    id: "hospital",
    name: "Hospital Regional",
    icon: Hospital,
    color: "bg-emerald-600",
    description: "Secretaria de Saúde",
  },
  {
    id: "iml",
    name: "POLITEC",
    icon: Microscope,
    color: "bg-purple-600",
    description: "Perícia Técnica Científica",
  },
];

type ViewType =
  | "dashboard"
  | "docs-general"
  | "docs-organ"
  | "tickets"
  | "search"
  | "timeline";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>("search"); // Começar na página de pesquisa
  const [selectedOrgan, setSelectedOrgan] = useState<OrganType | null>(null);
  const [currentCase, setCurrentCase] = useState<any>(null);
  const [ticketsUnread, setTicketsUnread] = useState<number>(0);
  const [unreadList, setUnreadList] = useState<
    { id: string; title: string; messages: number }[]
  >([]);
  const [ticketsOpenInProgress, setTicketsOpenInProgress] = useState<number>(0);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const read = () => {
      try {
        const v = parseInt(
          localStorage.getItem("ticketsUnreadCount") || "0",
          10
        );
        setTicketsUnread(Number.isFinite(v) ? v : 0);
        const listStr = localStorage.getItem("ticketsUnreadList") || "[]";
        try {
          setUnreadList(JSON.parse(listStr));
        } catch {
          setUnreadList([]);
        }
        const s = parseInt(
          localStorage.getItem("ticketsOpenInProgressCount") || "0",
          10
        );
        setTicketsOpenInProgress(Number.isFinite(s) ? s : 0);
      } catch {
        setTicketsUnread(0);
      }
    };
    read();
    const handler = () => read();
    window.addEventListener("ticketsUnreadUpdate", handler);
    window.addEventListener("ticketsOpenInProgressUpdate", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("ticketsUnreadUpdate", handler);
      window.removeEventListener("ticketsOpenInProgressUpdate", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const handleSelectCase = (caseData: any) => {
    setCurrentCase(caseData);
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <Dashboard
            onNavigate={setCurrentView}
            onSelectOrgan={setSelectedOrgan}
            caseData={currentCase}
          />
        );
      case "docs-general":
        return <DocumentationGeneral onNavigate={setCurrentView} />;
      case "docs-organ":
        return (
          <DocumentationOrgan
            organ={selectedOrgan}
            onNavigate={setCurrentView}
            onSelectOrgan={setSelectedOrgan}
          />
        );
      case "tickets":
        return <TicketSystem onNavigate={setCurrentView} />;
      case "search":
        return (
          <SearchCase
            onNavigate={setCurrentView}
            onSelectCase={handleSelectCase}
          />
        );
      case "timeline":
        return (
          <TimelineCase onNavigate={setCurrentView} caseData={currentCase} />
        );
      default:
        return (
          <SearchCase
            onNavigate={setCurrentView}
            onSelectCase={handleSelectCase}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-900 rounded flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-slate-900">
                  SIGES - Sistema Integrado de Gestão Estadual
                </h1>
                <p className="text-slate-500 text-sm">
                  Gestão de Casos e Integração Institucional
                </p>
              </div>
            </div>
            <nav className="flex items-center gap-2">
              <Button
                variant={currentView === "search" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentView("search")}
              >
                <Search className="w-4 h-4 mr-2" />
                Pesquisar
              </Button>
              <Button
                variant={currentView === "dashboard" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentView("dashboard")}
              >
                <Home className="w-4 h-4 mr-2" />
                Caso Atual
              </Button>
              <Button
                variant={currentView === "docs-general" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentView("docs-general")}
              >
                <FileText className="w-4 h-4 mr-2" />
                Documentação
              </Button>
              <Button
                variant={currentView === "tickets" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentView("tickets")}
              >
                <Ticket className="w-4 h-4 mr-2" />
                Solicitações
                <Badge variant="secondary" className="ml-2">
                  {ticketsOpenInProgress}
                </Badge>
              </Button>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Notificações de tickets"
                  onClick={() => setNotifOpen((v) => !v)}
                >
                  <div className="relative">
                    <Bell className="w-4 h-4" />
                    {ticketsUnread > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full">
                        {ticketsUnread}
                      </span>
                    )}
                  </div>
                </Button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-xl p-0 z-50 overflow-hidden">
                    <div className="px-3 py-2 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                      <div className="text-slate-900 text-sm font-medium">
                        Notificações
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {ticketsUnread}
                      </Badge>
                    </div>
                    {unreadList.length === 0 ? (
                      <div className="px-3 py-4 text-slate-600 text-sm">
                        Nenhuma nova resposta.
                      </div>
                    ) : (
                      <div className="max-h-80 overflow-auto p-2">
                        <div className="space-y-2">
                          {unreadList.map((t, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white transition-colors shadow-sm"
                            >
                              <div className="flex items-start gap-3">
                                <div className="mt-0.5 w-8 h-8 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                                  <Ticket className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-slate-900 text-sm font-medium">
                                    Ticket {t.id} respondido
                                  </div>
                                  <div className="text-slate-600 text-xs overflow-hidden text-ellipsis whitespace-nowrap max-w-[220px]">
                                    {t.title}
                                  </div>
                                  <div className="mt-1 text-xs text-blue-600">
                                    {t.messages} nova(s) mensagem(ns)
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}
