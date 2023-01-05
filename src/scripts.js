// File imports
import './styles.css';
import activityCharts from './activityCharts';
import apiCalls from './apiCalls';
import UserRepository from './UserRepository';
import profileEmojis from './data/emojis';
import randomGreetings from './data/randomGreetings';
// Image imports
import './images/walkingIcon.svg';

//Promises
const userPromise = apiCalls.loadUserData();
const hydrationPromise = apiCalls.loadHydrationData();
const sleepPromise = apiCalls.loadSleepData();
const activityPromise = apiCalls.loadActivityData();

// Query Selectors
const welcomeMessage = document.querySelector('#welcomeMessage');
const friendsDisplay = document.querySelector('#friends');
const userProfile = document.querySelector('#profile');
const userName = document.querySelector('#userName');
const userAvatar = document.querySelector('#userAvatar');

const userStepsData = document.getElementById('userData');
const compStepsData = document.getElementById('compData');
const daySteps = document.getElementById('daySteps');
const userGoalMet = document.getElementById('userGoalMet');
const userMinutes = document.getElementById('userMinutes');
const userMiles = document.getElementById('userMiles');
const stepGoalVsAvg = document.querySelector('#stepGoalVsAvg');
const avgWeekMin = document.getElementById('avgWeekMin');
const compareActButton = document.getElementById('compare-stats-button');
const userActButton = document.getElementById('user-stats-button');


const hydrationToday = document.getElementById('dayHydroHeader');
const hydrationGoal = document.getElementById('hydrationGoal');

const sleepToday = document.getElementById('sleepToday');
const sleepUserAvg = document.getElementById('sleepUserAvg');
const sleepGlobalAvg = document.getElementById('sleepGlobalAvg');

// Global variables
let userRepo;
let currentUser;

const profileBackgrounds = ['#F8B195', '#F67280', '#C06C84', '#6C5B7B', '#355C7D', '#99B898', '#FECEAB', '	#FF847C', '#2A363B', '#A8E6CE'];

window.addEventListener('load', function () {
    Promise.all([userPromise, hydrationPromise, sleepPromise, activityPromise])
        .then((values) => {
            parseData(values);
            updateDOM();
        });
});

userAvatar.addEventListener('click', toggleProfileInfo);
userName.addEventListener('click', toggleProfileInfo);
compareActButton.addEventListener('click', displayCompStepData)//display charts here or in function?
userActButton.addEventListener('click', displayDayStepData) //display charts here or in function?



function parseData(values) {
    userRepo = new UserRepository(values[0], values[1], values[2], values[3]);
    userRepo.initialize();
    currentUser = userRepo.selectedUser;
}

function updateDOM() {
    showPersonalizedWelcome();
    showUserInfoDisplay();
    displaySelectedUserInformation();
    
    displayDayStepData();
    
    displayHydrationData();
    displaySleepData();
    activityCharts.updateHydroDateChart();
    activityCharts.updateSleepChart();
    activityCharts.updateHydroWeeklyChart();
}

function showPersonalizedWelcome() {
    let selectedMsg = selectRandom(randomGreetings);
    welcomeMessage.innerText = `Welcome, ${currentUser.name}! ${selectedMsg}`;
}

function selectRandom(selectedArray) {
    return selectedArray[Math.floor(Math.random() * selectedArray.length)];
}

function showUserInfoDisplay() {
    friendsDisplay.innerText = ` `;
    userName.innerText = `${currentUser.name}`;
    userAvatar.innerText = selectRandom(profileEmojis);
    userAvatar.style.backgroundColor = selectRandom(profileBackgrounds);
// Added conditional in case user ID is not found
    currentUser.friends.forEach(friend => {
      if (userRepo.findUser(friend)) {
      friendsDisplay.innerHTML += `
        <div class="single-friend">
        <div class="friend-avatar friend-${friend}" style="background-color: ${selectRandom(profileBackgrounds)}">${selectRandom(profileEmojis)}</div> 
        ${(userRepo.findUser(friend)).name}
        </div>
        `;
      } else {
        friendsDisplay.innerHTML += `
        <div class="single-friend">
        <p> User not found </p>
        `;
      }
    })
}

