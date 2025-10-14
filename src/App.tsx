import { useState } from "react";
import {
  Shield,
  Hospital,
  Microscope,
  FlaskConical,
  Home,
  FileText,
  Ticket,
  Search,
} from "lucide-react";
import Dashboard from "./components/Dashboard";
import DocumentationGeneral from "./components/DocumentationGeneral";
import DocumentationOrgan from "./components/DocumentationOrgan";
import TicketSystem from "./components/TicketSystem";
import SearchCase from "./components/SearchCase";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";

export type OrganType = "policia" | "hospital" | "iml" | "politec";

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
    name: "IML",
    icon: Microscope,
    color: "bg-purple-600",
    description: "Instituto Médico Legal",
  },
  {
    id: "politec",
    name: "POLITEC",
    icon: FlaskConical,
    color: "bg-orange-600",
    description: "Perícia Técnica Científica",
  },
];

type ViewType =
  | "dashboard"
  | "docs-general"
  | "docs-organ"
  | "tickets"
  | "search";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>("search"); // Começar na página de pesquisa
  const [selectedOrgan, setSelectedOrgan] = useState<OrganType | null>(null);
  const [currentCase, setCurrentCase] = useState<any>(null);

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
                  3
                </Badge>
              </Button>
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
