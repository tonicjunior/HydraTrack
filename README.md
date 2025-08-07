# 💧 HydraTrack - Lembrete de Hidratação

## ✨ Visão Geral

**HydraTrack** é uma aplicação web moderna e interativa criada para ajudar você a monitorar sua ingestão diária de água de forma inteligente, social e motivadora. Desenvolvido com HTML, CSS e JavaScript puros, o projeto agora conta com a tecnologia **PeerJS** para criar uma experiência de hidratação compartilhada, permitindo que você e seus amigos se mantenham hidratados juntos.

A aplicação continua extremamente leve e responsiva, funcionando em qualquer navegador moderno sem a necessidade de dependências complexas. Desde um onboarding personalizado até um dashboard completo com gamificação, o HydraTrack transforma a tarefa de se manter hidratado em uma experiência social e divertida.

---

## 📚 Índice

- [🚀 Funcionalidades Principais](#🚀-funcionalidades-principais)
- [🤝 Recursos Sociais com PeerJS](#🤝-recursos-sociais-com-peerjs)
- [🧠 Tecnologias Utilizadas](#🧠-tecnologias-utilizadas)
- [📂 Estrutura do Projeto](#📂-estrutura-do-projeto)
- [🎯 Começando](#🎯-começando)
- [⚙️ Personalização](#⚙️-personalização)
- [📢 Permissões e Notificações](#📢-permissões-e-notificações)
- [📜 Licença](#📜-licença)

---

## 🚀 Funcionalidades Principais

- 📱 **Interface Moderna e Responsiva**: Design limpo e adaptável para desktops e dispositivos móveis.
- 🧠 **Onboarding Inteligente**: Cálculo personalizado da meta de hidratação com base em peso e nível de atividade.
- 📊 **Dashboard Completo**: Copo animado, estatísticas de consumo, meta restante e registros do dia.
- 🏆 **Gamificação Extensiva**: Mais de 60 conquistas (Bronze, Prata, Ouro, Esmeralda).
- 🔔 **Notificações Inteligentes**:
  - Lembretes nativos configuráveis.
  - Alertas sonoros personalizáveis.
- 🌗 **Tema Claro e Escuro**: Detecção automática ou troca manual.
- 📈 **Progresso Semanal**: Gráfico de consistência de hidratação.
- 🎉 **Animações e Feedbacks**: Efeitos visuais ao registrar consumo e atingir metas.
- 🔧 **Configurações Flexíveis**: Perfil, meta, sons e lembretes totalmente personalizáveis.

---

## 🤝 Recursos Sociais com PeerJS

- 🔗 **Conexão P2P com Amigos**: Use um código de convite único para conectar-se diretamente.
- 🔄 **Timeline Compartilhada em Tempo Real**: Veja registros de consumo seus e dos seus amigos ao vivo.
- 🔔 **Notificações Sociais Nativas**: Receba alertas quando seus amigos beberem água ou alcançarem metas.
- 💎 **Conquistas Esmeralda**: Baseadas em interações sociais.
- ⚙️ **Notificações Sociais Independentes**: Controle separado de som, volume e preferências sociais.

---

## 🧠 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível.
- **CSS3**: Estilização responsiva e moderna com variáveis, Flexbox e Grid.
- **JavaScript (ES6+)**: Lógica da aplicação.
- **Programação Orientada a Objetos (POO)**: Classe `HydraTrack` modular.
- **localStorage**: Persistência de dados e configurações.
- **DOM API**: Manipulação dinâmica da interface.
- **Web Notifications API**: Notificações nativas do navegador.
- **PeerJS**: Conexões WebRTC peer-to-peer.

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
