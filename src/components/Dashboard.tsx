import { useState } from "react";
import {
  Activity,
  FileText,
  Link2,
  Users,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { organs, type OrganType } from "../App";

interface DashboardProps {
  onNavigate: (
    view:
      | "dashboard"
      | "docs-general"
      | "docs-organ"
      | "tickets"
      | "search"
      | "timeline"
  ) => void;
  onSelectOrgan: (organ: OrganType) => void;
  caseData?: any;
}

// Definição dos sistemas/módulos disponíveis
interface SystemModule {
  id: string;
  name: string;
  description: string;
  type: "primary" | "integration" | "documentation";
}

// Matriz de acesso: quais sistemas cada secretaria tem acesso
// true = disponível, false = desabilitado, 'pending' = aguardando dados
const accessMatrix: Record<OrganType, Record<string, boolean | "pending">> = {
  policia: {
    ocorrencias: true,
    investigacoes: true,
    "registros-criminais": "pending", // Aguardando sincronização
    "solicitar-pericia": true,
    "prontuario-vitimas": "pending", // Aguardando dados do hospital
    "laudos-tecnicos": "pending", // Aguardando laudos
    "portal-integracao": true,
    "docs-institucionais": true,
    "docs-policia": true,
  },
  hospital: {
    prontuario: true,
    emergencia: true,
    internacao: "pending", // Sistema em atualização
    "notificar-iml": true,
    "solicitar-analises": true,
    "historico-policial": "pending", // Aguardando dados da polícia
    "portal-integracao": true,
    "docs-institucionais": true,
    "docs-hospital": true,
  },
  iml: {
    necropsia: true,
    "laudos-periciais": "pending", // Aguardando protocolos
    identificacao: "pending", // Sistema em desenvolvimento
    "arquivo-amostras": true,
    "receber-corpos": true,
    "analise-evidencias": "pending", // Laboratório em manutenção
    balistica: true,
    documentoscopia: "pending", // Aguardando equipamentos
    toxicologia: "pending", // Aguardando reagentes
    "dna-forense": "pending", // Sistema em calibração
    "casos-policiais": "pending", // Aguardando dados
    "portal-integracao": true,
    "docs-institucionais": true,
    "docs-iml": true,
  },
};

// Definição de todos os sistemas
const allSystems: Record<string, SystemModule> = {
  // Polícia
  ocorrencias: {
    id: "ocorrencias",
    name: "Sistema de Ocorrências",
    description: "Registro e gestão de boletins",
    type: "primary",
  },
  investigacoes: {
    id: "investigacoes",
    name: "Investigações",
    description: "Acompanhamento de casos",
    type: "primary",
  },
  "registros-criminais": {
    id: "registros-criminais",
    name: "Registros Criminais",
    description: "Consulta e registro criminal",
    type: "primary",
  },

  // Hospital
  prontuario: {
    id: "prontuario",
    name: "Prontuário Eletrônico",
    description: "Histórico médico completo",
    type: "primary",
  },
  emergencia: {
    id: "emergencia",
    name: "Gestão de Emergências",
    description: "Triagem e atendimento urgente",
    type: "primary",
  },
  internacao: {
    id: "internacao",
    name: "Gestão de Internações",
    description: "Controle de leitos e UTIs",
    type: "primary",
  },

  // IML/POLITEC
  necropsia: {
    id: "necropsia",
    name: "Sistema de Necropsias",
    description: "Agendamento e execução",
    type: "primary",
  },
  "laudos-periciais": {
    id: "laudos-periciais",
    name: "Laudos Periciais",
    description: "Elaboração e emissão",
    type: "primary",
  },
  identificacao: {
    id: "identificacao",
    name: "Identificação de Corpos",
    description: "Reconhecimento e identificação",
    type: "primary",
  },
  "arquivo-amostras": {
    id: "arquivo-amostras",
    name: "Arquivo de Amostras",
    description: "Gestão de material biológico",
    type: "primary",
  },
  "analise-evidencias": {
    id: "analise-evidencias",
    name: "Análise de Evidências",
    description: "Processamento de materiais",
    type: "primary",
  },
  balistica: {
    id: "balistica",
    name: "Balística Forense",
    description: "Exames de armas e projéteis",
    type: "primary",
  },
  documentoscopia: {
    id: "documentoscopia",
    name: "Documentoscopia",
    description: "Análise de documentos",
    type: "primary",
  },
  toxicologia: {
    id: "toxicologia",
    name: "Toxicologia Forense",
    description: "Análises toxicológicas",
    type: "primary",
  },
  "dna-forense": {
    id: "dna-forense",
    name: "DNA Forense",
    description: "Análises genéticas",
    type: "primary",
  },

  // Integrações
  "solicitar-pericia": {
    id: "solicitar-pericia",
    name: "Solicitação de Perícia",
    description: "Envio de evidências para análise pericial",
    type: "integration",
  },
  "prontuario-vitimas": {
    id: "prontuario-vitimas",
    name: "Consulta Prontuário (Hospital)",
    description: "Acesso a dados de vítimas",
    type: "integration",
  },
  "notificar-iml": {
    id: "notificar-iml",
    name: "Notificação de Óbito",
    description: "Comunicar casos à POLITEC",
    type: "integration",
  },
  "solicitar-analises": {
    id: "solicitar-analises",
    name: "Análises Especializadas",
    description: "Solicitar exames técnicos e laboratoriais",
    type: "integration",
  },
  "historico-policial": {
    id: "historico-policial",
    name: "Consulta Histórico (Polícia)",
    description: "Verificar ocorrências",
    type: "integration",
  },
  "receber-corpos": {
    id: "receber-corpos",
    name: "Recebimento (Hospital/Polícia)",
    description: "Registro de entrada de corpos",
    type: "integration",
  },
  "casos-policiais": {
    id: "casos-policiais",
    name: "Casos Policiais (Polícia)",
    description: "Visualizar investigações",
    type: "integration",
  },
  "laudos-tecnicos": {
    id: "laudos-tecnicos",
    name: "Laudos Técnicos",
    description: "Receber laudos periciais e técnicos",
    type: "integration",
  },

  // Documentação e Portal de Integração
  "portal-integracao": {
    id: "portal-integracao",
    name: "Portal de Integração",
    description: "Hub de consultas entre órgãos",
    type: "documentation",
  },
  "docs-institucionais": {
    id: "docs-institucionais",
    name: "Documentação Institucional",
    description: "Manuais e procedimentos",
    type: "documentation",
  },
  "docs-policia": {
    id: "docs-policia",
    name: "Documentação - Polícia",
    description: "Protocolos específicos",
    type: "documentation",
  },
  "docs-hospital": {
    id: "docs-hospital",
    name: "Documentação - Hospital",
    description: "Protocolos específicos",
    type: "documentation",
  },
  "docs-iml": {
    id: "docs-iml",
    name: "Documentação - POLITEC",
    description: "Protocolos e procedimentos periciais",
    type: "documentation",
  },
};

// Sistemas por secretaria (ordem de exibição)
const organSystems: Record<OrganType, string[]> = {
  policia: [
    "ocorrencias",
    "investigacoes",
    "registros-criminais",
    "solicitar-pericia",
    "prontuario-vitimas",
    "laudos-tecnicos",
    "portal-integracao",
    "docs-institucionais",
    "docs-policia",
  ],
  hospital: [
    "prontuario",
    "emergencia",
    "internacao",
    "notificar-iml",
    "solicitar-analises",
    "historico-policial",
    "portal-integracao",
    "docs-institucionais",
    "docs-hospital",
  ],
  iml: [
    "necropsia",
    "laudos-periciais",
    "identificacao",
    "arquivo-amostras",
    "analise-evidencias",
    "balistica",
    "documentoscopia",
    "toxicologia",
    "dna-forense",
    "receber-corpos",
    "casos-policiais",
    "portal-integracao",
    "docs-institucionais",
    "docs-iml",
  ],
};

export default function Dashboard({
  onNavigate,
  onSelectOrgan,
  caseData,
}: DashboardProps) {
  // Dados padrão caso não tenha caso selecionado
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

  const caseStats = [
    {
      label: "Documentos do Caso",
      value: "8",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      label: "Integrações Ativas",
      value: "5",
      icon: Link2,
      color: "text-green-600",
    },
    {
      label: "Dias em Andamento",
      value: "12",
      icon: Activity,
      color: "text-orange-600",
    },
    {
      label: "Status Atual",
      value: currentCaseData.status,
      icon: Users,
      color: "text-purple-600",
    },
  ];

  // Estado para envio de dados (POLITEC)
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [sendContext, setSendContext] = useState<{
    systemId: string;
    systemName: string;
  } | null>(null);
  const [sendForm, setSendForm] = useState({ protocolo: "", descricao: "" });

  const openSendDialog = (
    systemId: string,
    systemName: string,
    e?: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (e) e.stopPropagation();
    setSendContext({ systemId, systemName });
    setSendForm({ protocolo: "", descricao: "" });
    setIsSendDialogOpen(true);
  };

  const handleSendData = () => {
    console.log("Enviar dados (POLITEC):", {
      ...sendForm,
      system: sendContext,
    });
    setIsSendDialogOpen(false);
  };

  const handleSystemClick = (systemId: string, organId: OrganType) => {
    // Se for POLITEC, sempre abrir diálogo de envio
    if (organId === "iml") {
      const system = allSystems[systemId];
      openSendDialog(systemId, system?.name || "Sistema");
      return;
    }

    const access = accessMatrix[organId][systemId];
    // Verificar se tem acesso (não pode ser false nem 'pending')
    if (access === true) {
      console.log(`Acessando sistema: ${systemId} da secretaria: ${organId}`);
      // Aqui você pode implementar a navegação para o sistema específico
      if (systemId.startsWith("docs-")) {
        onSelectOrgan(organId);
        onNavigate("docs-organ");
      }
    } else if (access === "pending") {
      console.log(`Sistema ${systemId} aguardando dados ou implementação`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Informações do Caso */}
      <div>
        <div className="mb-6">
          {/* Título e ações */}
          <div className="flex items-center justify-between">
            <h2 className="text-slate-900 text-2xl font-semibold">
              Caso:{" "}
              <span className="text-slate-800 font-medium">
                Vítima: {currentCaseData.victimName}
              </span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm font-semibold">
                {currentCaseData.priority}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate("search")}
              >
                Trocar Caso
              </Button>
            </div>
          </div>

          {/* Legenda de prioridades */}
          <div className="mt-2 flex items-center gap-6 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <span
                className="inline-block ring-1 ring-slate-300"
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: "#ef4444",
                  borderRadius: "9999px",
                  display: "inline-block",
                }}
              />
              <span>Alta = 12h</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="inline-block ring-1 ring-slate-300"
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: "#f59e0b",
                  borderRadius: "9999px",
                  display: "inline-block",
                }}
              />
              <span>Média = 72h</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="inline-block ring-1 ring-slate-300"
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: "#22c55e",
                  borderRadius: "9999px",
                  display: "inline-block",
                }}
              />
              <span>Baixa = +72h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dados Principais do Caso */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Informações do Caso
          </CardTitle>
          <CardDescription className="text-sm">
            Detalhes principais da investigação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-slate-600 text-sm">Tipo de Incidente</p>
              <p className="text-slate-900 font-medium">
                {currentCaseData.incidentType}
              </p>
            </div>
            <div>
              <p className="text-slate-600 text-sm">Data do Incidente</p>
              <p className="text-slate-900 font-medium">
                {currentCaseData.incidentDate}
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

      {/* Estatísticas do Caso */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {caseStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-slate-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      stat.color === "text-blue-600"
                        ? "bg-blue-100"
                        : stat.color === "text-green-600"
                        ? "bg-green-100"
                        : stat.color === "text-orange-600"
                        ? "bg-orange-100"
                        : "bg-purple-100"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        stat.color === "text-blue-600"
                          ? "text-blue-600"
                          : stat.color === "text-green-600"
                          ? "text-green-600"
                          : stat.color === "text-orange-600"
                          ? "text-orange-600"
                          : "text-purple-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-600 text-sm font-medium">
                      {stat.label}
                    </p>
                    <p className="text-slate-900 text-2xl font-bold mt-1">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Secretarias com Matriz de Acesso */}
      <div>
        <div className="mb-6">
          <h2 className="text-slate-900">Documentos e Integrações do Caso</h2>
          <p className="text-slate-600">
            Status dos documentos e integrações específicas para este caso
          </p>
          <div className="mt-2">
            <span className="inline-flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              Documento disponível
            </span>
            <span className="inline-flex items-center gap-2 ml-4">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400 opacity-60"></span>
              Aguardando processamento
            </span>
            <span className="inline-flex items-center gap-2 ml-4">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
              Não aplicável
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {organs.map((organ) => {
            const Icon = organ.icon;
            const systems = organSystems[organ.id];

            return (
              <Card key={organ.id} className="overflow-hidden">
                <CardHeader className={`${organ.color} text-white`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">
                        {organ.name}
                      </CardTitle>
                      <CardDescription className="text-white/80 text-sm">
                        {organ.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {/* Documentos Principais */}
                    <div>
                      <p className="text-slate-900 text-sm font-semibold mb-3">
                        Documentos Principais
                      </p>
                      <div className="space-y-2">
                        {systems
                          .filter(
                            (sysId) => allSystems[sysId]?.type === "primary"
                          )
                          .map((systemId) => {
                            const system = allSystems[systemId];
                            const access = accessMatrix[organ.id][systemId];
                            const hasAccess = access === true;
                            const isPending = access === "pending";

                            return (
                              <button
                                key={systemId}
                                onClick={() =>
                                  handleSystemClick(systemId, organ.id)
                                }
                                disabled={!hasAccess && organ.id !== "iml"}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                                  hasAccess
                                    ? "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm cursor-pointer"
                                    : organ.id === "iml"
                                    ? "border-slate-100 bg-white opacity-60 cursor-pointer hover:border-slate-200"
                                    : "border-slate-100 bg-white opacity-60"
                                }`}
                              >
                                {/* Status dot (left) */}
                                <span
                                  className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                                  style={{
                                    backgroundColor: hasAccess
                                      ? "#22c55e"
                                      : "#cbd5e1",
                                  }}
                                />
                                {/* System name and description (middle) */}
                                <div className="flex-1 text-left">
                                  <p
                                    className={`text-sm font-bold ${
                                      isPending
                                        ? "text-slate-600"
                                        : "text-slate-900"
                                    }`}
                                  >
                                    {system.name}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {isPending
                                      ? "Aguardando dados..."
                                      : system.description}
                                  </p>
                                </div>
                                {/* Icons (right) */}
                                {hasAccess && (
                                  <div className="flex items-center gap-2 ml-auto">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    {organ.id === "iml" && (
                                      <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
                                    )}
                                  </div>
                                )}
                                {!hasAccess && organ.id === "iml" && (
                                  <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0 ml-auto" />
                                )}
                              </button>
                            );
                          })}
                      </div>
                    </div>

                    {/* Solicitações e Integrações (somente POLITEC) */}
                    {organ.id === "iml" && (
                      <div>
                        <p className="text-slate-900 text-sm font-semibold mb-3 mt-4">
                          Solicitações e Integrações
                        </p>
                        <div className="space-y-2">
                          {systems
                            .filter(
                              (sysId) =>
                                allSystems[sysId]?.type === "integration"
                            )
                            .map((systemId) => {
                              const system = allSystems[systemId];
                              const access = accessMatrix[organ.id][systemId];
                              const hasAccess = access === true;
                              const isPending = access === "pending";

                              return (
                                <button
                                  key={systemId}
                                  onClick={() =>
                                    handleSystemClick(systemId, organ.id)
                                  }
                                  disabled={!hasAccess && organ.id !== "iml"}
                                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                                    hasAccess
                                      ? "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm cursor-pointer"
                                      : isPending
                                      ? "border-slate-200 bg-slate-50 cursor-not-allowed opacity-70"
                                      : "border-slate-100 bg-slate-50 cursor-not-allowed opacity-60"
                                  }`}
                                >
                                  <div
                                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                                      hasAccess
                                        ? "bg-green-500"
                                        : isPending
                                        ? "bg-orange-400 opacity-60"
                                        : "bg-slate-300"
                                    }`}
                                  ></div>
                                  <div className="flex-1 text-left">
                                    <p
                                      className={`text-sm ${
                                        isPending
                                          ? "text-slate-600"
                                          : "text-slate-900"
                                      }`}
                                    >
                                      {system.name}
                                    </p>
                                    <p
                                      className={`text-xs ${
                                        isPending
                                          ? "text-slate-500"
                                          : "text-slate-500"
                                      }`}
                                    >
                                      {isPending
                                        ? "Aguardando dados..."
                                        : system.description}
                                    </p>
                                  </div>
                                  {hasAccess && (
                                    <Link2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                  )}
                                  {isPending && (
                                    <div className="w-4 h-4 flex-shrink-0 opacity-40">
                                      <div className="animate-pulse bg-orange-400 rounded-full w-full h-full"></div>
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    )}

                    {/* Recursos Adicionais */}
                    <div>
                      <p className="text-slate-900 text-sm font-semibold mb-3 mt-4">
                        Recursos e Documentação
                      </p>
                      <div className="space-y-2">
                        {systems
                          .filter(
                            (sysId) =>
                              allSystems[sysId]?.type === "documentation"
                          )
                          .map((systemId) => {
                            const system = allSystems[systemId];
                            const access = accessMatrix[organ.id][systemId];
                            const hasAccess = access === true;
                            const isPending = access === "pending";

                            return (
                              <button
                                key={systemId}
                                onClick={() =>
                                  handleSystemClick(systemId, organ.id)
                                }
                                disabled={!hasAccess && organ.id !== "iml"}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                                  hasAccess
                                    ? "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm cursor-pointer"
                                    : isPending
                                    ? "border-slate-200 bg-slate-50 cursor-not-allowed opacity-70"
                                    : "border-slate-100 bg-slate-50 cursor-not-allowed opacity-60"
                                }`}
                              >
                                <div
                                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                                    hasAccess
                                      ? "bg-green-500"
                                      : isPending
                                      ? "bg-orange-400 opacity-60"
                                      : "bg-slate-300"
                                  }`}
                                ></div>
                                <div className="flex-1 text-left">
                                  <p
                                    className={`text-sm ${
                                      isPending
                                        ? "text-slate-600"
                                        : "text-slate-900"
                                    }`}
                                  >
                                    {system.name}
                                  </p>
                                  <p
                                    className={`text-xs ${
                                      isPending
                                        ? "text-slate-500"
                                        : "text-slate-500"
                                    }`}
                                  >
                                    {isPending
                                      ? "Aguardando dados..."
                                      : system.description}
                                  </p>
                                </div>
                                {hasAccess && (
                                  <FileText className="w-4 h-4 text-purple-500 flex-shrink-0" />
                                )}
                                {isPending && (
                                  <div className="w-4 h-4 flex-shrink-0 opacity-40">
                                    <div className="animate-pulse bg-orange-400 rounded-full w-full h-full"></div>
                                  </div>
                                )}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Ações do Caso */}
      {/* Dialogo Enviar Dados (POLITEC) */}
      <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Enviar Dados {sendContext ? `- ${sendContext.systemName}` : ""}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações para enviar dados referentes à POLITEC.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="protocolo">Protocolo</Label>
              <Input
                id="protocolo"
                value={sendForm.protocolo}
                onChange={(e) =>
                  setSendForm({ ...sendForm, protocolo: e.target.value })
                }
                placeholder="Ex: POL-2025-000123"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                rows={4}
                value={sendForm.descricao}
                onChange={(e) =>
                  setSendForm({ ...sendForm, descricao: e.target.value })
                }
                placeholder="Descreva os dados enviados (amostras, laudos, observações)"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="arquivo">Anexo (opcional)</Label>
              <Input id="arquivo" type="file" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsSendDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSendData}>Enviar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Ações do Caso</CardTitle>
          <CardDescription>
            Ações específicas para este caso de investigação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex-col"
              onClick={() => onNavigate("docs-general")}
            >
              <FileText className="w-6 h-6 mb-2 text-slate-600" />
              <span>Relatório do Caso</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col"
              onClick={() => onNavigate("tickets")}
            >
              <Link2 className="w-6 h-6 mb-2 text-slate-600" />
              <span>Solicitações Pendentes</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col"
              onClick={() => onNavigate("timeline")}
            >
              <Link2 className="w-6 h-6 mb-2 text-slate-600" />
              <span>Timeline do Caso</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
