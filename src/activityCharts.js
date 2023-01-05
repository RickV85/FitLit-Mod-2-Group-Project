import { Chart, elements } from "chart.js/auto";
import { userRepo } from './scripts';

const stepChart = document.getElementById("stepGoalChart").getContext('2d');
const sleepChart = document.getElementById("weeksSleepChart").getContext('2d');
const hydroDayChart = document.getElementById("todaysHydrationChart").getContext('2d');
const hydroWeekChart = document.getElementById("weeksHydrationChart").getContext('2d');

let stepComparisonChart;
let sleepDblDataChart;
let todaysHydroChart;
let weeksHydroChart;

const findHydroPercentage = (numDrunk, goal) => {
    return numDrunk < goal ? goal - numDrunk : 0;
}
const updateHydroDateChart = () => {
    const todaysDate = userRepo.selectedUser.findLatestDate('hydrationData');
    const numDrunk = userRepo.selectedUser.findDaysHydration(todaysDate).numOunces;
    const goal = 64;
    const ozLeft = findHydroPercentage(numDrunk, goal);
    todaysHydroChart = new Chart(hydroDayChart, {
        type: 'doughnut',
        data: {
            labels: ['Today\'s Intake', 'Recommended Daily Intake'],
            datasets: [
                {
                    data: [numDrunk, ozLeft],
                    backgroundColor: ['#BF1363', '#F39237']
                }
            ],
        }
    })
}
const assignHydrationChartData = (date) => {
    return userRepo.selectedUser.findWeekHydration(date).map(element => {
        if(element) {
            return element.numOunces
        }
    return null;
    })
};

const updateHydroWeeklyChart = () => {
    const todaysDate = userRepo.selectedUser.findLatestDate('hydrationData');
    // const weeklyHydration = userRepo.selectedUser.findWeekHydration(todaysDate)
    // weeklyHydration.reverse();
    const chartData = assignHydrationChartData(todaysDate);
    weeksHydroChart = new Chart(hydroWeekChart, {
        type: 'bar',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'today'], //change this to be more clear about what date is which and make sure the selected date is the last date
            datasets: [
                {
                    label: 'Daily Intake in Ounces',
                    data: chartData,
                    // data: [weeklyHydration[0].numOunces, weeklyHydration[1].numOunces, weeklyHydration[2].numOunces, weeklyHydration[3].numOunces, weeklyHydration[4].numOunces, weeklyHydration[5].numOunces, weeklyHydration[6].numOunces],
                    type: 'line',
                    backgroundColor: ['#BF1263'],
                }
            ],
        },
        options: {
            responsive: true, 
        maintainAspectRatio: false,
        }
    })
};

const updateStepChart = () => {
    const userStepGoal = userRepo.selectedUser.dailyStepGoal
    const avgStepGoal = userRepo.averageSteps()
    stepComparisonChart = new Chart(stepChart, {
        type: 'bar',
        data: {
            labels: ['Average Step Goal', 'Your Step Goal'],
            datasets: [{

                label: 'Step Goal',
                data: [avgStepGoal, userStepGoal],
                backgroundColor: ['#BF1363', '#F39237'],
            }]
        },
        options: {
            responsive: true, 
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                },
            },
            plugins: {
                legend: {
                    display: false
                },
            },
        }
    })
}
//if the weeksHydration and weeksSleep methods can be made into 1 dynamic method, this could be a helper method for both sleep and hydration chart
const assignSleepChartData = (date, sleepKey) => {
    return userRepo.selectedUser.findWeekSleep(date).map(element => {
        if(element) {
            return element[sleepKey]
        }
    return null;
    })
};
//^^helper function for the datasets for the below function
const updateSleepChart = () => {
    const todaysDate = userRepo.selectedUser.findLatestDate('sleepData');
    console.log(todaysDate)
    const hoursSleptWeek = assignSleepChartData(todaysDate, 'hoursSlept');
    console.log(hoursSleptWeek)
    const sleepQualityWeek = assignSleepChartData(todaysDate, 'sleepQuality');
    sleepDblDataChart = new Chart(sleepChart, {
        type: 'bar',
        data: {
            datasets: [{
                label: 'Hours Slept',
                data: hoursSleptWeek,
                backgroundColor: ['#78C1E7'],
                order: 2
            }, {
                label: 'Sleep Quality',
                data: sleepQualityWeek,
                type: 'line',
                backgroundColor: ['#BF1263'],
                order: 1
            }],
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'today'] //change this to be more clear about what date is which and make sure the selected date is the last date
        },
        options: {
            responsive: true, 
            maintainAspectRatio: false,
        }
    });
}

export default { updateHydroDateChart, updateStepChart, updateSleepChart, updateHydroWeeklyChart };