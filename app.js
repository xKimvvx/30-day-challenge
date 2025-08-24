// Constants and Configuration
const CONFIG = {
    MAX_DAYS: 30,
    STORAGE_KEYS: {
        CHALLENGE_DATA: 'fitnessChallengeData',
        COMMITMENT: 'commitmentMade',
        VIEW: 'challengeView'
    },
    DEFAULT_VIEW: 'today'
};

// State Management Class
class ChallengeState {
    constructor() {
        this.data = null;
        this.currentView = localStorage.getItem(CONFIG.STORAGE_KEYS.VIEW) || CONFIG.DEFAULT_VIEW;
        this.viewedDayNumber = 1;
    }

    init() {
        const savedData = localStorage.getItem(CONFIG.STORAGE_KEYS.CHALLENGE_DATA);
        if (savedData) {
            try {
                this.data = JSON.parse(savedData);
                return true;
            } catch (e) {
                console.error('Error loading saved data:', e);
                return false;
            }
        }
        return false;
    }

    save() {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEYS.CHALLENGE_DATA, JSON.stringify(this.data));
            return true;
        } catch (e) {
            console.error('Error saving data:', e);
            return false;
        }
    }
}

// UI Manager Class
class UIManager {
    constructor(state) {
        this.state = state;
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.elements = {
            screens: {
                landing: document.getElementById('landing-screen'),
                setup: document.getElementById('setup-screen'),
                main: document.getElementById('main-screen')
            }
        };
    }

    bindEvents() {
        document.addEventListener('click', this.handleGlobalClicks.bind(this));
        this.setupInputHandlers();
    }

    handleGlobalClicks(e) {
        const target = e.target;
        
        if (target.matches('.toggle-task-btn')) {
            this.handleTaskToggle(target);
        } else if (target.matches('.weekly-session-icon')) {
            this.handleWeeklyProgress(target);
        }
    }

    setupInputHandlers() {
        const debounce = (fn, delay) => {
            let timeoutId;
            return (...args) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => fn.apply(this, args), delay);
            };
        };

        const handleNotesInput = debounce((e) => {
            if (e.target.matches('.notes-input')) {
                this.updateNotes(e.target);
            }
        }, 300);

        document.addEventListener('input', handleNotesInput);
    }

    updateUI() {
        this.updateProgress();
        this.updateStreak();
        this.updateTrackers();
        this.renderCurrentView();
    }
}

// Challenge Manager Class
class ChallengeManager {
    constructor(state, ui) {
        this.state = state;
        this.ui = ui;
    }

    createNewChallenge(config) {
        return {
            challenges: this.generateDailyChallenges(config.tasks),
            mainGoal: config.mainGoal,
            weeklyGoals: config.weeklyGoals,
            mainGoalProgress: { history: [] },
            weeklyProgress: this.initializeWeeklyProgress(),
            startDate: new Date().toISOString(),
            lastCompletedDay: 0,
            celebrated: false
        };
    }

    generateDailyChallenges(tasks) {
        return Array.from({ length: CONFIG.MAX_DAYS }, (_, i) => ({
            day: i + 1,
            allTasksComplete: false,
            tasks: tasks.map(text => ({ text, completed: false })),
            notes: ''
        }));
    }

    initializeWeeklyProgress() {
        return {
            cardio: { weeks: new Array(5).fill(0) },
            strength: { weeks: new Array(5).fill(0) },
            selfcare: { weeks: new Array(5).fill(0) }
        };
    }
}

// Animation and Effects Manager
class EffectsManager {
    static async celebrate() {
        try {
            const confetti = (await import('canvas-confetti')).default;
            confetti({
                particleCount: 150,
                spread: 90,
                origin: { y: 0.6 }
            });
        } catch (e) {
            console.error('Error loading confetti:', e);
        }
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    const state = new ChallengeState();
    const ui = new UIManager(state);
    const challenge = new ChallengeManager(state, ui);

    if (state.init()) {
        ui.showMainScreen();
        ui.updateUI();
    } else if (localStorage.getItem(CONFIG.STORAGE_KEYS.COMMITMENT)) {
        ui.showSetupScreen();
    } else {
        ui.showLandingScreen();
    }
});