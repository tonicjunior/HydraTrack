class HydraTrack {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 6;
    this.onboardingData = {};
    this.user = null;
    this.waterLogs = [];
    this.settings = {
      theme: "system",
      sound: 1,
      soundEnabled: true,
      notificationsEnabled: false,
      notificationVolume: 0.8,
      friendNotifications: {
        enabled: false,
        sound: 1,
        volume: 0.8,
      },
    };
    this.sounds = [
      { id: 1, name: "Gato Pianista", file: "cat.mp3" },
      { id: 2, name: "Eletro Music", file: "agua.mp3" },
      { id: 3, name: "Sino Suave", file: "bell.mp3" },
      { id: 4, name: "Up level", file: "level.mp3" },
      { id: 5, name: "Mensagem", file: "mensagem.mp3" },
      { id: 6, name: "Notification", file: "notification1.mp3" },
      { id: 7, name: "New Notification", file: "notification2.mp3" },
      { id: 8, name: "Chamada padrão", file: "tone.mp3" },
    ];
    this.streak = 0;
    this.isOnboarded = false;
    this.notificationPermission = "default";
    this.notificationTimer = null;
    this.soundTimeout = null;
    this.notificationIntervalMinutes = 120;
    this.reminderMessages = [
      "Já se passaram {time} desde seu último copo. Que tal mais um? 💧",
      "Lembrete amigável: faz {time} que você não se hidrata. Vamos lá!",
      "Seu corpo agradece! Beba um pouco de água, já faz {time}.",
      "Psst... Hora da hidratação! Seu último registro foi há {time}.",
    ];
    this.notificationSound = new Audio();
    this.friendNotificationSound = new Audio();
    this.particleCanvas = null;
    this.particleCtx = null;
    this.particles = [];

    this.unlockedAchievements = [];
    this.allAchievements = this.getAchievementsList();

    this.peer = null;
    this.myPeerId = null;
    this.friendConnections = {};
    this.friendsData = {};

    this.initializeApp();
  }

  initializeApp() {
    this.loadData();
    this.applyTheme();
    this.initializeNotifications();
    this.initializeParticles();
    if (!this.isOnboarded || !this.user) {
      this.showOnboarding();
    } else {
      this.showDashboard();
      this.checkOfflineHydrationStatus();
      this.checkAllAchievements();
    }
    this.attachEventListeners();
  }

  loadData() {
    try {
      this.user = JSON.parse(localStorage.getItem("hydratrack-user")) || null;
      this.waterLogs =
        JSON.parse(localStorage.getItem("hydratrack-logs")) || [];
      const savedSettings =
        JSON.parse(localStorage.getItem("hydratrack-settings")) || {};
      this.settings = { ...this.settings, ...savedSettings };

      if (
        !this.settings.friendNotifications ||
        typeof this.settings.friendNotifications.enabled === "undefined"
      ) {
        this.settings.friendNotifications = {
          enabled: true,
          sound: 1,
          volume: 0.8,
        };
      }

      this.streak = parseInt(localStorage.getItem("hydratrack-streak")) || 0;
      this.isOnboarded =
        localStorage.getItem("hydratrack-onboarded") === "true";
      this.unlockedAchievements =
        JSON.parse(localStorage.getItem("hydratrack-unlocked-achievements")) ||
        [];
      this.notificationSound.volume = this.settings.notificationVolume;
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  saveData() {
    try {
      localStorage.setItem("hydratrack-user", JSON.stringify(this.user));
      localStorage.setItem("hydratrack-logs", JSON.stringify(this.waterLogs));
      localStorage.setItem(
        "hydratrack-settings",
        JSON.stringify(this.settings)
      );
      localStorage.setItem("hydratrack-streak", this.streak.toString());
      localStorage.setItem("hydratrack-onboarded", this.isOnboarded.toString());
      localStorage.setItem(
        "hydratrack-unlocked-achievements",
        JSON.stringify(this.unlockedAchievements)
      );
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }

  showOnboarding() {
    document.getElementById("onboarding").style.display = "flex";
    document.getElementById("dashboard").style.display = "none";
    this.renderCurrentStep();
  }

  renderCurrentStep() {
    const stepContent = document.getElementById("step-content");
    const stepInfo = document.getElementById("step-info");
    const progressPercentage = document.getElementById("progress-percentage");
    const progressFill = document.getElementById("progress-fill");
    const backBtn = document.getElementById("back-btn");
    const nextBtn = document.getElementById("next-btn");
    stepInfo.textContent = `Passo ${this.currentStep} de ${this.totalSteps}`;
    const percentage = Math.round((this.currentStep / this.totalSteps) * 100);
    progressPercentage.textContent = `${percentage}%`;
    progressFill.style.width = `${percentage}%`;
    backBtn.style.display = this.currentStep > 1 ? "block" : "none";
    nextBtn.textContent =
      this.currentStep === this.totalSteps ? "Começar!" : "Próximo";
    stepContent.innerHTML = this.getStepContent(this.currentStep);
    this.attachStepEventListeners();
  }

  getStepContent(step) {
    switch (step) {
      case 1:
        return `<div class="step-icon" style="background: var(--gradient-primary);"><svg viewBox="0 0 24 24"><path d="M12 2c1 3 4 6 4 9a4 4 0 0 1-8 0c0-3 3-6 4-9z"/></svg></div>
                <h2 class="step-title">Bem-vindo ao HydraTrack!</h2>
                <p class="step-subtitle">Vamos configurar seu perfil para uma hidratação personalizada.</p>
                <div class="form-group"><label for="user-name" class="form-label">Como podemos te chamar?</label><input type="text" id="user-name" class="form-input" placeholder="Seu nome" value="${
                  this.onboardingData.name || ""
                }"></div>`;
      case 2:
        return `<div class="step-icon" style="background: var(--gradient-secondary);"><svg viewBox="0 0 24 24"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7 7-7z"/></svg></div>
                <h2 class="step-title">Seu peso atual</h2><p class="step-subtitle">Usaremos para calcular sua meta ideal.</p>
                <div class="form-group"><label for="user-weight" class="form-label">Peso (kg)</label><input type="number" id="user-weight" class="form-input" placeholder="Ex: 70" min="30" max="200" value="${
                  this.onboardingData.weight || ""
                }"></div>`;
      case 3:
        const activity = this.onboardingData.activityLevel || "moderado";
        return `<div class="step-icon" style="background: var(--gradient-accent);"><svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>
                <h2 class="step-title">Nível de atividade</h2><p class="step-subtitle">Isso afeta sua necessidade de hidratação.</p>
                <div class="activity-options">
                    <button class="activity-option ${
                      activity === "sedentario" ? "active" : ""
                    }" data-value="sedentario"><div class="activity-title">Sedentário</div><div class="activity-desc">Pouco ou nenhum exercício</div></button>
                    <button class="activity-option ${
                      activity === "moderado" ? "active" : ""
                    }" data-value="moderado"><div class="activity-title">Moderado</div><div class="activity-desc">Exercício 1-3x por semana</div></button>
                    <button class="activity-option ${
                      activity === "ativo" ? "active" : ""
                    }" data-value="ativo"><div class="activity-title">Ativo</div><div class="activity-desc">Exercício 4+ vezes por semana</div></button>
                </div>`;
      case 4:
        const weight = this.onboardingData.weight || 70;
        const activityLevel = this.onboardingData.activityLevel || "moderado";
        const calculatedGoal = this.calculateDailyGoal(weight, activityLevel);
        return `<div class="step-icon" style="background: var(--gradient-secondary);"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg></div>
            <h2 class="step-title">Sua meta diária</h2><p class="step-subtitle">Com base no seu perfil, calculamos sua meta ideal.</p>
            <div class="goal-card">
                <div class="goal-label">Meta sugerida</div><div class="goal-value">${calculatedGoal}ml</div>
            </div>
            <div class="toggle-switch-container">
                <label for="custom-goal-check" class="toggle-switch-label">Definir meta personalizada</label>
                <label class="toggle-switch"><input type="checkbox" id="custom-goal-check" ${
                  this.onboardingData.customGoalCheck ? "checked" : ""
                }><span class="slider"></span></label>
            </div>
            <div id="custom-goal-input" style="display: ${
              this.onboardingData.customGoalCheck ? "block" : "none"
            }; margin-top: 1rem;">
                <input type="number" id="custom-goal-value" class="form-input" placeholder="Meta personalizada (ml)" min="500" max="5000" value="${
                  this.onboardingData.customGoalValue || ""
                }">
            </div>`;
      case 5:
        const currentVolume = this.onboardingData.notificationVolume ?? 0.8;
        const currentSound = this.onboardingData.sound || this.settings.sound;
        const soundOptions = this.sounds
          .map(
            (sound) =>
              `<option value="${sound.id}" ${
                currentSound === sound.id ? "selected" : ""
              }>${sound.name}</option>`
          )
          .join("");

        return `<div class="step-icon" style="background: var(--gradient-accent);"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg></div>
            <h2 class="step-title">Som dos Lembretes</h2><p class="step-subtitle">Personalize o som e o volume dos alertas de hidratação.</p>
            <div class="form-group" style="margin-top: 1.5rem;">
                 <label for="onboarding-notification-sound" class="form-label">Som do Lembrete</label>
                 <select id="onboarding-notification-sound" class="form-input">${soundOptions}</select>
            </div>
            <div class="form-group">
                <label for="onboarding-notification-volume" class="form-label">Volume do Lembrete</label>
                <div class="volume-control-container">
                    <input type="range" id="onboarding-notification-volume" class="volume-slider" min="0" max="1" step="0.01" value="${currentVolume}">
                    <span id="onboarding-volume-percentage">${Math.round(
                      currentVolume * 100
                    )}%</span>
                    <button type="button" id="onboarding-test-volume-btn" class="btn-icon" title="Testar som">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>
                    </button>
                </div>
            </div>`;
      case 6:
        return `<div class="step-icon" style="background: var(--gradient-primary);"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg></div>
                <h2 class="step-title">Ativar Lembretes</h2>
                <p class="step-subtitle">Para te lembrarmos de beber água, precisamos da sua permissão para enviar notificações.</p>
                <p class="step-subtitle" style="font-size: 0.8rem; color: hsl(var(--muted-foreground));">Isto é essencial para a funcionalidade do app.</p>
                <button id="request-permission-btn" class="btn btn-primary" style="width: 100%; margin-top: 1.5rem;">
                    <svg viewBox="0 0 24 24" fill="currentColor" style="width: 1.25rem; height: 1.25rem; margin-right: 0.5rem;"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
                    Ativar Notificações
                </button>
                <div id="permission-status" style="margin-top: 1rem; color: hsl(var(--success)); font-weight: 600;"></div>
                `;
      default:
        return "";
    }
  }

  saveStepData(step) {
    switch (step) {
      case 1:
        this.onboardingData.name = document
          .getElementById("user-name")
          ?.value.trim();
        break;
      case 2:
        this.onboardingData.weight = parseInt(
          document.getElementById("user-weight")?.value
        );
        break;
      case 3:
        this.onboardingData.activityLevel = document.querySelector(
          ".activity-option.active"
        )?.dataset.value;
        break;
      case 4:
        this.onboardingData.customGoalCheck =
          document.getElementById("custom-goal-check")?.checked;
        this.onboardingData.customGoalValue =
          document.getElementById("custom-goal-value")?.value;
        break;
      case 5:
        this.onboardingData.notificationVolume = parseFloat(
          document.getElementById("onboarding-notification-volume")?.value
        );
        this.onboardingData.sound = parseInt(
          document.getElementById("onboarding-notification-sound")?.value
        );
        break;
      case 6:
        break;
    }
  }

  canProceedFromStep(step) {
    const data = this.onboardingData;
    switch (step) {
      case 1:
        return data.name && data.name.length > 0;
      case 2:
        return data.weight && data.weight > 0;
      case 3:
        return !!data.activityLevel;
      case 4:
        if (data.customGoalCheck) {
          return data.customGoalValue && parseInt(data.customGoalValue) > 0;
        }
        return true;
      case 5:
      case 6:
        return true;
      default:
        return false;
    }
  }

  completeOnboarding() {
    const {
      name,
      weight,
      activityLevel,
      wakeTime,
      sleepTime,
      customGoalCheck,
      customGoalValue,
      notificationVolume,
      sound,
    } = this.onboardingData;
    const calculatedGoal = this.calculateDailyGoal(weight, activityLevel);
    const finalGoal = customGoalCheck
      ? parseInt(customGoalValue)
      : calculatedGoal;

    this.user = {
      id: this.generateId(),
      name,
      weight,
      activityLevel,
      wakeTime,
      sleepTime,
      dailyGoal: finalGoal,
      isManualGoal: customGoalCheck,
      quickAmounts: [250, 500, 750, 1000],
    };

    this.settings.notificationVolume = notificationVolume ?? 0.8;
    this.settings.sound = sound || 1;
    this.notificationSound.volume = this.settings.notificationVolume;

    this.playSound(true);

    this.settings.notificationsEnabled =
      this.notificationPermission === "granted";
    this.isOnboarded = true;
    this.saveData();
    this.showDashboard();
  }

  showDashboard() {
    document.getElementById("onboarding").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    this.updateDashboard();
  }

  updateDashboard() {
    if (!this.user) return;
    this.updateHeader();
    this.updateWaterGlass();
    this.updateStats();
    this.updateQuickButtons();
    this.updateTimeline();
    this.updateProgressSection();
  }

  updateHeader() {
    document.getElementById(
      "greeting-text"
    ).textContent = `${this.getTimeOfDay()}, ${this.user.name}!`;
    document.getElementById("motivational-message").textContent =
      this.getMotivationalMessage();
    document.getElementById("streak-count").textContent = this.streak;
  }

  updateWaterGlass() {
    const { consumed, goal, percentage } = this.getTodayProgress();
    document.getElementById(
      "percentage-text"
    ).textContent = `${percentage.toFixed(0)}%`;
    document.getElementById(
      "amount-text"
    ).textContent = `${consumed}ml de ${goal}ml`;
    this.animateWaterFill(percentage);
    this.sendDataToAllFriends({
      type: "profile_update",
      payload: { percentage: percentage },
    });
  }

  updateStats() {
    const { consumed, goal, logs } = this.getTodayProgress();
    document.getElementById("consumed-stat").textContent = consumed;
    document.getElementById("remaining-stat").textContent = Math.max(
      0,
      goal - consumed
    );
    document.getElementById("logs-stat").textContent = logs.length;
  }

  updateQuickButtons() {
    const container = document.getElementById("quick-buttons-container");
    const icons = ["250", "500", "700", "1000"];
    const gradients = [
      "--gradient-primary",
      "--gradient-secondary",
      "--gradient-accent",
      "--gradient-primary",
    ];
    container.innerHTML = this.user.quickAmounts
      .map(
        (amount, index) =>
          `<button class="quick-btn" data-amount="${amount}" style="background: var(${
            gradients[index % gradients.length]
          })">
                <div class="quick-icon" style="font-size: 2rem;"> <img src="assets/${
                  icons[index % icons.length]
                }.png"> </div>
                <span class="quick-amount">${amount}ml</span>
            </button>`
      )
      .join("");
  }

  updateTimeline() {
    const isConnected = Object.keys(this.friendConnections).length > 0;
    let timelineLogs = this.getTodayProgress().logs.map((log) => ({
      ...log,
      userName: this.user.name,
    }));

    if (isConnected) {
      Object.values(this.friendsData).forEach((friend) => {
        if (friend.logs) {
          timelineLogs.push(...friend.logs);
        }
      });
      timelineLogs.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
    }
    this.renderTimeline(timelineLogs, isConnected);
  }

  renderTimeline(logs, isShared) {
    const container = document.getElementById("timeline-container");
    if (logs.length === 0) {
      container.innerHTML = `<div class="empty-timeline"><svg class="empty-icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg><p>Nenhum registro hoje ainda.</p><p>Que tal começar agora?</p></div>`;
    } else {
      container.innerHTML = logs
        .map((log) => {
          const userNameDisplay = isShared
            ? `<span class="timeline-user-name">${
                log.userName === this.user.name ? "Você" : log.userName
              }</span>`
            : "";
          const deleteButton =
            log.userName === this.user.name
              ? `<button class="timeline-delete" data-log-id="${log.id}">×</button>`
              : "";

          return `
                <div class="timeline-item">
                    <div class="timeline-content">
                        <div class="timeline-dot"></div>
                        <div>
                            <div class="timeline-amount">${
                              log.amount
                            }ml ${userNameDisplay}</div>
                            <div class="timeline-time">${this.formatTime(
                              log.timestamp
                            )}</div>
                        </div>
                    </div>
                    ${deleteButton}
                </div>`;
        })
        .join("");
    }
  }

  updateProgressSection() {
    const { percentage } = this.getTodayProgress();
    document.getElementById(
      "daily-percentage"
    ).textContent = `${percentage.toFixed(0)}%`;
    document.getElementById(
      "daily-progress-fill"
    ).style.width = `${percentage}%`;
    this.renderWeekGrid();
  }

  renderWeekGrid() {
    const container = document.getElementById("week-grid-container");
    const today = new Date();
    const dayOfWeek = today.getDay();
    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    let html = "";
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (dayOfWeek - i));
      const dateString = date.toISOString().split("T")[0];
      const dayLogs = this.waterLogs.filter((log) => log.date === dateString);
      const consumed = dayLogs.reduce((sum, log) => sum + log.amount, 0);
      const percentage = this.getProgressPercentage(
        consumed,
        this.user.dailyGoal
      );
      const isToday = i === dayOfWeek;
      html += `<div class="week-day ${isToday ? "today" : ""}">
                    <div class="week-label">${weekDays[i]}</div>
                    <div class="week-bar">
                        <div class="week-bar-fill" style="height: ${percentage}%; background: ${
        percentage >= 100 ? "hsl(var(--success))" : "var(--gradient-primary)"
      };"></div>
                    </div>
                    <div class="week-percentage">${percentage.toFixed(0)}%</div>
                </div>`;
    }
    container.innerHTML = html;
  }

  addWaterLog(amount, isCustom = false) {
    this.triggerWaterAnimation();
    const prevProgress = this.getTodayProgress();

    const newLog = {
      id: this.generateId(),
      amount: parseInt(amount),
      timestamp: new Date().toISOString(),
      date: this.getTodayDateString(),
      isCustom: isCustom,
      userName: this.user.name,
    };
    this.waterLogs.push(newLog);

    const newProgress = this.getTodayProgress();

    this.broadcastHydration(newLog);

    if (prevProgress.percentage < 100 && newProgress.percentage >= 100) {
      this.showCelebration();
      this.updateStreak();
      this.broadcastGoalReached();
    }

    this.checkAllAchievements();
    this.saveData();

    this.resetNotificationTimer();
    this.updateDashboard();
    const customInput = document.getElementById("custom-amount");
    if (customInput) customInput.value = "";
  }

  deleteWaterLog(logId) {
    this.waterLogs = this.waterLogs.filter((log) => log.id !== logId);
    this.saveData();
    this.updateDashboard();
  }

  updateStreak() {
    this.streak++;
    this.saveData();
  }

  applyTheme() {
    const themeIcon = document.getElementById("theme-icon");
    let themeToApply = this.settings.theme;
    if (themeToApply === "system") {
      themeToApply = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    if (themeToApply === "dark") {
      document.documentElement.classList.add("dark");
      if (themeIcon)
        themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;
    } else {
      document.documentElement.classList.remove("dark");
      if (themeIcon)
        themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`;
    }
  }

  toggleTheme() {
    this.settings.theme = this.settings.theme === "light" ? "dark" : "light";
    this.applyTheme();
    this.saveData();
  }

  showCelebration() {
    const modal = document.getElementById("celebration-modal");
    modal.style.display = "flex";
    setTimeout(() => {
      modal.style.display = "none";
    }, 3000);
  }

  animateWaterFill(percentage) {
    const waterFill = document.getElementById("water-fill");
    const fillHeight = Math.max(0, Math.min(116, (percentage / 100) * 116));
    const fillY = 138 - fillHeight;
    waterFill.style.transition = "all 1.5s cubic-bezier(0.4, 0, 0.2, 1)";
    waterFill.setAttribute("height", fillHeight);
    waterFill.setAttribute("y", fillY);
  }

  showSettings() {
    this.unlockAchievement("B13");
    const modal = document.getElementById("settings-modal");
    const content = modal.querySelector(".settings-modal-content");
    const soundOptions = this.sounds
      .map(
        (sound) =>
          `<option value="${sound.id}" ${
            this.settings.sound === sound.id ? "selected" : ""
          }>${sound.name}</option>`
      )
      .join("");
    content.innerHTML = `<div class="settings-group">
                <h3>Perfil</h3>
                <div class="form-group"><label for="setting-name">Nome</label><input type="text" id="setting-name" class="form-input" value="${
                  this.user.name
                }"></div>
                <div class="form-group"><label for="setting-weight">Peso (kg)</label><input type="number" id="setting-weight" class="form-input" value="${
                  this.user.weight
                }"></div>
            </div>
            <div class="settings-group">
                <h3>Meta de Hidratação</h3>
                <div class="toggle-switch-container"><label for="setting-manual-goal" class="toggle-switch-label">Definir meta manual</label><label class="toggle-switch"><input type="checkbox" id="setting-manual-goal" ${
                  this.user.isManualGoal ? "checked" : ""
                }><span class="slider"></span></label></div>
                <div id="setting-goal-input-container" style="display: ${
                  this.user.isManualGoal ? "block" : "none"
                };"><div class="form-group"><label for="setting-goal">Meta Diária (ml)</label><input type="number" id="setting-goal" class="form-input" value="${
      this.user.dailyGoal
    }"></div></div>
            </div>
            <div class="settings-group">
                <h3>Notificações Pessoais</h3>
                <div class="toggle-switch-container"><label for="setting-notifications" class="toggle-switch-label">Ativar lembretes</label><label class="toggle-switch"><input type="checkbox" id="setting-notifications" ${
                  this.settings.notificationsEnabled ? "checked" : ""
                }><span class="slider"></span></label></div>
                <p id="notification-permission-status" class="custom-help" style="margin-top: 0.5rem;"></p>
                <div class="form-group"><label for="setting-notification-interval">Intervalo (minutos)</label><input type="number" id="setting-notification-interval" class="form-input" value="${
                  this.notificationIntervalMinutes
                }" min="15" max="180"></div>
                <div class="form-group"><label for="setting-notification-sound">Som do Lembrete</label><select id="setting-notification-sound" class="form-input">${soundOptions}</select></div>
                <div class="form-group">
                    <label for="setting-notification-volume">Volume do Lembrete</label>
                    <div class="volume-control-container">
                        <input type="range" id="setting-notification-volume" class="volume-slider" min="0" max="1" step="0.01" value="${
                          this.settings.notificationVolume
                        }">
                        <span id="volume-percentage">${Math.round(
                          this.settings.notificationVolume * 100
                        )}%</span>
                        <button id="test-volume-btn" class="btn-icon" title="Testar som"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg></button>
                    </div>
                </div>
            </div>
            <div class="settings-actions">
                <button id="show-delete-modal-btn" class="btn btn-destructive">Excluir Dados</button>
                <button id="save-settings-btn" class="btn btn-primary">Salvar Alterações</button>
            </div>`;
    modal.style.display = "flex";
    this.attachSettingsListeners();
  }

  hideSettings() {
    document.getElementById("settings-modal").style.display = "none";
  }

  saveSettings() {
    const oldSoundId = this.settings.sound;
    const oldIsManual = this.user.isManualGoal;

    this.user.name = document.getElementById("setting-name").value;
    this.user.weight = parseInt(
      document.getElementById("setting-weight").value
    );
    this.user.isManualGoal = document.getElementById(
      "setting-manual-goal"
    ).checked;

    if (this.user.isManualGoal) {
      this.user.dailyGoal = parseInt(
        document.getElementById("setting-goal").value
      );
    } else {
      this.user.dailyGoal = this.calculateDailyGoal(
        this.user.weight,
        this.user.activityLevel
      );
    }
    this.settings.notificationsEnabled = document.getElementById(
      "setting-notifications"
    ).checked;
    this.notificationIntervalMinutes = parseInt(
      document.getElementById("setting-notification-interval").value
    );
    this.settings.notificationVolume = parseFloat(
      document.getElementById("setting-notification-volume").value
    );
    this.settings.sound = parseInt(
      document.getElementById("setting-notification-sound").value
    );
    this.notificationSound.volume = this.settings.notificationVolume;

    if (this.settings.sound !== oldSoundId) {
      this.unlockAchievement("S20");
    }
    if (this.user.isManualGoal && !oldIsManual) {
      this.unlockAchievement("G14");
    }

    if (!this.settings.notificationsEnabled) {
      this.stopNotificationTimer();
    } else {
      this.resetNotificationTimer();
    }
    this.saveData();
    this.updateDashboard();
    this.hideSettings();
  }

  deleteUserData() {
    localStorage.removeItem("hydratrack-user");
    localStorage.removeItem("hydratrack-logs");
    localStorage.removeItem("hydratrack-settings");
    localStorage.removeItem("hydratrack-streak");
    localStorage.removeItem("hydratrack-onboarded");
    localStorage.removeItem("hydratrack-unlocked-achievements");
    window.location.reload();
  }

  showInfoModal(title, message) {
    document.getElementById("info-modal-title").textContent = title;
    document.getElementById("info-modal-text").textContent = message;
    document.getElementById("info-modal").style.display = "flex";
  }

  hideInfoModal() {
    document.getElementById("info-modal").style.display = "none";
  }

  attachEventListeners() {
    document.getElementById("back-btn").addEventListener("click", () => {
      if (this.currentStep > 1) {
        this.currentStep--;
        this.renderCurrentStep();
      }
    });
    document.getElementById("next-btn").addEventListener("click", () => {
      this.saveStepData(this.currentStep);
      if (this.canProceedFromStep(this.currentStep)) {
        if (this.currentStep < this.totalSteps) {
          this.currentStep++;
          this.renderCurrentStep();
        } else {
          this.completeOnboarding();
        }
      } else {
        this.showInfoModal(
          "Campo Obrigatório",
          "Por favor, preencha os dados corretamente para continuar."
        );
      }
    });
    document.getElementById("dashboard").addEventListener("click", (event) => {
      const quickBtn = event.target.closest(".quick-btn");
      if (quickBtn) this.addWaterLog(quickBtn.dataset.amount, false);
      const deleteBtn = event.target.closest(".timeline-delete");
      if (deleteBtn) this.deleteWaterLog(deleteBtn.dataset.logId);
    });
    const addCustomBtn = document.getElementById("add-custom-btn");
    addCustomBtn?.addEventListener("click", () => {
      const amount = document.getElementById("custom-amount").value;
      if (amount && parseInt(amount) > 0) this.addWaterLog(amount, true);
    });
    document
      .getElementById("custom-amount")
      ?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const amount = document.getElementById("custom-amount").value;
          if (amount && parseInt(amount) > 0) this.addWaterLog(amount, true);
        }
      });
    document
      .getElementById("theme-toggle-btn")
      ?.addEventListener("click", () => this.toggleTheme());
    document
      .getElementById("settings-btn")
      ?.addEventListener("click", () => this.showSettings());
    document
      .getElementById("close-settings-btn")
      ?.addEventListener("click", () => this.hideSettings());
    document
      .getElementById("confirm-hydration-btn")
      ?.addEventListener("click", () => this.handleHydrationConfirmation());
    document
      .getElementById("confirm-delete-btn")
      .addEventListener("click", () => {
        this.deleteUserData();
      });
    const cancelDeleteModal = () =>
      (document.getElementById("delete-confirm-modal").style.display = "none");
    document
      .getElementById("cancel-delete-btn")
      .addEventListener("click", cancelDeleteModal);
    document
      .getElementById("close-delete-modal-btn")
      .addEventListener("click", cancelDeleteModal);
    document
      .getElementById("info-modal-confirm-btn")
      .addEventListener("click", () => this.hideInfoModal());

    document
      .getElementById("achievements-btn")
      ?.addEventListener("click", () => this.showAchievements());
    document
      .getElementById("close-achievements-btn")
      ?.addEventListener("click", () => this.hideAchievements());
    document
      .getElementById("friends-btn")
      ?.addEventListener("click", () => this.showFriendsModal());
    document
      .getElementById("close-friends-btn")
      ?.addEventListener("click", () => this.hideFriendsModal());
    document
      .getElementById("copy-peer-id-btn")
      ?.addEventListener("click", () => this.copyPeerId());
    document
      .getElementById("connect-friend-btn")
      ?.addEventListener("click", () => {
        const friendId = document.getElementById("friend-peer-id").value.trim();
        this.connectToFriend(friendId);
        document.getElementById("friend-peer-id").value = "";
      });
    document
      .getElementById("disconnect-all-btn")
      ?.addEventListener("click", () => this.disconnectAll());
  }

  attachStepEventListeners() {
    document.querySelectorAll(".activity-option").forEach((option) => {
      option.addEventListener("click", () => {
        document
          .querySelectorAll(".activity-option")
          .forEach((opt) => opt.classList.remove("active"));
        option.classList.add("active");
      });
    });
    if (this.currentStep === 4) {
      const customGoalCheck = document.getElementById("custom-goal-check");
      if (customGoalCheck) {
        customGoalCheck.addEventListener("change", (e) => {
          document.getElementById("custom-goal-input").style.display = e.target
            .checked
            ? "block"
            : "none";
        });
      }
    }
    if (this.currentStep === 5) {
      const volumeSlider = document.getElementById(
        "onboarding-notification-volume"
      );
      const volumePercentage = document.getElementById(
        "onboarding-volume-percentage"
      );
      const soundSelector = document.getElementById(
        "onboarding-notification-sound"
      );
      if (volumeSlider && volumePercentage) {
        volumeSlider.addEventListener("input", (e) => {
          const volume = parseFloat(e.target.value);
          this.notificationSound.volume = volume;
          volumePercentage.textContent = `${Math.round(volume * 100)}%`;
        });
      }
      if (soundSelector) {
        soundSelector.addEventListener("change", (e) => {
          this.playSound(false, parseInt(e.target.value));
        });
      }
      const testVolumeBtn = document.getElementById(
        "onboarding-test-volume-btn"
      );
      if (testVolumeBtn) {
        testVolumeBtn.addEventListener("click", () => {
          const selectedSoundId = parseInt(soundSelector.value);
          this.playSound(false, selectedSoundId);
        });
      }
    }
    if (this.currentStep === 6) {
      const requestBtn = document.getElementById("request-permission-btn");
      const statusDiv = document.getElementById("permission-status");

      if (requestBtn) {
        if (this.notificationPermission === "denied") {
          requestBtn.disabled = true;
          requestBtn.style.opacity = "0.5";
          requestBtn.style.cursor = "not-allowed";
          statusDiv.textContent =
            "As notificações estão bloqueadas no seu navegador.";
          statusDiv.style.color = "hsl(var(--destructive))";
        } else {
          requestBtn.addEventListener("click", async () => {
            await this.requestNotificationPermission();

            if (this.notificationPermission === "granted") {
              statusDiv.textContent = "Permissão concedida com sucesso! 🎉";
              statusDiv.style.color = "hsl(var(--success))";
              requestBtn.style.display = "none";
            } else {
              statusDiv.textContent =
                "Você não concedeu a permissão. Você pode ativá-la mais tarde nas configurações.";
              statusDiv.style.color = "hsl(var(--warning))";
            }
          });
        }
      }
    }
  }

  attachSettingsListeners() {
    document
      .getElementById("save-settings-btn")
      .addEventListener("click", () => this.saveSettings());
    document
      .getElementById("show-delete-modal-btn")
      .addEventListener("click", () => {
        document.getElementById("delete-confirm-modal").style.display = "flex";
      });
    const manualGoalCheck = document.getElementById("setting-manual-goal");
    manualGoalCheck.addEventListener("change", (e) => {
      document.getElementById("setting-goal-input-container").style.display = e
        .target.checked
        ? "block"
        : "none";
    });
    const notificationsCheck = document.getElementById("setting-notifications");
    notificationsCheck?.addEventListener("change", (e) => {
      this.settings.notificationsEnabled = e.target.checked;
      if (e.target.checked) {
        this.requestNotificationPermission();
      } else {
        this.stopNotificationTimer();
      }
    });
    const volumeSlider = document.getElementById("setting-notification-volume");
    const volumePercentage = document.getElementById("volume-percentage");
    if (volumeSlider && volumePercentage) {
      volumeSlider.addEventListener("input", (e) => {
        const volume = parseFloat(e.target.value);
        this.notificationSound.volume = volume;
        volumePercentage.textContent = `${Math.round(volume * 100)}%`;
      });
    }
    const testVolumeBtn = document.getElementById("test-volume-btn");
    const soundSelector = document.getElementById("setting-notification-sound");
    if (testVolumeBtn) {
      testVolumeBtn.addEventListener("click", () =>
        this.playSound(false, parseInt(soundSelector.value))
      );
    }
    if (soundSelector) {
      soundSelector.addEventListener("change", (e) => {
        this.playSound(false, parseInt(e.target.value));
      });
    }
    this.updatePermissionStatusText();
  }

  attachFriendSettingsListeners() {
    document
      .getElementById("friend-notification-toggle")
      .addEventListener("change", (e) => {
        this.settings.friendNotifications.enabled = e.target.checked;
        this.saveData();
      });
    document
      .getElementById("friend-notification-sound")
      .addEventListener("change", (e) => {
        this.settings.friendNotifications.sound = parseInt(e.target.value);
        this.playFriendSound();
        this.saveData();
      });
    document
      .getElementById("friend-notification-volume")
      .addEventListener("input", (e) => {
        const volume = parseFloat(e.target.value);
        this.settings.friendNotifications.volume = volume;
        document.getElementById(
          "friend-volume-percentage"
        ).textContent = `${Math.round(volume * 100)}%`;
        this.friendNotificationSound.volume = volume;
        this.saveData();
      });
    document
      .getElementById("test-friend-volume-btn")
      .addEventListener("click", () => {
        this.playFriendSound();
      });
  }

  getTodayDateString() {
    return new Date().toISOString().split("T")[0];
  }

  calculateDailyGoal(weight, activityLevel) {
    const activityFactors = { sedentario: 1.0, moderado: 1.2, ativo: 1.5 };
    return Math.round(weight * 35 * (activityFactors[activityLevel] || 1.0));
  }

  getProgressPercentage(consumed, goal) {
    if (goal === 0) return 0;
    return Math.min(100, Math.round((consumed / goal) * 100) || 0);
  }

  getTodayProgress() {
    const todayLogs = this.waterLogs.filter(
      (log) => log.date === this.getTodayDateString()
    );
    const consumed = todayLogs.reduce((sum, log) => sum + log.amount, 0);
    const goal = this.user?.dailyGoal || 2000;
    return {
      consumed,
      goal,
      percentage: this.getProgressPercentage(consumed, goal),
      logs: todayLogs,
    };
  }

  getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  }

  getMotivationalMessage() {
    const { percentage } = this.getTodayProgress();
    if (percentage >= 100) return "Meta alcançada! Parabéns! 🎉";
    if (percentage >= 75) return "Quase lá! Continue bebendo água! 💧";
    if (percentage >= 50) return "Você está na metade! Continue assim! 💪";
    return "Um gole de cada vez. Você consegue! ✨";
  }

  formatTime(date) {
    return new Date(date).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  formatElapsedTime(minutes) {
    const totalMinutes = Math.round(minutes);
    if (totalMinutes < 60) {
      return `${totalMinutes} minuto${totalMinutes > 1 ? "s" : ""}`;
    } else {
      const hours = Math.floor(totalMinutes / 60);
      const remainingMinutes = totalMinutes % 60;
      let timeString = `${hours} hora${hours > 1 ? "s" : ""}`;
      if (remainingMinutes > 0) {
        timeString += ` e ${remainingMinutes} minuto${
          remainingMinutes > 1 ? "s" : ""
        }`;
      }
      return timeString;
    }
  }

  initializeNotifications() {
    if (!("Notification" in window)) {
      this.notificationPermission = "denied";
      return;
    }
    this.notificationPermission = Notification.permission;
    if (
      this.settings.notificationsEnabled &&
      this.notificationPermission === "granted"
    ) {
      this.startNotificationTimer();
    }
  }

  async requestNotificationPermission() {
    if (!("Notification" in window)) {
      this.notificationPermission = "denied";
      this.updatePermissionStatusText();
      return;
    }
    const currentPermission = Notification.permission;
    if (currentPermission === "granted") {
      this.notificationPermission = "granted";
      this.settings.notificationsEnabled = true;
      this.startNotificationTimer();
      this.sendNotification(
        "HydraTrack Ativado!",
        "Você será lembrado de beber água. Mantenha-se hidratado!"
      );
    } else if (currentPermission === "denied") {
      this.notificationPermission = "denied";
      this.settings.notificationsEnabled = false;
      this.showInfoModal(
        "Notificações Bloqueadas",
        "Você bloqueou as notificações. Para reativá-las, você precisará alterar as permissões do site nas configurações do seu navegador."
      );
    } else {
      const permission = await Notification.requestPermission();
      this.notificationPermission = permission;
      if (permission === "granted") {
        this.settings.notificationsEnabled = true;
        this.startNotificationTimer();
        this.sendNotification(
          "HydraTrack Ativado!",
          "Você será lembrado de beber água. Mantenha-se hidratado!"
        );
      } else {
        this.settings.notificationsEnabled = false;
        this.stopNotificationTimer();
      }
    }
    this.updatePermissionStatusText();
    const notificationsCheck = document.getElementById("setting-notifications");
    if (notificationsCheck)
      notificationsCheck.checked = this.settings.notificationsEnabled;
    this.saveData();
  }

  updatePermissionStatusText() {
    const statusEl = document.getElementById("notification-permission-status");
    if (!statusEl) return;
    switch (this.notificationPermission) {
      case "granted":
        statusEl.textContent = "Permissão concedida. Lembretes ativados!";
        statusEl.style.color = "hsl(var(--success))";
        break;
      case "denied":
        statusEl.textContent =
          "Permissão bloqueada nas configurações do navegador.";
        statusEl.style.color = "hsl(var(--destructive))";
        break;
      default:
        statusEl.textContent =
          "Aguardando sua permissão para enviar lembretes.";
        statusEl.style.color = "hsl(var(--muted-foreground))";
    }
  }

  startNotificationTimer() {
    this.stopNotificationTimer();
    if (
      !this.settings.notificationsEnabled ||
      this.notificationPermission !== "granted"
    )
      return;
    const intervalMs = this.notificationIntervalMinutes * 60000;
    this.notificationTimer = setInterval(() => {
      const { consumed, goal } = this.getTodayProgress();
      if (consumed >= goal) {
        this.stopNotificationTimer();
        return;
      }
      const todayLogs = this.getTodayProgress().logs;
      const lastLog =
        todayLogs.length > 0 ? todayLogs[todayLogs.length - 1] : null;
      if (!lastLog) {
        this.sendNotification(
          "Hora de se hidratar!",
          "Que tal começar o dia com um copo d'água?"
        );
        return;
      }
      const now = new Date();
      const lastLogTime = new Date(lastLog.timestamp);
      const minutesSinceLastDrink = (now - lastLogTime) / (1000 * 60);
      if (minutesSinceLastDrink >= this.notificationIntervalMinutes) {
        const randomMessageTemplate =
          this.reminderMessages[
            Math.floor(Math.random() * this.reminderMessages.length)
          ];
        const timeString = this.formatElapsedTime(minutesSinceLastDrink);
        const finalMessage = randomMessageTemplate.replace(
          "{time}",
          timeString
        );
        this.sendNotification("Lembrete de Hidratação 💧", finalMessage);
      }
    }, intervalMs);
  }

  stopNotificationTimer() {
    if (this.notificationTimer) {
      clearInterval(this.notificationTimer);
      this.notificationTimer = null;
    }
  }

  resetNotificationTimer() {
    this.startNotificationTimer();
  }

  sendNotification(title, body) {
    if (this.notificationPermission !== "granted") return;
    const options = {
      body: body,
      icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300bcd4'><path d='M12 2c1 3 4 6 4 9a4 4 0 0 1-8 0c0-3 3-6 4-9z'/></svg>",
      tag: "hydratrack-reminder-" + Date.now(),
      silent: true,
    };
    new Notification(title, options);
    if (this.settings.soundEnabled) {
      this.playSound();
      this.showReminderModal();
    }
  }

  playSound(isSilent = false, soundId = null) {
    if (this.soundTimeout) clearTimeout(this.soundTimeout);
    const soundToPlayId = soundId || this.settings.sound;
    const soundObj = this.sounds.find((s) => s.id === soundToPlayId);
    if (!soundObj) return;
    this.notificationSound.src = `assets/sounds/${soundObj.file}`;
    this.notificationSound.load();
    this.notificationSound.volume = this.settings.notificationVolume;
    this.notificationSound.currentTime = 0;
    if (isSilent) {
      this.notificationSound
        .play()
        .then(() => this.notificationSound.pause())
        .catch(() => {});
      return;
    }
    this.notificationSound.play().catch((e) => {});
    this.soundTimeout = setTimeout(() => {
      this.notificationSound.pause();
      this.notificationSound.currentTime = 0;
    }, 5000);
  }

  playFriendSound() {
    const soundId = this.settings.friendNotifications.sound;
    const volume = this.settings.friendNotifications.volume;
    const soundObj = this.sounds.find((s) => s.id === soundId);
    if (!soundObj) return;

    this.friendNotificationSound.src = `assets/sounds/${soundObj.file}`;
    this.friendNotificationSound.volume = volume;
    this.friendNotificationSound.play().catch((e) => {});
  }

  showReminderModal() {
    const modal = document.getElementById("reminder-modal");
    modal.style.display = "flex";
  }

  hideReminderModal() {
    const modal = document.getElementById("reminder-modal");
    modal.style.display = "none";
  }

  handleHydrationConfirmation() {
    if (this.soundTimeout) clearTimeout(this.soundTimeout);
    this.notificationSound.pause();
    this.notificationSound.currentTime = 0;
    this.hideReminderModal();
  }

  checkOfflineHydrationStatus() {
    if (this.waterLogs.length === 0) return;
    const lastLog = this.waterLogs[this.waterLogs.length - 1];
    const now = new Date();
    const lastLogTime = new Date(lastLog.timestamp);
    const hoursSinceLastDrink = (now - lastLogTime) / (1000 * 60 * 60);
    if (hoursSinceLastDrink > (this.notificationIntervalMinutes / 60) * 2) {
      setTimeout(() => {
        this.showInfoModal(
          `Bem-vindo de volta, ${this.user.name}!`,
          `Parece que faz um tempo que você não registra seu consumo de água. Vamos voltar a se hidratar! 💧`
        );
      }, 1500);
    }
  }

  initializeParticles() {
    this.particleCanvas = document.getElementById("particle-canvas");
    this.particleCtx = this.particleCanvas.getContext("2d");
    this.particleCanvas.width = window.innerWidth;
    this.particleCanvas.height = window.innerHeight;
    window.addEventListener("resize", () => {
      this.particleCanvas.width = window.innerWidth;
      this.particleCanvas.height = window.innerHeight;
    });
  }

  triggerWaterAnimation() {
    const particleCount = 40;
    const isFirstAnimation = this.particles.length === 0;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(this.particleCtx));
    }
    if (isFirstAnimation) {
      this.animateParticles();
    }
  }

  animateParticles() {
    this.particleCtx.clearRect(
      0,
      0,
      this.particleCanvas.width,
      this.particleCanvas.height
    );
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      this.particles[i].draw();
      if (this.particles[i].isDead()) {
        this.particles.splice(i, 1);
      }
    }
    if (this.particles.length > 0) {
      requestAnimationFrame(this.animateParticles.bind(this));
    } else {
      this.particleCtx.clearRect(
        0,
        0,
        this.particleCanvas.width,
        this.particleCanvas.height
      );
    }
  }

  showAchievements() {
    this.renderAchievements();
    document.getElementById("achievements-modal").style.display = "flex";
  }

  hideAchievements() {
    document.getElementById("achievements-modal").style.display = "none";
  }

  renderAchievements() {
    const container = document.getElementById("achievements-list");
    const unlocked = this.allAchievements.filter((ach) =>
      this.unlockedAchievements.includes(ach.id)
    );

    if (unlocked.length === 0) {
      container.innerHTML = `
                <div class="empty-timeline">
                    <svg class="empty-icon" viewBox="0 0 24 24"><path d="M16 8v-2a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2zm-4 6h-2v-2h2v2zm2-7V5h-4v2h4z"/></svg>
                    <p>Nenhuma conquista desbloqueada ainda.</p>
                    <p>Continue se hidratando para ganhar novas conquistas!</p>
                </div>`;
      return;
    }

    container.innerHTML = unlocked
      .map((ach) => {
        const tierClass = ach.tier.toLowerCase();
        return `
                <div class="achievement-item unlocked ${tierClass}">
                    <div class="achievement-icon">${ach.icon}</div>
                    <div class="achievement-details">
                        <div class="achievement-title">${ach.name}</div>
                        <div class="achievement-desc">${ach.description}</div>
                    </div>
                </div>
            `;
      })
      .join("");
  }

  unlockAchievement(id) {
    if (!this.unlockedAchievements.includes(id)) {
      this.unlockedAchievements.push(id);
      const achievement = this.allAchievements.find((a) => a.id === id);
      if (achievement) {
        this.showInfoModal(
          `🏆 Conquista Desbloqueada!`,
          `Você ganhou a conquista "${achievement.name}"!`
        );
      }
      this.saveData();
    }
  }

  checkAllAchievements() {
    if (!this.user || this.waterLogs.length === 0) return;
    const totalLogs = this.waterLogs.length;
    const totalConsumed = this.waterLogs.reduce(
      (sum, log) => sum + log.amount,
      0
    );
    const todayProgress = this.getTodayProgress();
    const uniqueDaysWithLogs = [
      ...new Set(this.waterLogs.map((log) => log.date)),
    ];
    const consumptionByDay = uniqueDaysWithLogs.reduce((acc, date) => {
      acc[date] = this.waterLogs
        .filter((log) => log.date === date)
        .reduce((sum, log) => sum + log.amount, 0);
      return acc;
    }, {});
    const firstLogDate = new Date(this.waterLogs[0].timestamp);
    const daysSinceFirstLog = Math.ceil(
      Math.abs(new Date() - firstLogDate) / (1000 * 60 * 60 * 24)
    );

    this.allAchievements.forEach((ach) => {
      if (this.unlockedAchievements.includes(ach.id)) return;

      let conditionMet = false;

      switch (ach.id) {
        case "B01":
          conditionMet = totalLogs > 0;
          break;
        case "B02":
          conditionMet = Object.values(consumptionByDay).some(
            (total) => total >= this.user.dailyGoal
          );
          break;
        case "B03":
          conditionMet = this.streak >= 3;
          break;
        case "B04":
          conditionMet = this.streak >= 7;
          break;
        case "B05":
          conditionMet = totalLogs >= 10;
          break;
        case "B06":
          conditionMet = totalLogs >= 25;
          break;
        case "B07":
          conditionMet = totalConsumed >= 10000;
          break;
        case "B08":
          conditionMet = this.waterLogs.some(
            (log) => new Date(log.timestamp).getHours() < 9
          );
          break;
        case "B09":
          conditionMet = this.waterLogs.some((log) => {
            const h = new Date(log.timestamp).getHours();
            return h >= 12 && h < 18;
          });
          break;
        case "B10":
          conditionMet = this.waterLogs.some(
            (log) => new Date(log.timestamp).getHours() >= 20
          );
          break;
        case "B11":
          conditionMet = this.waterLogs.some((log) => {
            const day = new Date(log.timestamp).getDay();
            return day === 0 || day === 6;
          });
          break;
        case "B12":
          conditionMet = this.waterLogs.some((log) => log.isCustom);
          break;
        case "B13":
          break;
        case "B14":
          conditionMet = this.waterLogs.some((log) => log.amount <= 100);
          break;
        case "B15":
          conditionMet = this.waterLogs.some((log) => log.amount >= 1000);
          break;
        case "B16":
          conditionMet = uniqueDaysWithLogs.length >= 5;
          break;
        case "B17":
          conditionMet = Object.values(consumptionByDay).some(
            (total) => total >= this.user.dailyGoal + 500
          );
          break;
        case "B18":
          conditionMet = uniqueDaysWithLogs.some(
            (date) =>
              new Date(date).getDay() === 1 &&
              consumptionByDay[date] >= this.user.dailyGoal
          );
          break;
        case "B19":
          conditionMet = todayProgress.percentage >= 50;
          break;
        case "B20":
          conditionMet = daysSinceFirstLog >= 7;
          break;
        case "S01":
          conditionMet = this.streak >= 15;
          break;
        case "S02":
          conditionMet = totalLogs >= 50;
          break;
        case "S03":
          conditionMet = totalLogs >= 100;
          break;
        case "S04":
          conditionMet = totalConsumed >= 25000;
          break;
        case "S05":
          conditionMet = totalConsumed >= 50000;
          break;
        case "S06":
          conditionMet = this.checkPerfectWeek();
          break;
        case "S07":
          conditionMet = Object.values(consumptionByDay).some(
            (total) => total >= this.user.dailyGoal * 2
          );
          break;
        case "S08":
          conditionMet = this.checkConsecutiveLogDays(
            5,
            (log) => new Date(log.timestamp).getHours() < 9
          );
          break;
        case "S09":
          conditionMet = this.checkConsecutiveLogDays(
            5,
            (log) => new Date(log.timestamp).getHours() >= 20
          );
          break;
        case "S10":
          conditionMet = Object.values(consumptionByDay).some(
            (total) => Math.abs(total - this.user.dailyGoal) <= 10
          );
          break;
        case "S11":
          conditionMet = Object.keys(consumptionByDay).some(
            (date) => this.waterLogs.filter((l) => l.date === date).length >= 5
          );
          break;
        case "S12":
          conditionMet = Object.keys(consumptionByDay).some(
            (date) => this.waterLogs.filter((l) => l.date === date).length >= 10
          );
          break;
        case "S13":
          conditionMet = Object.values(consumptionByDay).some(
            (total) => total > 4000
          );
          break;
        case "S14":
          conditionMet = daysSinceFirstLog >= 14;
          break;
        case "S15":
          conditionMet = uniqueDaysWithLogs.length >= 15;
          break;
        case "S16":
          conditionMet =
            this.unlockedAchievements.filter((id) => id.startsWith("B"))
              .length >= 10;
          break;
        case "S17":
          conditionMet =
            this.unlockedAchievements.filter((id) => id.startsWith("B"))
              .length >= 20;
          break;
        case "S18":
          conditionMet = this.checkHourlyLogs(4);
          break;
        case "S19":
          conditionMet = this.checkPerfectWeekend();
          break;
        case "S20":
          break;
        case "G01":
          conditionMet = this.streak >= 30;
          break;
        case "G02":
          conditionMet = totalLogs >= 250;
          break;
        case "G03":
          conditionMet = totalLogs >= 500;
          break;
        case "G04":
          conditionMet = totalConsumed >= 75000;
          break;
        case "G05":
          conditionMet = totalConsumed >= 100000;
          break;
        case "G06":
          conditionMet = this.checkPerfectStreak(14);
          break;
        case "G07":
          conditionMet = this.checkPerfectStreak(21);
          break;
        case "G08":
          conditionMet = this.checkPerfectStreak(30);
          break;
        case "G09":
          conditionMet = Object.values(consumptionByDay).some(
            (total) => total > 5000
          );
          break;
        case "G10":
          conditionMet = this.checkHourlyLogs(8);
          break;
        case "G11":
          conditionMet =
            [
              ...new Set(
                this.waterLogs
                  .filter((log) => new Date(log.timestamp).getHours() < 9)
                  .map((log) => log.date)
              ),
            ].length >= 15;
          break;
        case "G12":
          conditionMet =
            [
              ...new Set(
                this.waterLogs
                  .filter((log) => new Date(log.timestamp).getHours() >= 20)
                  .map((log) => log.date)
              ),
            ].length >= 15;
          break;
        case "G13":
          conditionMet = uniqueDaysWithLogs.length >= 30;
          break;
        case "G14":
          break;
        case "G15":
          conditionMet =
            this.unlockedAchievements.filter((id) => id.startsWith("S"))
              .length >= 10;
          break;
        case "G16":
          conditionMet =
            this.unlockedAchievements.filter((id) => id.startsWith("S"))
              .length >= 20;
          break;
        case "G17":
          conditionMet = Object.values(consumptionByDay).some(
            (total) => total >= this.user.dailyGoal * 3
          );
          break;
        case "G18":
          conditionMet = this.checkConsecutiveLogDays(30);
          break;
        case "G19":
          conditionMet = this.settings.notificationsEnabled && this.streak >= 7;
          break;
        case "G20":
          conditionMet = this.unlockedAchievements.length >= 59;
          break;
        case "E01":
          conditionMet = Object.keys(this.friendConnections).length > 0;
          break;
        case "E02":
          conditionMet = Object.keys(this.friendsData).some(
            (friend) => friend.goalReached
          );
          break;
        case "E03":
          conditionMet =
            todayProgress.percentage >= 100 &&
            Object.values(this.friendsData).some(
              (friend) => friend.goalReached
            );
          break;
        case "E04":
          conditionMet = Object.keys(this.friendConnections).length >= 3;
          break;
        case "E05":
          conditionMet = Object.values(this.friendsData).some(
            (friend) => friend.logs && friend.logs.length > 0
          );
          break;
      }

      if (conditionMet) {
        this.unlockAchievement(ach.id);
      }
    });
  }

  checkPerfectStreak(numDays) {
    if (this.streak < numDays) return false;
    const sortedDays = [...new Set(this.waterLogs.map((log) => log.date))]
      .sort()
      .slice(-numDays);
    if (sortedDays.length < numDays) return false;

    return sortedDays.every((date) => {
      const dayTotal = this.waterLogs
        .filter((log) => log.date === date)
        .reduce((sum, log) => sum + log.amount, 0);
      return dayTotal >= this.user.dailyGoal;
    });
  }

  checkPerfectWeek() {
    let sunday = new Date();
    sunday.setDate(sunday.getDate() - sunday.getDay());
    for (let i = 0; i < 7; i++) {
      const dayToCheck = new Date(sunday);
      dayToCheck.setDate(sunday.getDate() - i);
      const dateString = dayToCheck.toISOString().split("T")[0];
      const dayTotal = this.waterLogs
        .filter((log) => log.date === dateString)
        .reduce((sum, log) => sum + log.amount, 0);
      if (dayTotal < this.user.dailyGoal) return false;
    }
    return true;
  }

  checkConsecutiveLogDays(numDays, filterFn = () => true) {
    const relevantLogs = this.waterLogs.filter(filterFn);
    const uniqueDays = [...new Set(relevantLogs.map((log) => log.date))].sort();
    if (uniqueDays.length < numDays) return false;

    for (let i = 0; i <= uniqueDays.length - numDays; i++) {
      let isConsecutive = true;
      for (let j = 0; j < numDays - 1; j++) {
        const current = new Date(uniqueDays[i + j]);
        const next = new Date(uniqueDays[i + j + 1]);
        if ((next - current) / (1000 * 3600 * 24) !== 1) {
          isConsecutive = false;
          break;
        }
      }
      if (isConsecutive) return true;
    }
    return false;
  }

  checkHourlyLogs(numHours) {
    const todayLogs = this.getTodayProgress().logs;
    if (todayLogs.length === 0) return false;

    const hoursWithLogs = [
      ...new Set(todayLogs.map((log) => new Date(log.timestamp).getHours())),
    ].sort((a, b) => a - b);
    if (hoursWithLogs.length < numHours) return false;

    for (let i = 0; i <= hoursWithLogs.length - numHours; i++) {
      let isConsecutive = true;
      for (let j = 0; j < numHours - 1; j++) {
        if (hoursWithLogs[i + j + 1] - hoursWithLogs[i + j] !== 1) {
          isConsecutive = false;
          break;
        }
      }
      if (isConsecutive) return true;
    }
    return false;
  }

  checkPerfectWeekend() {
    const today = new Date();
    let lastSaturday = new Date(today);
    lastSaturday.setDate(today.getDate() - today.getDay() - 1);
    let lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - today.getDay());

    const satString = lastSaturday.toISOString().split("T")[0];
    const sunString = lastSunday.toISOString().split("T")[0];

    const satTotal = this.waterLogs
      .filter((log) => log.date === satString)
      .reduce((sum, log) => sum + log.amount, 0);
    const sunTotal = this.waterLogs
      .filter((log) => log.date === sunString)
      .reduce((sum, log) => sum + log.amount, 0);

    return satTotal >= this.user.dailyGoal && sunTotal >= this.user.dailyGoal;
  }

  getAchievementsList() {
    return [
      {
        id: "B01",
        name: "Primeira Gota",
        description: "Faça seu primeiro registro de consumo de água.",
        tier: "Bronze",
        icon: "💧",
      },
      {
        id: "B02",
        name: "Meta do Dia",
        description: "Atinja sua meta diária de hidratação pela primeira vez.",
        tier: "Bronze",
        icon: "🎯",
      },
      {
        id: "B03",
        name: "Trio Hidratado",
        description: "Mantenha uma sequência de 3 dias atingindo a meta.",
        tier: "Bronze",
        icon: "🥉",
      },
      {
        id: "B04",
        name: "Semana Quase Perfeita",
        description: "Mantenha uma sequência de 7 dias atingindo a meta.",
        tier: "Bronze",
        icon: "📅",
      },
      {
        id: "B05",
        name: "Colecionador de Gotas",
        description: "Faça 10 registros de consumo de água.",
        tier: "Bronze",
        icon: "🔟",
      },
      {
        id: "B06",
        name: "Entusiasta",
        description: "Faça 25 registros de consumo.",
        tier: "Bronze",
        icon: "🧑‍🔬",
      },
      {
        id: "B07",
        name: "Dez Litros!",
        description: "Consuma um total de 10 litros de água.",
        tier: "Bronze",
        icon: "🌊",
      },
      {
        id: "B08",
        name: "Madrugador",
        description: "Registre água antes das 9h da manhã.",
        tier: "Bronze",
        icon: "☀️",
      },
      {
        id: "B09",
        name: "Bebedor Vespertino",
        description: "Registre água entre 12h e 18h.",
        tier: "Bronze",
        icon: "🏙️",
      },
      {
        id: "B10",
        name: "Coruja Hidratada",
        description: "Registre água após as 20h.",
        tier: "Bronze",
        icon: "🌙",
      },
      {
        id: "B11",
        name: "Fim de Semana Saudável",
        description: "Registre água em um sábado ou domingo.",
        tier: "Bronze",
        icon: "🎉",
      },
      {
        id: "B12",
        name: "Personalizado",
        description: "Use a função de adicionar quantidade personalizada.",
        tier: "Bronze",
        icon: "✍️",
      },
      {
        id: "B13",
        name: "Curioso",
        description: "Visite a tela de configurações.",
        tier: "Bronze",
        icon: "⚙️",
      },
      {
        id: "B14",
        name: "Pequeno Gole",
        description: "Adicione um registro de 100ml ou menos.",
        tier: "Bronze",
        icon: "🤏",
      },
      {
        id: "B15",
        name: "Garrafona",
        description: "Adicione um registro de 1000ml ou mais de uma vez.",
        tier: "Bronze",
        icon: "🫙",
      },
      {
        id: "B16",
        name: "Consistência é a Chave",
        description: "Registre água por 5 dias diferentes.",
        tier: "Bronze",
        icon: "🗓️",
      },
      {
        id: "B17",
        name: "Superando Limites",
        description: "Supere sua meta diária em 500ml.",
        tier: "Bronze",
        icon: "💪",
      },
      {
        id: "B18",
        name: "Semana Iniciada",
        description: "Atinja sua meta em uma segunda-feira.",
        tier: "Bronze",
        icon: "🚀",
      },
      {
        id: "B19",
        name: "Meio Caminho Andado",
        description: "Atinja 50% da sua meta diária.",
        tier: "Bronze",
        icon: "🌗",
      },
      {
        id: "B20",
        name: "Primeira Semana",
        description: "Complete 7 dias de uso do aplicativo.",
        tier: "Bronze",
        icon: "1️⃣",
      },
      {
        id: "S01",
        name: "Quinze Dias de Glória",
        description: "Mantenha uma sequência de 15 dias atingindo a meta.",
        tier: "Silver",
        icon: "🥈",
      },
      {
        id: "S02",
        name: "Hábito Formado",
        description: "Faça 50 registros de consumo.",
        tier: "Silver",
        icon: "✅",
      },
      {
        id: "S03",
        name: "Mestre dos Registros",
        description: "Faça 100 registros de consumo.",
        tier: "Silver",
        icon: "📈",
      },
      {
        id: "S04",
        name: "Piscina Olímpica",
        description: "Consuma um total de 25 litros de água.",
        tier: "Silver",
        icon: "🏊",
      },
      {
        id: "S05",
        name: "Rio Amazonas",
        description: "Consuma um total de 50 litros de água.",
        tier: "Silver",
        icon: "🏞️",
      },
      {
        id: "S06",
        name: "Semana Perfeita",
        description:
          "Atinja sua meta todos os dias por uma semana (de domingo a sábado).",
        tier: "Silver",
        icon: "🌟",
      },
      {
        id: "S07",
        name: "Dobradinha",
        description: "Beba o dobro da sua meta diária em um único dia.",
        tier: "Silver",
        icon: "✌️",
      },
      {
        id: "S08",
        name: "Regularidade Matinal",
        description: "Registre água antes das 9h por 5 dias seguidos.",
        tier: "Silver",
        icon: "🌅",
      },
      {
        id: "S09",
        name: "Vigilante Noturno",
        description: "Registre água após as 20h por 5 dias seguidos.",
        tier: "Silver",
        icon: "🦉",
      },
      {
        id: "S10",
        name: "Precisão Cirúrgica",
        description: "Atinja sua meta diária com uma margem de apenas 10ml.",
        tier: "Silver",
        icon: "🤏",
      },
      {
        id: "S11",
        name: "Cinco por Dia",
        description: "Faça pelo menos 5 registros em um único dia.",
        tier: "Silver",
        icon: "🖐️",
      },
      {
        id: "S12",
        name: "Dez por Dia",
        description: "Faça pelo menos 10 registros em um único dia.",
        tier: "Silver",
        icon: "🙌",
      },
      {
        id: "S13",
        name: "Atleta Hidratado",
        description: "Beba mais de 4 litros em um único dia.",
        tier: "Silver",
        icon: "🏋️",
      },
      {
        id: "S14",
        name: "Duas Semanas de Foco",
        description: "Use o app por 14 dias.",
        tier: "Silver",
        icon: "2️⃣",
      },
      {
        id: "S15",
        name: "Meio do Mês",
        description: "Mantenha o hábito por 15 dias diferentes.",
        tier: "Silver",
        icon: "🗓️",
      },
      {
        id: "S16",
        name: "Colecionador de Bronze",
        description: "Desbloqueie 10 conquistas de Bronze.",
        tier: "Silver",
        icon: "💼",
      },
      {
        id: "S17",
        name: "Mestre do Bronze",
        description: "Desbloqueie todas as 20 conquistas de Bronze.",
        tier: "Silver",
        icon: "🏆",
      },
      {
        id: "S18",
        name: "Hidratação Pontual",
        description: "Registre água a cada hora, por 4 horas seguidas.",
        tier: "Silver",
        icon: "⏰",
      },
      {
        id: "S19",
        name: "Fim de Semana Duplo",
        description: "Atinja sua meta no sábado e no domingo da mesma semana.",
        tier: "Silver",
        icon: "🎊",
      },
      {
        id: "S20",
        name: "Explorador de Sons",
        description: "Teste um som de notificação diferente nas configurações.",
        tier: "Silver",
        icon: "🎵",
      },
      {
        id: "G01",
        name: "Mês Dourado",
        description: "Mantenha uma sequência de 30 dias atingindo a meta.",
        tier: "Gold",
        icon: "🥇",
      },
      {
        id: "G02",
        name: "Lenda da Hidratação",
        description: "Faça 250 registros de consumo.",
        tier: "Gold",
        icon: "👑",
      },
      {
        id: "G03",
        name: "Divindade da Água",
        description: "Faça 500 registros de consumo.",
        tier: "Gold",
        icon: "⚜️",
      },
      {
        id: "G04",
        name: "Oceano Pessoal",
        description: "Consuma um total de 75 litros de água.",
        tier: "Gold",
        icon: "🐋",
      },
      {
        id: "G05",
        name: "Mar Inteiro",
        description: "Consuma um total de 100 litros de água.",
        tier: "Gold",
        icon: "🌊",
      },
      {
        id: "G06",
        name: "Duas Semanas Perfeitas",
        description: "Atinja sua meta todos os dias por 14 dias seguidos.",
        tier: "Gold",
        icon: "✨",
      },
      {
        id: "G07",
        name: "Três Semanas Impecáveis",
        description: "Atinja sua meta todos os dias por 21 dias seguidos.",
        tier: "Gold",
        icon: "🎇",
      },
      {
        id: "G08",
        name: "Mês Perfeito",
        description: "Atinja sua meta todos os dias durante 30 dias seguidos.",
        tier: "Gold",
        icon: "🗓️",
      },
      {
        id: "G09",
        name: "Maratonista da Hidratação",
        description: "Beba mais de 5 litros em um único dia.",
        tier: "Gold",
        icon: "🏃",
      },
      {
        id: "G10",
        name: "Relógio Suíço",
        description:
          "Registre água a cada hora, por 8 horas seguidas durante o dia.",
        tier: "Gold",
        icon: "🕰️",
      },
      {
        id: "G11",
        name: "Mestre da Manhã",
        description:
          "Registre água antes das 9h por 15 dias diferentes em um mês.",
        tier: "Gold",
        icon: "🌄",
      },
      {
        id: "G12",
        name: "Guardião da Noite",
        description:
          "Registre água após as 20h por 15 dias diferentes em um mês.",
        tier: "Gold",
        icon: "🌌",
      },
      {
        id: "G13",
        name: "Onipresente",
        description: "Use o app todos os dias por um mês.",
        tier: "Gold",
        icon: "🌍",
      },
      {
        id: "G14",
        name: "Arquiteto da Hidratação",
        description:
          "Altere sua meta para manual nas configurações e atinja-a.",
        tier: "Gold",
        icon: "🏗️",
      },
      {
        id: "G15",
        name: "Colecionador de Prata",
        description: "Desbloqueie 10 conquistas de Prata.",
        tier: "Gold",
        icon: "🧐",
      },
      {
        id: "G16",
        name: "Mestre da Prata",
        description: "Desbloqueie todas as 20 conquistas de Prata.",
        tier: "Gold",
        icon: "🎓",
      },
      {
        id: "G17",
        name: "Triplicado!",
        description: "Beba o triplo da sua meta diária em um único dia.",
        tier: "Gold",
        icon: "🔱",
      },
      {
        id: "G18",
        name: "Consistência Absoluta",
        description:
          "Registre pelo menos uma vez por dia durante 30 dias seguidos.",
        tier: "Gold",
        icon: "♾️",
      },
      {
        id: "G19",
        name: "Mestre Zen",
        description:
          "Com as notificações ativas, mantenha uma sequência de 7 dias.",
        tier: "Gold",
        icon: "🧘",
      },
      {
        id: "G20",
        name: "Platina Pura",
        description: "Desbloqueie todas as outras 59 conquistas.",
        tier: "Gold",
        icon: "💎",
      },
      {
        id: "E01",
        name: "Conectados",
        description: "Conecte-se com um amigo pela primeira vez.",
        tier: "Esmeralda",
        icon: "🤝",
      },
      {
        id: "E02",
        name: "Parceria de Sucesso",
        description: "Receba uma notificação de que seu amigo atingiu a meta.",
        tier: "Esmeralda",
        icon: "🧑‍🤝‍🧑",
      },
      {
        id: "E03",
        name: "Dupla Dinâmica",
        description: "Você e um amigo atingem a meta no mesmo dia.",
        tier: "Esmeralda",
        icon: "🚀",
      },
      {
        id: "E04",
        name: "Socializando",
        description: "Conecte-se com 3 amigos simultaneamente.",
        tier: "Esmeralda",
        icon: "👨‍👩‍👦",
      },
      {
        id: "E05",
        name: "Observador",
        description:
          "Veja o primeiro registro de um amigo na timeline compartilhada.",
        tier: "Esmeralda",
        icon: "👀",
      },
    ];
  }

  initializePeer() {
    if (!this.user) return;
    if (this.peer) this.peer.destroy();

    this.peer = new Peer();

    this.peer.on("open", (id) => {
      this.myPeerId = id;
      document.getElementById("my-peer-id").value = id;
      document.getElementById("connection-state").textContent =
        "Status: Online e pronto para conectar.";
    });

    this.peer.on("connection", (conn) => {
      this.setupConnectionEventListeners(conn);
    });

    this.peer.on("error", (err) => {
      document.getElementById(
        "connection-state"
      ).textContent = `Erro: ${err.type}`;
      if (err.type === "network") {
        this.showInfoModal(
          "Erro de Conexão",
          "Não foi possível conectar ao servidor de pares. Verifique sua conexão com a internet."
        );
      }
    });
  }

  connectToFriend(friendPeerId) {
    if (!friendPeerId || !this.peer) return;
    if (this.friendConnections[friendPeerId]) {
      this.showInfoModal("Aviso", "Você já está conectado a este amigo.");
      return;
    }

    const conn = this.peer.connect(friendPeerId, {
      reliable: true,
      metadata: { name: this.user.name },
    });

    this.setupConnectionEventListeners(conn);
  }

  setupConnectionEventListeners(conn) {
    conn.on("open", () => {
      this.friendConnections[conn.peer] = conn;
      if (!this.friendsData[conn.peer])
        this.friendsData[conn.peer] = { logs: [], goalReached: false };

      const { percentage } = this.getTodayProgress();
      this.sendDataToFriend(conn.peer, {
        type: "profile_update",
        payload: { name: this.user.name, percentage: percentage },
      });

      this.unlockAchievement("E01");
      this.updateFriendsList();
      this.updateTimeline();
    });

    conn.on("data", (data) => {
      this.handleReceivedData(conn.peer, data);
    });

    conn.on("close", () => {
      const friendName = this.friendsData[conn.peer]?.name || "um amigo";
      delete this.friendConnections[conn.peer];
      delete this.friendsData[conn.peer];
      this.updateFriendsList();
      this.updateTimeline();
      this.showInfoModal(
        "Conexão Perdida",
        `A conexão com ${friendName} foi perdida.`
      );
    });
  }

  handleReceivedData(peerId, data) {
    const friendName =
      data.payload?.name || this.friendsData[peerId]?.name || "um amigo";
    if (!this.friendsData[peerId])
      this.friendsData[peerId] = { logs: [], goalReached: false };

    switch (data.type) {
      case "profile_update":
        this.friendsData[peerId] = {
          ...this.friendsData[peerId],
          ...data.payload,
        };
        this.updateFriendsList();
        break;
      case "hydration_log":
        this.friendsData[peerId].logs.push(data.payload);
        this.showFriendNotification(
          `${friendName} acabou de beber ${data.payload.amount}ml!`
        );
        this.unlockAchievement("E05");
        this.updateTimeline();
        break;
      case "goal_reached":
        this.friendsData[peerId].goalReached = true;
        this.showFriendNotification(`${friendName} atingiu a meta diária! 🎉`);
        this.unlockAchievement("E02");
        this.checkAllAchievements();
        break;
    }
  }

  sendDataToAllFriends(data) {
    Object.values(this.friendConnections).forEach((conn) => {
      if (conn && conn.open) {
        conn.send(data);
      }
    });
  }

  sendDataToFriend(peerId, data) {
    const conn = this.friendConnections[peerId];
    if (conn && conn.open) {
      conn.send(data);
    }
  }

  broadcastHydration(log) {
    this.sendDataToAllFriends({
      type: "hydration_log",
      payload: log,
    });
  }

  broadcastGoalReached() {
    this.sendDataToAllFriends({ type: "goal_reached" });
  }

  disconnectAll() {
    Object.values(this.friendConnections).forEach((conn) => conn.close());
    this.friendConnections = {};
    this.friendsData = {};
    this.updateFriendsList();
    this.updateTimeline();
  }

  showFriendsModal() {
    document.getElementById("friends-modal").style.display = "flex";
    if (!this.peer || this.peer.destroyed) {
      this.initializePeer();
    }
    this.renderFriendNotificationSettings();
    this.updateFriendsList();
  }

  hideFriendsModal() {
    document.getElementById("friends-modal").style.display = "none";
  }

  renderFriendNotificationSettings() {
    const container = document.getElementById("friend-notification-settings");
    const settings = this.settings.friendNotifications;
    const soundOptions = this.sounds
      .map(
        (sound) =>
          `<option value="${sound.id}" ${
            settings.sound === sound.id ? "selected" : ""
          }>${sound.name}</option>`
      )
      .join("");

    container.innerHTML = `
        <div class="toggle-switch-container">
            <label for="friend-notification-toggle" class="toggle-switch-label">Ativar Notificações de Amigos</label>
            <label class="toggle-switch">
                <input type="checkbox" id="friend-notification-toggle" ${
                  settings.enabled ? "checked" : ""
                }>
                <span class="slider"></span>
            </label>
        </div>
        <div class="form-group" style="margin-top: 1rem;">
            <label for="friend-notification-sound" class="form-label">Som das Notificações</label>
            <select id="friend-notification-sound" class="form-input">${soundOptions}</select>
        </div>
        <div class="form-group">
            <label for="friend-notification-volume" class="form-label">Volume do Som</label>
            <div class="volume-control-container">
                <input type="range" id="friend-notification-volume" class="volume-slider" min="0" max="1" step="0.01" value="${
                  settings.volume
                }">
                <span id="friend-volume-percentage">${Math.round(
                  settings.volume * 100
                )}%</span>
                <button id="test-friend-volume-btn" class="btn-icon" title="Testar som">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>
                </button>
            </div>
        </div>
    `;
    this.attachFriendSettingsListeners();
  }

  copyPeerId() {
    const peerIdInput = document.getElementById("my-peer-id");
    peerIdInput.select();
    document.execCommand("copy");
    this.showInfoModal(
      "Copiado!",
      "Seu código foi copiado para a área de transferência."
    );
  }

  updateFriendsList() {
    const listContainer = document.getElementById("friends-list");
    if (Object.keys(this.friendConnections).length === 0) {
      listContainer.innerHTML = `<p class="empty-list-info">Você não está conectado a nenhum amigo ainda.</p>`;
      return;
    }

    listContainer.innerHTML = Object.entries(this.friendsData)
      .map(([peerId, data]) => {
        const connStatus = this.friendConnections[peerId]?.open
          ? "Conectado"
          : "Conectando...";
        return `
            <div class="friend-item">
                <div class="friend-info">
                    ${data.name || "Amigo Anônimo"}
                    <span class="friend-status">(${(
                      data.percentage || 0
                    ).toFixed(0)}%)</span>
                </div>
                <button class="btn-icon" onclick="window.hydraTrack.disconnectFriend('${peerId}')" title="Desconectar amigo">❌</button>
            </div>
        `;
      })
      .join("");
  }

  disconnectFriend(peerId) {
    if (this.friendConnections[peerId]) {
      this.friendConnections[peerId].close();
    }
  }

  showFriendNotification(message) {
    if (
      !this.settings.friendNotifications.enabled ||
      this.notificationPermission !== "granted"
    )
      return;

    const options = {
      body: message,
      icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2350C878'><path d='M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V18h14v-1.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V18h6v-1.5c0-2.33-4.67-3.5-7-3.5z'/></svg>",
      tag: "hydratrack-friend-" + Date.now(),
      silent: true,
    };
    new Notification("Atividade de Amigo", options);
    this.playFriendSound();
  }
}

class Particle {
  constructor(ctx) {
    this.ctx = ctx;
    this.x = Math.random() * this.ctx.canvas.width;
    this.y = Math.random() * -this.ctx.canvas.height;
    this.size = Math.random() * 3 + 2;
    this.speedX = 0;
    this.speedY = Math.random() * 3 + 2;
    this.gravity = 0.05;
    this.opacity = Math.random() * 0.5 + 0.3;
  }

  update() {
    this.speedY += this.gravity;
    this.y += this.speedY;
  }

  draw() {
    this.ctx.fillStyle = `hsla(195, 100%, 65%, ${this.opacity})`;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  isDead() {
    return this.y > this.ctx.canvas.height + this.size;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.hydraTrack = new HydraTrack();
});
