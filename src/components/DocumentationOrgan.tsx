import {
  ArrowLeft,
  Book,
  FileText,
  Settings,
  Users,
  Database,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { organs, type OrganType } from "../App";

interface DocumentationOrganProps {
  organ: OrganType | null;
  onNavigate: (
    view: "dashboard" | "docs-general" | "docs-organ" | "tickets"
  ) => void;
  onSelectOrgan: (organ: OrganType) => void;
}

const organDocs: Record<OrganType, any> = {
  policia: {
    overview:
      "Sistema de gerenciamento de ocorrências policiais, boletins e investigações. Integrado com POLITEC para agilizar perícias e laudos técnicos.",
    modules: [
      {
        name: "Boletim de Ocorrência",
        description: "Registro e acompanhamento de ocorrências",
      },
      {
        name: "Investigações",
        description: "Gerenciamento de casos em andamento",
      },
      {
        name: "Solicitações de Perícia",
        description: "Integração com POLITEC",
      },
      {
        name: "Registros Criminais",
        description: "Consulta e atualização de registros via API",
      },
    ],
    integrations: [
      { system: "POLITEC", type: "Solicitação de perícias e laudos" },
      { system: "Hospital Regional", type: "Atendimento de vítimas" },
    ],
    faqs: [
      {
        q: "Como registrar um boletim de ocorrência?",
        a: "Acesse o módulo de BO, preencha o formulário com todas as informações necessárias e submeta para validação.",
      },
      {
        q: "Como solicitar uma perícia?",
        a: 'No sistema de investigações, selecione o caso e clique em "Solicitar Perícia". Especifique o tipo de análise necessária e preencha os detalhes.',
      },
      {
        q: "Qual o prazo para receber laudos?",
        a: "Laudos periciais levam de 3 a 7 dias úteis dependendo do tipo de análise e complexidade do caso.",
      },
    ],
  },
  hospital: {
    overview:
      "Sistema hospitalar integrado para gerenciamento de pacientes, atendimentos de emergência e transferências. Conectado à POLITEC para casos de óbito e perícias, e à Polícia para vítimas de crimes.",
    modules: [
      {
        name: "Prontuário Eletrônico",
        description: "Registro completo do histórico do paciente",
      },
      { name: "Emergência", description: "Triagem e atendimento de urgências" },
      { name: "Internação", description: "Gerenciamento de leitos e UTI" },
      {
        name: "Transferências",
        description: "Coordenação com outros hospitais",
      },
    ],
    integrations: [
      { system: "POLITEC", type: "Notificação de óbitos e análises" },
      { system: "Polícia Civil", type: "Comunicação de casos criminais" },
    ],
    faqs: [
      {
        q: "Como registrar entrada de emergência?",
        a: "Utilize o módulo de Emergência, faça a triagem com classificação de risco e registre no sistema imediatamente.",
      },
      {
        q: "Quando notificar a POLITEC?",
        a: "Em casos de morte suspeita, violenta ou sem causa aparente. A notificação deve ser feita em até 2 horas.",
      },
      {
        q: "Como solicitar análise toxicológica?",
        a: 'Pelo prontuário do paciente, acesse "Exames Especiais" e selecione "Análise Toxicológica".',
      },
    ],
  },
  iml: {
    overview:
      "Perícia Técnica Científica responsável por necropsias, exames cadavéricos, laudos periciais e análises forenses especializadas. Principal interface entre Polícia, Hospital e sistema de justiça.",
    modules: [
      {
        name: "Necropsias",
        description: "Agenda e execução de exames cadavéricos",
      },
      {
        name: "Laudos Periciais",
        description: "Elaboração e emissão de laudos médico-legais",
      },
      {
        name: "Identificação",
        description: "Identificação de corpos e vítimas",
      },
      {
        name: "Arquivo de Amostras",
        description: "Gestão de material biológico e evidências",
      },
      {
        name: "Análise de Evidências",
        description: "Processamento de materiais coletados",
      },
      {
        name: "Balística Forense",
        description: "Exames de armas e projéteis",
      },
      {
        name: "Documentoscopia",
        description: "Análise de documentos e grafotecnia",
      },
      {
        name: "DNA e Toxicologia",
        description: "Exames laboratoriais especializados",
      },
    ],
    integrations: [
      {
        system: "Polícia Civil",
        type: "Recebimento de solicitações e envio de laudos",
      },
      {
        system: "Hospital Regional",
        type: "Recebimento de corpos, transferências e análises",
      },
    ],
    faqs: [
      {
        q: "Qual o fluxo para recebimento de corpos?",
        a: "Hospital ou Polícia registra no sistema, POLITEC recebe notificação, agenda a necropsia e atualiza o status.",
      },
      {
        q: "Como emitir um laudo pericial?",
        a: "Após conclusão do exame (necropsia ou análise técnica), preencha o formulário padronizado no sistema e submeta para revisão.",
      },
      {
        q: "Quanto tempo ficam armazenadas as amostras?",
        a: "Amostras são mantidas por no mínimo 20 anos conforme legislação vigente.",
      },
      {
        q: "Como solicitar análise de evidências?",
        a: "A Polícia deve registrar a solicitação no sistema, especificando o tipo de análise necessária e anexando fotos.",
      },
      {
        q: "Qual o prazo para laudos balísticos?",
        a: "Laudos de balística levam em média 7-10 dias úteis, podendo ser priorizados em casos urgentes.",
      },
      {
        q: "Como rastrear uma análise em andamento?",
        a: "Utilize o número do protocolo no sistema para acompanhar o status em tempo real.",
      },
    ],
  },
};

export default function DocumentationOrgan({
  organ,
  onNavigate,
  onSelectOrgan,
}: DocumentationOrganProps) {
  const currentOrgan = organ ? organs.find((o) => o.id === organ) : organs[0];
  const docs = organ ? organDocs[organ] : organDocs.policia;
  const Icon = currentOrgan?.icon || Book;

  if (!organ) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-slate-900">Selecione uma Secretaria</h1>
          <Button variant="outline" onClick={() => onNavigate("docs-general")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {organs.map((org) => {
            const OrgIcon = org.icon;
            return (
              <Card
                key={org.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onSelectOrgan(org.id)}
              >
                <CardHeader>
                  <div
                    className={`${org.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}
                  >
                    <OrgIcon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>{org.name}</CardTitle>
                  <CardDescription>{org.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`${currentOrgan?.color} w-14 h-14 rounded-lg flex items-center justify-center`}
          >
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-slate-900">
              Documentação - {currentOrgan?.name}
            </h1>
            <p className="text-slate-600">{currentOrgan?.description}</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => onNavigate("docs-general")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            Visão Geral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700">{docs.overview}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="modules" className="w-full">
        <TabsList>
          <TabsTrigger value="modules">Módulos</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>

        {/* Modules Tab */}
        <TabsContent value="modules" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docs.modules.map((module: any, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 w-10 h-10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{module.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm">{module.description}</p>
                  <Button variant="link" className="px-0 mt-2" size="sm">
                    Ver documentação completa →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Sistemas Integrados
              </CardTitle>
              <CardDescription>
                Conexões e fluxos de dados com outras secretarias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {docs.integrations.map((integration: any, index: number) => {
                  const intOrgan = organs.find(
                    (o) => o.name === integration.system
                  );
                  const IntIcon = intOrgan?.icon || Database;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`${
                            intOrgan?.color || "bg-slate-500"
                          } w-10 h-10 rounded-lg flex items-center justify-center`}
                        >
                          <IntIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-slate-900">{integration.system}</p>
                          <p className="text-slate-600 text-sm">
                            {integration.type}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">Ativo</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Perguntas Frequentes</CardTitle>
              <CardDescription>
                Respostas para dúvidas comuns sobre o sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {docs.faqs.map((faq: any, index: number) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{faq.q}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-slate-700">{faq.a}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button variant="outline" className="justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Configurações do Sistema
            </Button>
            <Button variant="outline" className="justify-start">
              <Users className="w-4 h-4 mr-2" />
              Gerenciar Usuários
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => onNavigate("tickets")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Abrir Ticket de Suporte
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
