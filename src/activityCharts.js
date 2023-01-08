import { Chart, elements } from "chart.js/auto";
import { userRepo } from './scripts';

const stepChart = document.getElementById("stepCompChart").getContext('2d');
const sleepChart = document.getElementById("weeksSleepChart").getContext('2d');
const hydroDayChart = document.getElementById("todaysHydrationChart").getContext('2d');
const hydroWeekChart = document.getElementById("weeksHydrationChart").getContext('2d');
const stepsWeekChart = document.getElementById("weeksStepsChart").getContext('2d');
const minutesActiveWeekChart = document.getElementById("weeksMinutesActiveChart").getContext('2d')
const flightsOfStairsChart = document.getElementById("weeksFlightsOfStairsChart").getContext('2d')
const activityDayChart = document.getElementById("dayStepsChart").getContext('2d');
const minCompChart = document.getElementById("minCompChart").getContext('2d');


let todaysActivityChart;
let stepComparisonChart;
let minComparisonChart;
let weeksStepChart;
let weeksMinutesActivityChart;
let weeksflightsOfStairsChart;
let sleepDblDataChart;
let todaysHydroChart;
let weeksHydroChart;

const findStepsPercentage = (numSteps, goal) => {
    return numSteps < goal ? goal - numSteps : 0;
};

const updateDaysActivityChart = () => {
    const todaysDate = userRepo.selectedUser.findLatestDate('activityData');
    const daySteps = userRepo.selectedUser.findDayActivity(todaysDate, 'numSteps');
    const goal = userRepo.selectedUser.dailyStepGoal;
    const stepsLeft = findStepsPercentage(daySteps, goal);
    todaysActivityChart = new Chart(activityDayChart, {
        type: 'doughnut',
        data: {
            labels: ['Today\'s Steps', 'Your Daily Goal'],
            datasets: [
                {
                    data: [daySteps, stepsLeft],
                    backgroundColor: ['#BF1363', '#F39237']
                }
            ],
        }
    })
};

const updateStepChart = () => {
    const today = userRepo.selectedUser.findLatestDate('activityData');
    const userSteps = userRepo.selectedUser.findDayActivity(today, 'numSteps');
    const avgSteps = userRepo.calculateAllUserAvgActivity(today, 'numSteps');
    const userGoal = userRepo.selectedUser.dailyStepGoal;
    const avgGoal = userRepo.averageSteps();
    
    stepComparisonChart = new Chart(stepChart, {
        type: 'bar',
        data: {
            datasets: [{
                label: 'Actual Steps',
                data: [userSteps, avgSteps],
                backgroundColor: ['#F39237', '#BF1363'],
                order: 2
            }, {
                label: 'Step Goals',
                data: [userGoal, avgGoal],
                type: 'line',
                backgroundColor: ['#78C1E7'],
                order: 1
            }],
            labels: ['Your Steps', 'Average Steps']
        },
        options: {
            responsive: true, 
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    //display: false
                    position: 'bottom'  
                },
            },
        }
    })
};