function toggleProfileInfo() {
    if (!friendsDisplay.classList.contains('hidden')) {
        friendsDisplay.classList.add('hidden');
        userProfile.classList.remove('hidden');
    } else {
        friendsDisplay.classList.remove('hidden');
        userProfile.classList.add('hidden');
    }
}

function displayGoalMet(selectedDate) {
    daySteps.innerText = `You've Taken ${userRepo.selectedUser.findDayActivity(selectedDate, 'numSteps')} Steps Today`;
    if(userRepo.selectedUser.checkStepGoal(selectedDate)) {
        userGoalMet.innerText = 'Way to go, you met your goal!'
    } else {
        userGoalMet.innerText = 'Keep moving to meet your goal!'
    }
}

function displayDayStepData() {
    const today = userRepo.selectedUser.findLatestDate('activityData');
    activityCharts.updateDaysActivityChart();
    displayGoalMet(today);
    userMiles.innerText = `You have walked ${userRepo.selectedUser.findMilesWalked(today)} miles today`;
    userMinutes.innerText = `${userRepo.selectedUser.findDayActivity(today, 'minutesActive')} minutes of activity total`;
    
    //display weeks activity charts

    hideCompStepData();
    userStepsData.classList.remove('hidden');
}

function displayCompStepData() {
    
    //goal comparison
    displayStepGoalComparison();
    activityCharts.updateStepChart();
    //steps comparison

    //minutes comparison
    //stairs comparison
    hideDayStepData();
    compStepsData.classList.remove('hidden')
}

function hideDayStepData() {
    userStepsData.classList.add('hidden');
}

function hideCompStepData() {
    compStepsData.classList.add('hidden')
}

function displayStepGoalComparison() {
  if (userRepo.selectedUser.dailyStepGoal > userRepo.averageSteps()) {
    let stepGoalDiff =  userRepo.selectedUser.dailyStepGoal - userRepo.averageSteps();
    stepGoalVsAvg.innerText = `Nice work! Your step goal is
    ${stepGoalDiff} steps above average!`;
  } else {
    let stepGoalDiff =  userRepo.averageSteps() - userRepo.selectedUser.dailyStepGoal;
    stepGoalVsAvg.innerText = `Your step goal is ${stepGoalDiff} steps below average.

    Consider increasing your goal for your fitness.`;
  }
}

function displayHydrationData() {
    const lastHydration = currentUser.findLatestDate('hydrationData');
    const lastHydrationOunces = currentUser.findDaysHydration(lastHydration).numOunces;
    const goal = 64;
    hydrationToday.innerText = `You have consumed ${lastHydrationOunces} ounces of water today!`;
    if (lastHydrationOunces < goal) {
        hydrationGoal.innerText = `Only ${goal - lastHydrationOunces} to go!`;
    } else {
        hydrationGoal.innerText = 'You have met the daily recommendation, great job!';
    }
};

function displaySleepData() { //this can be refactored with some dynamic helper functions
    const today = currentUser.findLatestDate('sleepData');
    let sleepHours = currentUser.findDaySleepData('hoursSlept', today);
    let sleepQuality = currentUser.findDaySleepData('sleepQuality', today);
    sleepToday.innerText = `${sleepHours} hours | ${sleepQuality} quality`;
    sleepHours = currentUser.averageSleepData('hoursSlept');
    sleepQuality = currentUser.averageSleepData('sleepQuality');
    sleepUserAvg.innerText = `${sleepHours} hours | ${sleepQuality} quality`;
    sleepHours = userRepo.calculateAllUserAvgSleep('hoursSlept')
    sleepQuality = userRepo.calculateAllUserAvgSleep('sleepQuality')
    sleepGlobalAvg.innerText = `${sleepHours} hours | ${sleepQuality} quality`
}

function displaySelectedUserInformation() {
  userProfile.innerText = `Mailing Address:
  ${currentUser.address}

  Email Address:
  ${currentUser.email}

  Daily Step Goal:
  ${currentUser.dailyStepGoal} steps

  Stride Length:
  ${currentUser.strideLength} feet`;
}

export { userRepo };