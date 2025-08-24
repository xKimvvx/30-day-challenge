// Type definitions for better code organization
interface ChallengeData {
    challenges: DayChallenge[];
    mainGoal: MainGoal;
    weeklyGoals: WeeklyGoal[];
    mainGoalProgress: GoalProgress;
    weeklyProgress: WeeklyProgress;
    startDate: string;
    lastCompletedDay: number;
    celebrated: boolean;
}

interface DayChallenge {
    day: number;
    allTasksComplete: boolean;
    tasks: Task[];
    notes: string;
}

interface Task {
    text: string;
    completed: boolean;
}

interface MainGoal {
    show: boolean;
    title: string;
    hasTracker: boolean;
    target: number;
}

interface WeeklyGoal {
    id: string;
    show: boolean;
    title: string;
    target: number;
    icon: string;
}

interface GoalProgress {
    history: number[];
}

interface WeeklyProgress {
    [key: string]: {
        weeks: number[];
    };
}