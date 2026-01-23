PRD — HydraTrack

Product Requirements Document

Produto: HydraTrack
Versão: 1.1.1
Status: Em Desenvolvimento (Funcional)
Plataformas: Web + Desktop (Windows via Electron)
Tipo: Aplicação Local-First, Offline-First, Social P2P
Público-alvo: Usuários desktop e web que desejam melhorar hábitos de hidratação de forma motivacional

1. Visão do Produto

O HydraTrack é um ecossistema de saúde focado exclusivamente em hidratação, projetado para funcionar de forma local, privada e contínua, sem dependência de backend ou autenticação.

O produto se diferencia ao combinar três camadas complementares:

Camada Funcional (Saúde):
Monitoramento técnico da ingestão de água, com metas personalizadas baseadas em peso corporal e nível de atividade.

Camada Emocional (Companheiros Virtuais):
Personagens interativos (pets) que refletem o progresso do usuário, criando vínculo emocional e reforço positivo.

Camada Social (P2P):
Interação direta entre usuários via conexão Peer-to-Peer (PeerJS), permitindo acompanhamento mútuo em tempo real sem servidores centrais.

O HydraTrack deve ser leve, não intrusivo, motivador e respeitar a privacidade do usuário.

2. Objetivos do Produto

Incentivar o hábito diário de hidratação

Reduzir esquecimentos durante longos períodos de foco

Aumentar retenção através de gamificação e vínculo emocional

Permitir motivação coletiva sem comprometer privacidade

Funcionar integralmente offline (exceto recursos sociais)

3. Personas e Necessidades
3.1 O Profissional Focado

Trabalha longas horas no computador

Esquece de beber água

Precisa de lembretes nativos, discretos e configuráveis

Prioriza produtividade e baixo atrito

3.2 O Usuário Gamer / Casual

É altamente motivado por progresso visual

Valoriza recompensas, streaks e conquistas

Cria vínculo com personagens

Espera feedback visual claro e imediato

3.3 O Amigo Motivador

Busca consistência em grupo

Gosta de acompanhar progresso alheio em tempo real

Valoriza comparação saudável, não competição agressiva

Preza por privacidade e controle de conexões

4. Escopo do Produto
4.1 Dentro do Escopo

Monitoramento diário de hidratação

Metas personalizadas

Sistema de lembretes inteligentes

Gamificação avançada

Pets interativos

Conexões sociais via P2P

Persistência local (localStorage)

Web + Desktop com código compartilhado

4.2 Fora do Escopo (Versão Atual)

Login/autenticação

Backend ou banco de dados remoto

Sincronização em nuvem

Monetização

Integrações com wearables

Aplicativo mobile nativo

5. Requisitos Funcionais (Detalhados)
RF01 — Onboarding e Perfil Inteligente

Descrição:
O sistema deve guiar o usuário no primeiro acesso, coletando informações essenciais para personalização da experiência.

Funcionalidades:

Entrada de peso corporal

Seleção de nível de atividade (Sedentário, Moderado, Ativo)

Cálculo automático da meta diária:

Meta (ml) = Peso (kg) × Multiplicador de Atividade


Escolha de avatar inicial:

Copo

Axolote

Sapo

Octopus

Solicitação obrigatória de permissões:

Áudio

Notificações

Critério de aceite:

Usuário conclui onboarding em até 2 minutos

Meta diária é exibida ao final do processo

RF02 — Gestão de Consumo de Água

Descrição:
Permitir registro rápido, preciso e flexível da ingestão diária.

Funcionalidades:

Botões de entrada rápida dinâmicos:

O sistema aprende volumes mais usados

Entrada manual personalizada (ml)

Registro imediato no progresso diário

Histórico navegável por calendário

Edição e exclusão de registros passados

Critério de aceite:

Registro feito com no máximo 1 clique

Alterações refletem instantaneamente no progresso

RF03 — Sistema Social Peer-to-Peer

Descrição:
Permitir interação social sem centralização de dados.

Funcionalidades:

Conexão direta via PeerID (código de convite)

Timeline compartilhada em tempo real

Visualização de eventos de hidratação de amigos

Lobby público:

Lista usuários disponíveis para conexão

Consome API externa apenas para descoberta

Regras:

Nenhum dado de consumo é armazenado em servidores

Conexão é explicitamente autorizada pelo usuário

RF04 — Gamificação e Retenção

Descrição:
Reforçar hábitos através de recompensas visuais e progressão.

Funcionalidades:

Sistema de conquistas:

+60 medalhas

Tiers: Bronze, Prata, Ouro, Esmeralda, Especial

Estados do personagem:

Triste

Cansado

Feliz

Meta Batida

Sistema de Streak (ofensiva diária)

Feedback visual imediato ao registrar consumo

RF05 — Lembretes e Notificações

Descrição:
Sistema inteligente de lembretes não intrusivos.

Funcionalidades:

Lembretes condicionais:

Só disparam se usuário estiver abaixo da meta

Intervalo configurável (ex: 60, 90, 120 min)

Sons personalizáveis:

8 opções

Controle de volume separado:

Alertas pessoais

Notificações sociais

6. Requisitos Não Funcionais
RNF01 — Arquitetura e Performance

Código único para Web e Desktop

Escrita em Vanilla JavaScript (ES6+)

Programação Orientada a Objetos

Carregamento < 1s em Desktop

Funcionamento offline total (exceto social)

RNF02 — Persistência e Confiabilidade

Uso exclusivo de localStorage

Salvamento imediato após interação

Verificação de versão do app ao iniciar

Estratégia de migração de dados entre versões

RNF03 — UI / UX

Estilo visual: Glassmorphism

Temas:

Claro

Escuro

Automático (sistema)

Animações leves e intencionais

Partículas visuais ao registrar água

7. Fluxo de Dados e Segurança

Comunicação social exclusivamente P2P

Nenhum dado sensível sai do dispositivo

O HydraTrack não mantém logs externos

Usuário controla todas as conexões sociais

Encerramento de sessão P2P é manual

8. Critérios de Sucesso e Métricas
Métricas Primárias

Média de dias de streak por usuário

Quantidade de registros diários

Conquistas desbloqueadas

Métricas Técnicas

Tempo de carregamento

Consumo de memória

Estabilidade do localStorage

9. Diretrizes para IA (Obrigatório)

A IA deve:

Seguir estritamente este PRD

Não introduzir funcionalidades fora de escopo

Priorizar simplicidade e clareza

Evitar dependências externas

Propor mudanças incrementais

Justificar decisões técnicas quando necessário

10. Roadmap de Evolução
v1.2

Gráficos mensais (barras)

Análise de tendência

v1.3

Exportação de dados (CSV / JSON)

Backup manual

v2.0

Duelos de Hidratação

Ranking semanal P2P