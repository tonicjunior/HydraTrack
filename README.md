# 💧 HydraTrack - Lembrete de Hidratação

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## ✨ Visão Geral

**HydraTrack** é uma aplicação web moderna e interativa criada para ajudar você a monitorar sua ingestão diária de água de forma inteligente e motivadora. Desenvolvido com **HTML, CSS e JavaScript puros**, o projeto é extremamente leve, responsivo e funciona perfeitamente em qualquer navegador moderno, sem a necessidade de dependências externas.

Desde um onboarding personalizado que calcula sua meta diária até um dashboard completo com notificações inteligentes, o HydraTrack transforma a tarefa de se manter hidratado em uma experiência agradável e divertida.

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
- 🧠 **Onboarding Inteligente**: Um passo a passo inicial que calcula sua meta de hidratação personalizada com base no seu peso e nível de atividade.
- 📊 **Dashboard Completo**: Visualize seu progresso com um copo d'água animado, estatísticas de consumo, meta restante e registros do dia.
- 🔔 **Notificações Inteligentes**:
  - Lembretes nativos do navegador para beber água em intervalos configuráveis.
  - Alerta sonoro (com seu arquivo `agua.mp3`) para chamar a atenção.
  - Modal interativa na tela para confirmar a hidratação e silenciar o alerta atual.
- 🌗 **Tema Claro e Escuro**: Detecção automática baseada no sistema operacional ou troca manual.
- 📈 **Progresso Semanal**: Gráfico visual para acompanhar sua consistência ao longo da semana.
- 🎉 **Animações e Feedback Visual**: Celebração animada ao atingir a meta diária e efeitos visuais ao registrar o consumo.
- 🔧 **Configurações Flexíveis**: Ajuste facilmente seu perfil, meta de hidratação e preferências de notificação.

---

## 🧠 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível.
- **CSS3**: Estilização moderna e responsiva.
  - **Variáveis CSS**: Para um sistema de temas (claro/escuro) flexível.
  - **Flexbox & Grid Layout**: Para a construção de layouts complexos.
  - **Animações e Transições**: Para uma experiência de usuário fluida e agradável.
- **JavaScript (ES6+)**: Lógica completa da aplicação, sem frameworks ou bibliotecas.
  - **Programação Orientada a Objetos (POO)**: Código organizado em classes para melhor manutenção.
  - **`localStorage`**: Para salvar os dados do usuário e persistir a sessão no navegador.
  - **DOM API**: Manipulação dinâmica da interface.
  - **Web Notifications API**: Para a criação de lembretes nativos.

---

## 📂 Estrutura do Projeto
 ```
 ├── 📄 index.html   # Estrutura principal do app <br>
 ├── 🎨 style.css    # Estilo visual com animações modernas <br>
 ├── ⚙️ script.js    # Lógica completa da aplicação <br>
 └── 🔊 agua.mp3     # Som de notificação para lembret <br>
 ```

---

## 🎯 Começando

Para executar este projeto localmente, siga os passos abaixo.

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/hydratrack.git](https://github.com/seu-usuario/hydratrack.git)
    ```
    (Substitua `seu-usuario/hydratrack.git` pelo URL do seu repositório)

2.  **Navegue até a pasta do projeto:**
    ```bash
    cd hydratrack
    ```

3.  **Abra o arquivo `index.html`:**
    Basta abrir o arquivo `index.html` diretamente no seu navegador de preferência (Chrome, Firefox, Edge, etc.).

4.  **Siga o Onboarding:**
    Preencha as informações iniciais para que o aplicativo calcule sua meta e configure seu perfil.

Pronto! Agora é só começar a registrar seu consumo e se manter hidratado 💦

---

## ⚙️ Personalização

O código foi escrito de forma clara para facilitar customizações:

-   **Valores dos Botões Rápidos**: Altere o array `quickAmounts` dentro do `constructor` da classe `HydraTrack` no arquivo `script.js`.
-   **Intervalo das Notificações**: Modifique o valor da variável `notificationIntervalMinutes` no `constructor`.
-   **Aparência e Cores**: Todos os estilos, incluindo as cores dos temas claro e escuro, estão centralizados no arquivo `style.css` através de variáveis CSS.

---

## 📢 Permissões e Notificações

Para que os lembretes funcionem, o aplicativo precisa da sua permissão.

-   **Permissão do Navegador**: Na primeira vez, o navegador solicitará permissão para exibir notificações. É crucial que você **aceite**.
-   **Problemas no Windows?**: Se as notificações de áudio funcionam, mas os alertas de texto não aparecem, o problema geralmente está nas configurações do Windows, e não no código. Verifique principalmente:
    1.  **Assistente de Foco**: Certifique-se de que ele está desativado (`Configurações > Sistema > Assistente de Foco`).
    2.  **Notificações do Navegador**: Garanta que seu navegador tem permissão para exibir notificações (`Configurações > Sistema > Notificações`).

---

## 📜 Licença

Este projeto é de código aberto e está licenciado sob a [Licença MIT](https://opensource.org/licenses/MIT). Sinta-se à vontade para usar, modificar e distribuir.
