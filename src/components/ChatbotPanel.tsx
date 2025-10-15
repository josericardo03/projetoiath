import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Minimize2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { organs, type OrganType } from "../App";

interface ChatbotPanelProps {
  organ: OrganType;
  onClose: () => void;
}

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: string;
}

const chatbotKnowledge: Record<OrganType, any> = {
  policia: {
    name: "Bot Polícia",
    greeting:
      "Olá! Sou o assistente virtual da Polícia. Como posso ajudá-lo hoje?",
    responses: {
      bo: 'Para registrar um Boletim de Ocorrência, acesse o menu "Boletim de Ocorrência" no sistema. Você precisará fornecer: local, data, hora, descrição dos fatos e dados das partes envolvidas.',
      pericia:
        'Para solicitar uma perícia, vá em "Investigações", selecione o caso e clique em "Solicitar Perícia". Especifique o tipo de análise necessária e preencha os detalhes.',
      laudo:
        "Laudos solicitados podem ser acompanhados em tempo real no sistema. O prazo médio é de 3 a 7 dias úteis dependendo da complexidade.",
      integração:
        "Nossa integração permite compartilhar informações com Hospital (vítimas) e POLITEC (perícias e necropsias).",
    },
  },
  hospital: {
    name: "Bot Hospital",
    greeting:
      "Olá! Sou o assistente virtual do Hospital. Em que posso auxiliar?",
    responses: {
      emergencia:
        "Para registrar uma emergência, utilize o módulo de Triagem. Classifique o risco (vermelho, amarelo, verde) e registre os dados do paciente imediatamente.",
      prontuario:
        "O prontuário eletrônico está disponível no menu principal. Você pode consultar histórico, adicionar observações e solicitar exames.",
      iml: 'Notifique a POLITEC em casos de morte suspeita, violenta ou sem causa aparente. Use o formulário de "Notificação de Óbito" no sistema.',
      politec:
        'Notifique a POLITEC em casos de morte suspeita, violenta ou sem causa aparente. Use o formulário de "Notificação de Óbito" no sistema.',
      transferencia:
        'Para transferir pacientes, acesse "Gestão de Leitos" e selecione "Solicitar Transferência". Preencha os dados clínicos necessários.',
    },
  },
  iml: {
    name: "Bot POLITEC",
    greeting: "Olá! Sou o assistente virtual da POLITEC. Como posso ajudá-lo?",
    responses: {
      necropsia:
        "Necropsias são agendadas automaticamente quando há notificação do Hospital ou Polícia. O prazo médio é de 24-48 horas.",
      laudo:
        "Laudos periciais são elaborados após a necropsia ou análise técnica e revisão. Geralmente ficam prontos em 5-7 dias úteis. Casos urgentes podem ser priorizados.",
      identificacao:
        "Para casos de identificação, utilizamos dados fornecidos pela Polícia, análise de digitais e, quando necessário, DNA.",
      amostras:
        "Amostras biológicas são armazenadas por no mínimo 20 anos conforme legislação. Material pode ser utilizado para análises complementares quando necessário.",
      evidencia:
        "Para solicitar análise de evidências, a Polícia deve criar uma solicitação no sistema com fotos e descrição detalhada do material.",
      balistica:
        "Exames balísticos levam de 7 a 10 dias úteis. Incluem análise de armas, projéteis e comparação com banco de dados.",
      toxicologia:
        "Análises toxicológicas podem ser solicitadas por Hospital ou Polícia. O prazo varia de 5 a 15 dias dependendo da complexidade.",
      rastreamento:
        "Use o número do protocolo para rastrear análises em tempo real. Você receberá notificações a cada etapa do processo.",
      pericia:
        "Realizamos perícias médico-legais, análise de evidências, balística, documentoscopia, DNA e toxicologia. Solicite através do sistema de investigações.",
    },
  },
};

export default function ChatbotPanel({ organ, onClose }: ChatbotPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentOrgan = organs.find((o) => o.id === organ);
  const Icon = currentOrgan?.icon || Bot;
  const knowledge = chatbotKnowledge[organ];

  useEffect(() => {
    // Initial greeting
    setMessages([
      {
        id: "1",
        type: "bot",
        content: knowledge.greeting,
        timestamp: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  }, [organ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Check for keywords in user message
    for (const [key, response] of Object.entries(knowledge.responses)) {
      if (lowerMessage.includes(key)) {
        return response as string;
      }
    }

    // Check for common queries
    if (lowerMessage.includes("horário") || lowerMessage.includes("horario")) {
      return "O horário de funcionamento é de segunda a sexta, das 8h às 18h. Para emergências, temos plantão 24 horas.";
    }

    if (lowerMessage.includes("ticket") || lowerMessage.includes("suporte")) {
      return 'Você pode abrir um ticket de suporte através do menu "Tickets" no sistema. Selecione a categoria apropriada e descreva sua solicitação.';
    }

    if (
      lowerMessage.includes("documentação") ||
      lowerMessage.includes("documentacao") ||
      lowerMessage.includes("manual")
    ) {
      return 'A documentação completa está disponível no menu "Documentação". Lá você encontra guias, tutoriais e FAQs específicos.';
    }

    if (lowerMessage.includes("ajuda") || lowerMessage.includes("help")) {
      return `Posso ajudá-lo com:\n- Informações sobre processos e procedimentos\n- Como usar o sistema\n- Integração com outras secretarias\n- Abrir tickets de suporte\n\nQual dessas opções você gostaria de saber mais?`;
    }

    // Default response
    return "Desculpe, não entendi sua pergunta. Você pode reformular ou acessar a documentação para mais informações? Também posso ajudá-lo a abrir um ticket de suporte se preferir.";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate bot response delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: generateBotResponse(inputValue),
        timestamp: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className={`${currentOrgan?.color} rounded-full shadow-lg hover:shadow-xl transition-shadow`}
          onClick={() => setIsMinimized(false)}
        >
          <Icon className="w-6 h-6 text-white mr-2" />
          <span className="text-white">{knowledge.name}</span>
          {messages.length > 1 && (
            <Badge variant="secondary" className="ml-2 bg-white text-slate-900">
              {messages.length - 1}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-slate-200 flex flex-col z-50">
      {/* Header */}
      <div
        className={`${currentOrgan?.color} p-4 rounded-t-lg flex items-center justify-between`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white">{knowledge.name}</h3>
            <p className="text-white/80 text-xs">Online</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="text-white hover:bg-white/20 h-8 w-8"
            onClick={() => setIsMinimized(true)}
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-white hover:bg-white/20 h-8 w-8"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-2 max-w-[80%] ${
                  message.type === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === "user"
                      ? "bg-blue-500"
                      : currentOrgan?.color
                  }`}
                >
                  {message.type === "user" ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Icon className="w-4 h-4 text-white" />
                  )}
                </div>
                <div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.type === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 text-slate-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                  <p
                    className={`text-xs text-slate-500 mt-1 ${
                      message.type === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-slate-200">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => setInputValue("Como abrir um ticket?")}
          >
            Abrir Ticket
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => setInputValue("Ver documentação")}
          >
            Documentação
          </Button>
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex gap-2">
          <Input
            placeholder="Digite sua mensagem..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
