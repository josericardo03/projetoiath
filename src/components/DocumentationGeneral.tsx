import { Book, Search, Download, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { organs } from "../App";
import { useState } from "react";

interface DocumentationGeneralProps {
  onNavigate: (
    view: "dashboard" | "docs-general" | "docs-organ" | "tickets"
  ) => void;
}

export default function DocumentationGeneral({
  onNavigate,
}: DocumentationGeneralProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const sections = [
    {
      title: "Visão Geral do Sistema",
      description: "Arquitetura e objetivos do sistema integrado",
      content: `Este sistema foi desenvolvido para integrar as operações de três secretarias essenciais: Polícia Civil, Hospital Regional e POLITEC (Perícia Técnica Científica). O objetivo principal é facilitar o compartilhamento de informações, agilizar processos e melhorar a coordenação entre os órgãos.`,
      tags: ["arquitetura", "integração", "visão geral"],
    },
    {
      title: "Fluxos de Integração",
      description: "Como as informações transitam entre as secretarias",
      content: `As integrações seguem protocolos de segurança rigorosos. Cada transferência de dados é registrada e auditável. Os principais fluxos incluem: transferência de pacientes, solicitações de perícia, compartilhamento de laudos técnicos e boletins de ocorrência.`,
      tags: ["fluxo", "dados", "transferência"],
    },
    {
      title: "Segurança e Privacidade",
      description: "Proteção de dados e conformidade",
      content: `Todos os dados são criptografados em trânsito e em repouso. O sistema está em conformidade com a LGPD e implementa controles de acesso baseados em função (RBAC). Logs de auditoria são mantidos por 7 anos.`,
      tags: ["segurança", "LGPD", "privacidade"],
    },
    {
      title: "Sistema de Tickets",
      description: "Gerenciamento de solicitações e suporte",
      content: `O sistema de tickets permite que qualquer secretaria solicite informações, suporte técnico ou ações de outras secretarias. Tickets são categorizados por prioridade e tipo, com SLAs definidos para cada categoria.`,
      tags: ["tickets", "suporte", "solicitações"],
    },
    {
      title: "Chatbots Inteligentes",
      description: "Assistentes virtuais por secretaria",
      content: `Cada secretaria possui seu próprio chatbot treinado com informações específicas. Os chatbots podem responder perguntas frequentes, auxiliar na navegação do sistema e criar tickets automaticamente.`,
      tags: ["chatbot", "IA", "assistente"],
    },
    {
      title: "APIs e Webhooks",
      description: "Integração programática",
      content: `O sistema disponibiliza APIs RESTful para integração com sistemas legados. Webhooks podem ser configurados para notificações em tempo real de eventos importantes.`,
      tags: ["API", "webhook", "integração"],
    },
  ];

  const quickLinks = [
    { title: "API Reference", icon: ExternalLink, url: "#" },
    { title: "Manual do Usuário", icon: Download, url: "#" },
    { title: "Guia de Início Rápido", icon: Book, url: "#" },
    { title: "Políticas de Segurança", icon: ExternalLink, url: "#" },
  ];

  const filteredSections = sections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900">Documentação Geral</h1>
          <p className="text-slate-600">
            Guias e informações sobre o sistema integrado
          </p>
        </div>
        <Button variant="outline" onClick={() => onNavigate("dashboard")}>
          Voltar ao Dashboard
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <Input
          placeholder="Buscar na documentação..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="integration">Integração</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="support">Suporte</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Card
                  key={index}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-blue-600" />
                      <span className="text-slate-900 text-sm">
                        {link.title}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Documentation Sections */}
          <div className="space-y-4">
            {filteredSections.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-700">{section.content}</p>
                  <div className="flex flex-wrap gap-2">
                    {section.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4 mt-6">
          {filteredSections
            .filter(
              (s) =>
                s.tags.includes("integração") ||
                s.tags.includes("fluxo") ||
                s.tags.includes("API")
            )
            .map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-700">{section.content}</p>
                  <div className="flex flex-wrap gap-2">
                    {section.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-6">
          {filteredSections
            .filter(
              (s) =>
                s.tags.includes("segurança") ||
                s.tags.includes("privacidade") ||
                s.tags.includes("LGPD")
            )
            .map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-700">{section.content}</p>
                  <div className="flex flex-wrap gap-2">
                    {section.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="support" className="space-y-4 mt-6">
          {filteredSections
            .filter(
              (s) =>
                s.tags.includes("suporte") ||
                s.tags.includes("tickets") ||
                s.tags.includes("chatbot")
            )
            .map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-700">{section.content}</p>
                  <div className="flex flex-wrap gap-2">
                    {section.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>

      {/* Organ Documentation Links */}
      <Card>
        <CardHeader>
          <CardTitle>Documentação por Secretaria</CardTitle>
          <CardDescription>
            Acesse a documentação específica de cada órgão
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {organs.map((organ) => {
              const Icon = organ.icon;
              return (
                <Button
                  key={organ.id}
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => onNavigate("docs-organ")}
                >
                  <div
                    className={`${organ.color} w-10 h-10 rounded-lg flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span>{organ.name}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
