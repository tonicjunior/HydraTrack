# 💧 HydraTrack - Lembrete de Hidratação

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## ✨ Visão Geral

**HydraTrack** é uma aplicação web moderna e interativa criada para ajudar você a monitorar sua ingestão diária de água de forma inteligente e motivadora. Desenvolvido com **HTML, CSS e JavaScript puros**, o projeto utiliza Programação Orientada a Objetos (POO) para ser extremamente leve, responsivo e funcional em qualquer navegador moderno, sem a necessidade de dependências externas.

Desde um onboarding personalizado que calcula sua meta diária até um dashboard completo com gamificação e notificações inteligentes, o HydraTrack transforma a tarefa de se manter hidratado em uma experiência agradável e divertida.

---

## 📚 Índice

- [🚀 Funcionalidades Principais](#-funcionalidades-principais)
- [🧠 Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [📂 Estrutura do Projeto](#-estrutura-do-projeto)
- [🎯 Começando](#-começando)
- [⚙️ Personalização](#️-personalização)
- [📢 Permissões e Notificações](#-permissões-e-notificações)
- [📜 Licença](#-licença)

---

## 🚀 Funcionalidades Principais

- 📱 **Interface Moderna e Responsiva**: Design limpo e adaptável para desktops e dispositivos móveis.
- 🧠 **Onboarding Inteligente**: Um passo a passo que calcula sua meta de hidratação personalizada com base em peso e nível de atividade.
- 📊 **Dashboard Completo**: Visualize seu progresso com um copo d'água animado, estatísticas de consumo, meta restante e registros do dia.
- 🏆 **Sistema de Gamificação**: Desbloqueie mais de 50 conquistas (Bronze, Prata e Ouro) ao atingir marcos de hidratação, formando hábitos de maneira divertida.
- 🔔 **Notificações Inteligentes e Personalizáveis**:
  - Lembretes nativos do navegador para beber água em intervalos configuráveis.
  - Alertas sonoros com **múltiplas opções de som** e controle de volume.
  - Modal interativa para confirmar a hidratação e silenciar o alerta.
- 🌗 **Tema Claro e Escuro**: Detecção automática baseada no sistema ou troca manual.
- 📈 **Progresso Semanal**: Gráfico visual para acompanhar sua consistência ao longo da semana.
- 🎉 **Animações e Feedback Visual**: Celebração ao atingir a meta diária e efeitos de partículas ao registrar o consumo.
- 🔧 **Configurações Flexíveis**: Ajuste seu perfil, meta de hidratação, som e intervalo das notificações a qualquer momento.
- 💰 **Apoie o Projeto**: Link de doação para quem quiser apoiar o desenvolvimento contínuo.

---

## 🧠 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível.
- **CSS3**: Estilização moderna e responsiva.
  - **Variáveis CSS**: Para um sistema de temas (claro/escuro) flexível.
  - **Flexbox & Grid Layout**: Para a construção de layouts complexos.
  - **Animações (`@keyframes`) e Transições**: Para uma experiência de usuário fluida.
- **JavaScript (ES6+)**: Lógica completa da aplicação, sem frameworks.
  - **Programação Orientada a Objetos (POO)**: Código modularizado na classe `HydraTrack` para melhor organização, manutenção e escalabilidade.
  - **`localStorage`**: Para salvar dados do usuário, configurações e conquistas, persistindo a sessão no navegador.
  - **DOM API**: Manipulação dinâmica da interface.
  - **Web Notifications API**: Para a criação de lembretes nativos.

---

## 📂 Estrutura do Projeto
O projeto está organizado para separar claramente a estrutura (HTML), o estilo (CSS), a lógica (JS) e os recursos (assets).


## 📂 Estrutura do Projeto
 ```
├── 📄 index.html         # Estrutura principal do app
├── 🎨 style.css          # Estilo visual e animações 
├── ⚙️ script.js          # Lógica da aplicação (Classe HydraTrack) 
├── 📁 assets/
│   ├── 📁 sounds/ 
│   │   ├── 🔊 agua.mp3 
│   │   ├── 🔊 bell.mp3 
│   │   └── ... (e outros arquivos de som) 
│   └── 📁 images/ 
│       ├── 🖼️ 250.png 
│       ├── 🖼️ 500.png 
│       └── ... (e outras imagens) 
└── 📄 README.md 

 ```

---

## 🎯 Começando

Para executar este projeto localmente, siga os passos abaixo.

1.  **Clone o repositório:**
   ```bash
   git clone https://github.com/tonicjunior/HydraTrack.git
   ```

2.  **Navegue até a pasta do projeto:**
   ```bash
   cd HydraTrack
   ```

3.  **Abra o arquivo `index.html`:**
   Basta abrir o arquivo `index.html` diretamente no seu navegador de preferência (Chrome, Firefox, Edge, etc.).

4.  **Siga o Onboarding:**
   Preencha as informações iniciais para que o aplicativo calcule sua meta e configure seu perfil.

Pronto! Agora é só começar a registrar seu consumo e se manter hidratado 💦

---

## ⚙️ Personalização

O código foi escrito de forma clara para facilitar customizações diretamente no arquivo `script.js`, dentro do `constructor` da classe `HydraTrack`:

-   **Valores dos Botões Rápidos**: Altere o array `quickAmounts` na definição do objeto `this.user` ao final do onboarding.
-   **Sons de Notificação**: Adicione ou altere os objetos no array `this.sounds`.
-   **Intervalo das Notificações**: Modifique o valor da variável `this.notificationIntervalMinutes`.
-   **Aparência e Cores**: Todos os estilos, incluindo as cores dos temas claro e escuro, estão centralizados no arquivo `style.css` através de variáveis CSS.

---

## 📢 Permissões e Notificações

Para que os lembretes funcionem, o aplicativo precisa da sua permissão.

-   **Permissão do Navegador**: Na primeira vez, o navegador solicitará permissão para exibir notificações. É crucial que você **aceite**.
-   **Problemas com Notificações?**: Se os alertas de áudio funcionam, mas os de texto não aparecem, verifique as configurações do seu sistema operacional (como o "Assistente de Foco" no Windows) e as permissões de notificação do seu navegador.

---

## 📜 Licença

Este projeto é de código aberto e está licenciado sob a [Licença MIT](https://opensource.org/licenses/MIT). Sinta-se à vontade para usar, modificar e distribuir.
