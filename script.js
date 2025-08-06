class HydraTrack {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 5;
    this.onboardingData = {};
    this.user = null;
    this.waterLogs = [];
    this.achievements = [];
    this.settings = {
      theme: "system",
      unit: "ml",
      soundEnabled: true,
      notificationsEnabled: false,
    };
    this.streak = 0;
    this.isOnboarded = false;

    this.notificationPermission = "default";
    this.notificationTimer = null;
    this.notificationIntervalMinutes = 60;
    this.debugNotifications = true;

    this.notificationSound = new Audio("agua.mp3");
    this.notificationSound.load();

    this.particleCanvas = null;
    this.particleCtx = null;
    this.particles = [];

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
    }

    this.attachEventListeners();
    this.initializeAchievements();
  }

  loadData() {
    try {
      this.user = JSON.parse(localStorage.getItem("hydratrack-user")) || null;
      this.waterLogs =
        JSON.parse(localStorage.getItem("hydratrack-logs")) || [];
      this.achievements =
        JSON.parse(localStorage.getItem("hydratrack-achievements")) ||
        this.getDefaultAchievements();
      this.settings = {
        ...this.settings,
        ...JSON.parse(localStorage.getItem("hydratrack-settings")),
      };
      this.streak = parseInt(localStorage.getItem("hydratrack-streak")) || 0;
      this.isOnboarded =
        localStorage.getItem("hydratrack-onboarded") === "true";
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  saveData() {
    try {
      localStorage.setItem("hydratrack-user", JSON.stringify(this.user));
      localStorage.setItem("hydratrack-logs", JSON.stringify(this.waterLogs));
      localStorage.setItem(
        "hydratrack-achievements",
        JSON.stringify(this.achievements)
      );
      localStorage.setItem(
        "hydratrack-settings",
        JSON.stringify(this.settings)
      );
      localStorage.setItem("hydratrack-streak", this.streak.toString());
      localStorage.setItem("hydratrack-onboarded", this.isOnboarded.toString());
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
        return `
                <div class="step-icon" style="background: var(--gradient-primary);"><svg viewBox="0 0 24 24"><path d="M12 2c1 3 4 6 4 9a4 4 0 0 1-8 0c0-3 3-6 4-9z"/></svg></div>
                <h2 class="step-title">Bem-vindo ao HydraTrack!</h2>
                <p class="step-subtitle">Vamos configurar seu perfil para uma hidratação personalizada.</p>
                <div class="form-group"><label for="user-name" class="form-label">Como podemos te chamar?</label><input type="text" id="user-name" class="form-input" placeholder="Seu nome" value="${
                  this.onboardingData.name || ""
                }"></div>`;
      case 2:
        return `
                <div class="step-icon" style="background: var(--gradient-secondary);"><svg viewBox="0 0 24 24"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7 7-7z"/></svg></div>
                <h2 class="step-title">Seu peso atual</h2><p class="step-subtitle">Usaremos para calcular sua meta ideal.</p>
                <div class="form-group"><label for="user-weight" class="form-label">Peso (kg)</label><input type="number" id="user-weight" class="form-input" placeholder="Ex: 70" min="30" max="200" value="${
                  this.onboardingData.weight || ""
                }"></div>`;
      case 3:
        const activity = this.onboardingData.activityLevel || "moderado";
        return `
                <div class="step-icon" style="background: var(--gradient-accent);"><svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>
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
        return `
                <div class="step-icon" style="background: var(--gradient-primary);"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg></div>
                <h2 class="step-title">Seus horários</h2><p class="step-subtitle">Para lembretes inteligentes no momento certo.</p>
                <div class="time-inputs">
                    <div class="form-group"><label for="wake-time" class="form-label">Acordar</label><input type="time" id="wake-time" class="form-input" value="${
                      this.onboardingData.wakeTime || "07:00"
                    }"></div>
                    <div class="form-group"><label for="sleep-time" class="form-label">Dormir</label><input type="time" id="sleep-time" class="form-input" value="${
                      this.onboardingData.sleepTime || "23:00"
                    }"></div>
                </div>`;
      case 5:
        const weight = this.onboardingData.weight || 70;
        const activityLevel = this.onboardingData.activityLevel || "moderado";
        const calculatedGoal = this.calculateDailyGoal(weight, activityLevel);
        return `
                    <div class="step-icon" style="background: var(--gradient-secondary);"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg></div>
                    <h2 class="step-title">Sua meta diária</h2><p class="step-subtitle">Baseado no seu perfil, calculamos sua meta ideal.</p>
                    <div class="goal-card">
                        <div class="goal-label">Meta sugerida</div><div class="goal-value">${calculatedGoal}ml</div>
                        <div class="goal-calculation">Cálculo: ${weight}kg × 35ml × fator de atividade</div>
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
        this.onboardingData.wakeTime =
          document.getElementById("wake-time")?.value;
        this.onboardingData.sleepTime =
          document.getElementById("sleep-time")?.value;
        break;
      case 5:
        this.onboardingData.customGoalCheck =
          document.getElementById("custom-goal-check")?.checked;
        this.onboardingData.customGoalValue =
          document.getElementById("custom-goal-value")?.value;
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
        return !!data.wakeTime && !!data.sleepTime;
      case 5:
        if (data.customGoalCheck) {
          return data.customGoalValue && parseInt(data.customGoalValue) > 0;
        }
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

    this.notificationSound
      .play()
      .then(() => {
        this.notificationSound.pause();
        this.notificationSound.currentTime = 0;
      })
      .catch(() => {});

    this.requestNotificationPermission().then(() => {
      this.settings.notificationsEnabled =
        this.notificationPermission === "granted";
      this.isOnboarded = true;
      this.saveData();
      this.showDashboard();
    });
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
    const icons = ["💧", "🥤", "🫙", "🍶"];
    const gradients = [
      "--gradient-primary",
      "--gradient-secondary",
      "--gradient-accent",
      "--gradient-primary",
    ];
    container.innerHTML = this.user.quickAmounts
      .map(
        (amount, index) => `
            <button class="quick-btn" data-amount="${amount}" style="background: var(${
          gradients[index % gradients.length]
        })">
                <div class="quick-icon" style="font-size: 2rem;">${
                  icons[index % icons.length]
                }</div>
                <span class="quick-amount">${amount}ml</span>
            </button>
        `
      )
      .join("");
  }

  updateTimeline() {
    const container = document.getElementById("timeline-container");
    const { logs } = this.getTodayProgress();
    if (logs.length === 0) {
      container.innerHTML = `<div class="empty-timeline"><svg class="empty-icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg><p>Nenhum registro hoje ainda.</p><p>Que tal começar agora?</p></div>`;
    } else {
      container.innerHTML = [...logs]
        .reverse()
        .map(
          (log) => `
                <div class="timeline-item">
                    <div class="timeline-content">
                        <div class="timeline-dot"></div>
                        <div><div class="timeline-amount">${
                          log.amount
                        }ml</div><div class="timeline-time">${this.formatTime(
            log.timestamp
          )}</div></div>
                    </div>
                    <button class="timeline-delete" data-log-id="${
                      log.id
                    }">×</button>
                </div>`
        )
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
      html += `
                <div class="week-day ${isToday ? "today" : ""}">
                    <div class="week-label">${weekDays[i]}</div>
                    <div class="week-bar">
                        <div class="week-bar-fill" style="height: ${percentage}%; background: ${
        percentage >= 100 ? "hsl(var(--success))" : "var(--gradient-primary)"
      };"></div>
                    </div>
                    <div class="week-percentage">${percentage.toFixed(0)}%</div>
                </div>
            `;
    }
    container.innerHTML = html;
  }

  addWaterLog(amount) {
    this.triggerWaterAnimation();
    const prevProgress = this.getTodayProgress();
    this.waterLogs.push({
      id: this.generateId(),
      amount: parseInt(amount),
      timestamp: new Date().toISOString(),
      date: this.getTodayDateString(),
    });
    this.saveData();

    this.resetNotificationTimer();

    const newProgress = this.getTodayProgress();
    if (prevProgress.percentage < 100 && newProgress.percentage >= 100) {
      this.showCelebration();
      this.updateStreak();
    }

    this.checkAchievements();
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
    const modal = document.getElementById("settings-modal");
    const content = modal.querySelector(".settings-modal-content");
    content.innerHTML = `
            <div class="settings-group">
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
                <div class="toggle-switch-container">
                    <label for="setting-manual-goal" class="toggle-switch-label">Definir meta manual</label>
                    <label class="toggle-switch"><input type="checkbox" id="setting-manual-goal" ${
                      this.user.isManualGoal ? "checked" : ""
                    }><span class="slider"></span></label>
                </div>
                <div id="setting-goal-input-container" style="display: ${
                  this.user.isManualGoal ? "block" : "none"
                };">
                    <div class="form-group"><label for="setting-goal">Meta Diária (ml)</label><input type="number" id="setting-goal" class="form-input" value="${
                      this.user.dailyGoal
                    }"></div>
                </div>
            </div>
            <div class="settings-group">
                <h3>Notificações</h3>
                <div class="toggle-switch-container">
                    <label for="setting-notifications" class="toggle-switch-label">Ativar lembretes</label>
                    <label class="toggle-switch"><input type="checkbox" id="setting-notifications" ${
                      this.settings.notificationsEnabled ? "checked" : ""
                    }><span class="slider"></span></label>
                </div>
                <p id="notification-permission-status" class="custom-help" style="margin-top: 0.5rem;"></p>
                <div class="form-group">
                    <label for="setting-notification-interval">Intervalo de lembrete (minutos)</label>
                    <input type="number" id="setting-notification-interval" class="form-input" value="${
                      this.notificationIntervalMinutes
                    }" min="15" max="180">
                </div>
            </div>
            <button id="save-settings-btn" class="btn btn-primary">Salvar Alterações</button>
        `;
    modal.style.display = "flex";
    this.attachSettingsListeners();
  }

  hideSettings() {
    document.getElementById("settings-modal").style.display = "none";
  }

  saveSettings() {
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

    if (!this.settings.notificationsEnabled) {
      this.stopNotificationTimer();
    }

    this.saveData();
    this.updateDashboard();
    this.hideSettings();
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
        alert("Por favor, preencha os dados corretamente.");
      }
    });

    document.getElementById("dashboard").addEventListener("click", (event) => {
      const quickBtn = event.target.closest(".quick-btn");
      if (quickBtn) this.addWaterLog(quickBtn.dataset.amount);

      const deleteBtn = event.target.closest(".timeline-delete");
      if (deleteBtn) this.deleteWaterLog(deleteBtn.dataset.logId);
    });
    document.getElementById("add-custom-btn")?.addEventListener("click", () => {
      const amount = document.getElementById("custom-amount").value;
      if (amount && parseInt(amount) > 0) this.addWaterLog(amount);
    });
    document
      .getElementById("custom-amount")
      ?.addEventListener("keypress", (e) => {
        if (e.key === "Enter")
          document.getElementById("add-custom-btn").click();
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

  attachSettingsListeners() {
    document
      .getElementById("save-settings-btn")
      .addEventListener("click", () => this.saveSettings());
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

    this.updatePermissionStatusText();
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

  initializeAchievements() {
    if (this.achievements.length === 0)
      this.achievements = this.getDefaultAchievements();
  }
  getDefaultAchievements() {
    return [];
  }
  checkAchievements() {}

  initializeNotifications() {
    if (!("Notification" in window)) {
      console.log("Este navegador não suporta notificações.");
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
      alert(
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

    const intervalMs = this.debugNotifications
      ? 15000
      : this.notificationIntervalMinutes * 60000;

    this.notificationTimer = setInterval(() => {
      const { consumed, goal } = this.getTodayProgress();
      if (consumed >= goal) {
        this.stopNotificationTimer();
        return;
      }

      const lastLog = this.waterLogs[this.waterLogs.length - 1];
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

      const intervalToCheck = this.debugNotifications
        ? 0.25
        : this.notificationIntervalMinutes;

      if (minutesSinceLastDrink >= intervalToCheck) {
        this.sendNotification(
          "Lembrete de Hidratação",
          `Já faz um tempo que você não bebe água. Que tal um copo agora?`
        );
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
    if (this.notificationPermission !== "granted") {
      console.log(
        "Tentativa de enviar notificação, mas a permissão não foi concedida."
      );
      return;
    }

    const options = {
      body: body,
      icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300bcd4'><path d='M12 2c1 3 4 6 4 9a4 4 0 0 1-8 0c0-3 3-6 4-9z'/></svg>",
      tag: "hydratrack-reminder",
      silent: true,
    };

    new Notification(title, options);

    if (this.settings.soundEnabled) {
      this.playSound();
      this.showReminderModal();
    }
  }

  playSound() {
    this.notificationSound.currentTime = 0;
    this.notificationSound
      .play()
      .catch((e) => console.error("Erro ao tocar som na notificação:", e));
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
    this.notificationSound.pause();
    this.notificationSound.currentTime = 0;
    this.hideReminderModal();
  }

  testNotification() {
    if (this.notificationPermission !== "granted") {
      alert(
        `Não é possível enviar notificação. O navegador está com a permissão definida como: "${this.notificationPermission}".\nTente redefinir as permissões do site.`
      );
      return;
    }

    this.sendNotification(
      "🔔 Teste de Notificação 🔔",
      "Se você vê e ouve isto, está tudo funcionando!"
    );
  }

  checkOfflineHydrationStatus() {
    if (this.waterLogs.length === 0) return;

    const lastLog = this.waterLogs[this.waterLogs.length - 1];
    const now = new Date();
    const lastLogTime = new Date(lastLog.timestamp);
    const hoursSinceLastDrink = (now - lastLogTime) / (1000 * 60 * 60);

    if (hoursSinceLastDrink > (this.notificationIntervalMinutes / 60) * 2) {
      setTimeout(() => {
        alert(
          `Bem-vindo de volta, ${this.user.name}!\n\nParece que faz um tempo que você não registra seu consumo de água. Vamos voltar a se hidratar! 💧`
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
    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(this.particleCtx));
    }
    if (this.particles.length === particleCount) {
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
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
      this.particles[i].draw();
      if (this.particles[i].isDead()) {
        this.particles.splice(i, 1);
        i--;
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
}

class Particle {
  constructor(ctx) {
    this.ctx = ctx;
    this.x = Math.random() * ctx.canvas.width;
    this.y = -20;
    this.size = Math.random() * 5 + 2;
    this.speedY = Math.random() * 3 + 2;
    this.speedX = (Math.random() - 0.5) * 2;
    this.opacity = 1;
    this.color = `hsla(195, 100%, 50%, ${this.opacity})`;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    if (this.y > this.ctx.canvas.height) {
      this.y = -20;
      this.x = Math.random() * this.ctx.canvas.width;
    }
    if (this.opacity > 0.05) {
      this.opacity -= 0.02;
    }
  }

  draw() {
    this.ctx.fillStyle = `hsla(195, 100%, 65%, ${this.opacity})`;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  isDead() {
    return this.opacity <= 0.05;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.hydraTrack = new HydraTrack();
});