const updateMinChart = () => {
    const today = userRepo.selectedUser.findLatestDate('activityData');
    const userMinutes = userRepo.selectedUser.findDayActivity(today, 'minutesActive');
    const avgMinutes = userRepo.calculateAllUserAvgActivity(today, 'minutesActive');
    minComparisonChart = new Chart(minCompChart, {
        type: 'bar',
        data: {
            labels: ['Your Activity', 'Average Activity'],
            datasets: [{

                label: 'Step Goal',
                data: [userMinutes, avgMinutes],
                backgroundColor: ['#F39237', '#BF1363'],
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
};

//if the weeksHydration and weeksSleep methods can be made into 1 dynamic method, this could be a helper method for both sleep and hydration chart
const assignSleepChartData = (date, sleepKey) => {
    return userRepo.selectedUser.findWeekData(date, 'sleepData').map(element => {
        if(element) {
            return element[sleepKey]
        }
        return null;
    })
};
//^^helper function for the datasets for the below function
const updateSleepChart = () => {
    const todaysDate = userRepo.selectedUser.findLatestDate('sleepData');
    const hoursSleptWeek = assignSleepChartData(todaysDate, 'hoursSlept');
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
};

const findHydroPercentage = (numDrunk, goal) => {
    return numDrunk < goal ? goal - numDrunk : 0;
};

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
};

const assignHydrationChartData = (date) => {
    return userRepo.selectedUser.findWeekData(date, 'hydrationData').map(element => {
        if(element) {
            return element.numOunces
        }
    return null;
    })
};

const updateHydroWeeklyChart = () => {
    const todaysDate = userRepo.selectedUser.findLatestDate('hydrationData');
    const chartData = assignHydrationChartData(todaysDate);
    weeksHydroChart = new Chart(hydroWeekChart, {
        type: 'bar',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'today'], 
            datasets: [
                {
                    label: 'Daily Intake in Ounces',
                    data: chartData,
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

function destroyCharts() {
    todaysActivityChart.destroy();
    stepComparisonChart.destroy();
    minComparisonChart.destroy();
    sleepDblDataChart.destroy();
    todaysHydroChart.destroy();
    weeksHydroChart.destroy();  
    weeksStepChart.destroy();
    weeksMinutesActivityChart.destroy();
    weeksflightsOfStairsChart.destroy();
    //add weekly charts to destroy
}

const assignActivityChartData = (date, activityKey) => {
    return userRepo.selectedUser.findWeekData(date, 'activityData').map(element => {
        if(element) {
            return element[activityKey]
        }
        return null;
    })
};

const updateStepsWeeklyChart = () => {
    const todaysDate = userRepo.selectedUser.findLatestDate('activityData');
    const numStepsData = assignActivityChartData(todaysDate, 'numSteps');
    weeksStepChart = new Chart(stepsWeekChart, {
        type: 'bar',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'today'], 
            datasets: [
                {
                    label: 'Daily Steps',
                    data: numStepsData,
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

const updateMinutesActiveWeeklyChart = () => {
    const todaysDate = userRepo.selectedUser.findLatestDate('activityData');
    const minutesActiveData = assignActivityChartData(todaysDate, 'minutesActive');
    weeksMinutesActivityChart = new Chart(minutesActiveWeekChart , {
        type: 'bar',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'today'], 
            datasets: [
                {
                    label: 'Daily Minutes Active',
                    data: minutesActiveData,
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


const updateStairsClimbedWeeklyChart = () => {
    const todaysDate = userRepo.selectedUser.findLatestDate('activityData');
    const flightsOfStairsData = assignActivityChartData(todaysDate, 'flightsOfStairs');
    weeksflightsOfStairsChart = new Chart(flightsOfStairsChart, {
        type: 'bar',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'today'], 
            datasets: [
                {
                    label: 'Daily Flights of Stairs Climbed',
                    data: flightsOfStairsData,
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

// const assignActivityChartData = (date) => {
//     return userRepo.selectedUser.INSERT-METHOD-NAME-HERE(date).map(element => {
//         if(element) {
//             return element[sleepKey]
//         }
//     return null;
//     })
// };
// const updateActivityWeekChart = () => {
//     const todaysDate = userRepo.selectedUser.findLatestDate('activityData');
//     const chartData = assignActivityChartData(todaysDate);
//     weeksActivityChart = new Chart(activityWeekChart, {
//         type: 'line',
//         data: {
//             labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'today'], //change this to be more clear about what date is which and make sure the selected date is the last date
//             datasets: [
//                 {
//                     label: 'Daily Steps',
//                     data: chartData,
//                     type: 'line',
//                     backgroundColor: ['#BF1263'],
//                 }
//             ],
//         },
//         options: {
//             responsive: true, 
//         maintainAspectRatio: false,
//         }
//     })
// }

export default { updateHydroDateChart, updateStepChart, updateSleepChart, updateHydroWeeklyChart, updateDaysActivityChart, updateMinChart, updateStepsWeeklyChart, updateMinutesActiveWeeklyChart, updateStairsClimbedWeeklyChart, destroyCharts}; 

