import { useState } from "react";
import { Search, User, FileText, Calendar, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

interface SearchCaseProps {
  onNavigate: (
    view: "dashboard" | "docs-general" | "docs-organ" | "tickets" | "search"
  ) => void;
  onSelectCase: (caseData: any) => void;
}

// Dados simulados de casos
const mockCases = [
  {
    id: "BO-2024-001234",
    victimName: "Maria Silva Santos",
    incidentDate: "15/01/2024",
    incidentType: "Homicídio",
    status: "Em Investigação",
    assignedOfficer: "Del. João Carlos",
    priority: "Alta",
    location: "Centro - São Paulo/SP",
    age: 34,
    gender: "Feminino",
  },
  {
    id: "BO-2024-001156",
    victimName: "Carlos Eduardo Lima",
    incidentDate: "12/01/2024",
    incidentType: "Tentativa de Homicídio",
    status: "Arquivado",
    assignedOfficer: "Del. Ana Paula",
    priority: "Média",
    location: "Vila Madalena - São Paulo/SP",
    age: 28,
    gender: "Masculino",
  },
  {
    id: "BO-2024-000987",
    victimName: "Fernanda Oliveira Costa",
    incidentDate: "08/01/2024",
    incidentType: "Lesão Corporal",
    status: "Em Investigação",
    assignedOfficer: "Del. Roberto Silva",
    priority: "Baixa",
    location: "Pinheiros - São Paulo/SP",
    age: 42,
    gender: "Feminino",
  },
  {
    id: "BO-2024-000756",
    victimName: "João Pedro Santos",
    incidentDate: "05/01/2024",
    incidentType: "Homicídio",
    status: "Em Análise",
    assignedOfficer: "Del. Maria Fernanda",
    priority: "Alta",
    location: "Mooca - São Paulo/SP",
    age: 56,
    gender: "Masculino",
  },
  {
    id: "BO-2024-000543",
    victimName: "Ana Carolina Mendes",
    incidentDate: "02/01/2024",
    incidentType: "Agressão",
    status: "Concluído",
    assignedOfficer: "Del. Carlos Alberto",
    priority: "Baixa",
    location: "Jardins - São Paulo/SP",
    age: 29,
    gender: "Feminino",
  },
];

export default function SearchCase({
  onNavigate,
  onSelectCase,
}: SearchCaseProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    const results = mockCases.filter(
      (caseItem) =>
        caseItem.victimName.toLowerCase().includes(term) ||
        caseItem.id.toLowerCase().includes(term) ||
        caseItem.incidentType.toLowerCase().includes(term)
    );

    setSearchResults(results);
    setHasSearched(true);
  };

  const handleSelectCase = (caseData: any) => {
    onSelectCase(caseData);
    onNavigate("dashboard");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Investigação":
        return "bg-blue-100 text-blue-800";
      case "Arquivado":
        return "bg-gray-100 text-gray-800";
      case "Em Análise":
        return "bg-yellow-100 text-yellow-800";
      case "Concluído":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "bg-red-100 text-red-800";
      case "Média":
        return "bg-orange-100 text-orange-800";
      case "Baixa":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Pesquisar Casos</h1>
          <p className="text-slate-600 text-lg mt-1">
            Busque por vítima, número do caso ou tipo de incidente
          </p>
        </div>
        <Button variant="outline" onClick={() => onNavigate("dashboard")}>
          Voltar ao Caso Atual
        </Button>
      </div>

      {/* Barra de Pesquisa */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Search className="w-5 h-5 text-slate-600" />
            Buscar Caso
          </CardTitle>
          <CardDescription className="text-slate-600">
            Digite o nome da vítima, número do BO ou tipo de incidente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Ex: Maria Silva, BO-2024-001234, Homicídio..."
                className="pl-10 h-12 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={!searchTerm.trim()}
              className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white border-0"
            >
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados da Pesquisa */}
      {hasSearched && (
        <div>
          <div className="mb-4">
            <h2 className="text-slate-900">
              {searchResults.length > 0
                ? `${searchResults.length} caso(s) encontrado(s)`
                : "Nenhum caso encontrado"}
            </h2>
            <p className="text-slate-600">
              {searchResults.length > 0
                ? `Resultados para: "${searchTerm}"`
                : `Nenhum resultado para: "${searchTerm}"`}
            </p>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-4">
              {searchResults.map((caseItem) => (
                <Card
                  key={caseItem.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleSelectCase(caseItem)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                          <User className="w-6 h-6 text-slate-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {caseItem.victimName}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <FileText className="w-4 h-4" />
                            {caseItem.id}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(caseItem.priority)}>
                          {caseItem.priority}
                        </Badge>
                        <Badge className={getStatusColor(caseItem.status)}>
                          {caseItem.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-slate-600 text-sm">
                            Data do Incidente
                          </p>
                          <p className="text-slate-900 font-medium">
                            {caseItem.incidentDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-slate-600 text-sm">Tipo</p>
                          <p className="text-slate-900 font-medium">
                            {caseItem.incidentType}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-slate-600 text-sm">Local</p>
                          <p className="text-slate-900 font-medium">
                            {caseItem.location}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <span className="text-slate-600">Investigador: </span>
                          <span className="text-slate-900 font-medium">
                            {caseItem.assignedOfficer}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-600">Vítima: </span>
                          <span className="text-slate-900 font-medium">
                            {caseItem.gender}, {caseItem.age} anos
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {searchResults.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-slate-900 mb-2">Nenhum caso encontrado</h3>
                <p className="text-slate-600 mb-4">
                  Tente pesquisar com termos diferentes ou verifique a
                  ortografia
                </p>
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Limpar Pesquisa
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Casos Recentes */}
      {!hasSearched && (
        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="w-5 h-5 text-slate-600" />
              Casos Recentes
            </CardTitle>
            <CardDescription className="text-slate-600">
              Últimos casos abertos no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCases.slice(0, 3).map((caseItem) => (
                <Card
                  key={caseItem.id}
                  className="border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors bg-white"
                  onClick={() => handleSelectCase(caseItem)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-slate-900 font-semibold text-lg">
                            {caseItem.victimName}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-600 text-sm">
                                {caseItem.id}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-600 text-sm">
                                {caseItem.incidentDate}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`${getPriorityColor(
                            caseItem.priority
                          )} text-sm px-3 py-1`}
                        >
                          {caseItem.priority}
                        </Badge>
                        <Badge
                          className={`${getStatusColor(
                            caseItem.status
                          )} text-sm px-3 py-1`}
                        >
                          {caseItem.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
