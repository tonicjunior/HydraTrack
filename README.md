# 💧 HydraTrack - Lembrete de Hidratação

## ✨ Visão Geral

**HydraTrack** é uma aplicação moderna de hidratação que funciona tanto como **aplicação web** quanto como **aplicativo desktop (Windows)**.  
O objetivo do projeto é ajudar você a monitorar sua ingestão diária de água de forma inteligente, social e motivadora.

Desenvolvido com **HTML, CSS e JavaScript puros**, o HydraTrack também pode ser empacotado como um aplicativo desktop utilizando **Electron**, oferecendo uma experiência mais fluida, com notificações nativas, execução em segundo plano e interface adaptada ao ambiente desktop.

A aplicação é leve, responsiva e não depende de frameworks pesados, funcionando perfeitamente em navegadores modernos e em formato `.exe`.

---

## 📚 Índice

- [🚀 Funcionalidades Principais](#🚀-funcionalidades-principais)
- [🤝 Recursos Sociais com PeerJS](#🤝-recursos-sociais-com-peerjs)
- [🧠 Tecnologias Utilizadas](#🧠-tecnologias-utilizadas)
- [🖥️ Versão Desktop (Electron)](#️-versão-desktop-electron)
- [📂 Estrutura do Projeto](#📂-estrutura-do-projeto)
- [🎯 Começando - Versão Web](#🎯-começando---versão-web)
- [🎯 Começando - Versão Desktop](#🎯-começando---versão-desktop)
- [⚙️ Personalização](#⚙️-personalização)
- [📢 Permissões e Notificações](#📢-permissões-e-notificações)
- [📜 Licença](#📜-licença)

---

## 🚀 Funcionalidades Principais

- 📱 **Interface Moderna e Responsiva**
- 🧠 **Onboarding Inteligente**
- 📊 **Dashboard Completo**
- 🏆 **Gamificação Avançada**
- 🔔 **Notificações Inteligentes**
- 🌗 **Tema Claro e Escuro**
- 📈 **Progresso Semanal**
- 🎉 **Animações e Feedback Visual**
- 🔧 **Configurações Flexíveis**

---

## 🤝 Recursos Sociais com PeerJS

- 🔗 Conexão P2P direta por código de convite
- 🔄 Timeline compartilhada em tempo real
- 🔔 Notificações sociais nativas
- 💎 Conquistas sociais exclusivas
- ⚙️ Controles independentes de notificações sociais

---

## 🧠 Tecnologias Utilizadas

- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**
- **Programação Orientada a Objetos (POO)**
- **localStorage**
- **Web Notifications API**
- **PeerJS (WebRTC)**
- **Electron (versão desktop)**

---

## 🖥️ Versão Desktop (Electron)

O HydraTrack pode ser executado como um **aplicativo desktop para Windows**, utilizando Electron.

### ✨ Benefícios da versão desktop

- Executável `.exe`
- Interface otimizada para desktop
- Notificações nativas do sistema
- Funcionamento offline
- Transições visuais suaves
- Controles de janela personalizados

A versão desktop utiliza o **mesmo código-base da versão web**, garantindo fácil manutenção e evolução contínua.

---

## 📂 Estrutura do Projeto

```
├── index.html        # Estrutura principal do app
├── style.css         # Estilo visual e animações
├── script.js         # Lógica da aplicação (Classe HydraTrack)
├── main.js           # Processo principal do Electron
├── preload.js        # Ponte segura Electron ↔ Frontend
├── assets/
│   ├── sounds/
│   └── images/
└── README.md
```

---

## 🎯 Começando - Versão Web

1. Clone o repositório:

```bash
git clone https://github.com/tonicjunior/HydraTrack.git
```

2. Acesse a pasta:

```bash
cd HydraTrack
```

3. Abra o arquivo `index.html` em qualquer navegador moderno.

---

## 🎯 Começando - Versão Desktop

> Requisitos: Node.js instalado

1. Instale as dependências:

```bash
npm install
```

2. Execute o app em modo desenvolvimento:

```bash
npm start
```

3. Gerar o executável (.exe):

```bash
npm run dist
```

---

## ⚙️ Personalização

O código foi estruturado de forma **modular e extensível**, permitindo personalizações rápidas diretamente na classe `HydraTrack`, sem necessidade de refatorações profundas.

- Valores dos botões rápidos
- Sons de notificação
- Intervalo dos lembretes
- Cores e temas via variáveis CSS

---

## 📢 Permissões e Notificações

- Permissão de notificações do navegador é necessária na versão web
- Na versão desktop, as notificações utilizam o sistema operacional
- Caso não receba alertas, verifique permissões do sistema (ex: Assistente de Foco no Windows)

---

## 📜 Licença

Este projeto é licenciado sob a **Licença MIT**.  
Sinta-se à vontade para usar, modificar e distribuir.
