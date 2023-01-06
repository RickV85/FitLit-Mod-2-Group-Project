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
const compareActButton = document.getElementById('compareStatsButton');
const userActButton = document.getElementById('userStatsButton');
const stairsAvg = document.getElementById('stairsAvg');
const stairsUser = document.getElementById('stairsUser');

const hydrationToday = document.getElementById('dayHydroHeader');
const hydrationGoal = document.getElementById('hydrationGoal');

const sleepToday = document.getElementById('sleepToday');
const sleepUserAvg = document.getElementById('sleepUserAvg');
const sleepGlobalAvg = document.getElementById('sleepGlobalAvg');
const dropDownButton = document.getElementById('dropdown-button')
const dropDownOptions = document.getElementById('dropdown-content')
const stepsInputButton = document.getElementById('steps-selection')
const hydrationInputButton = document.getElementById('hydration-selection')
const sleepInputButton = document.getElementById('sleep-selection')
const activityDataEntryForm = document.getElementById('activityDataEntryForm')
const hydrationDataEntryForm = document.getElementById('hydrationDataEntryForm')
const sleepDataEntryForm = document.getElementById('sleepDataEntryForm')
const activityDataSubmitButton = document.getElementById('activityDataSubmitButton')
const hydroDataSubmitButton = document.getElementById('hydroDataSubmitButton')
const sleepDataSubmitButton = document.getElementById('sleepDataSubmitButton')

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
compareActButton.addEventListener('click', displayCompStepData);//display charts here or in function?
userActButton.addEventListener('click', displayDayStepData); //display charts here or in function?
dropDownButton.addEventListener('click', showDropDownOptions);
stepsInputButton.addEventListener('click', () => {
  showDropDownOptions();
  showInputForms(activityDataEntryForm);
});
hydrationInputButton.addEventListener('click', () => {
  showDropDownOptions();
  showInputForms(hydrationDataEntryForm);
});
sleepInputButton.addEventListener('click', () => {
  showDropDownOptions();
  showInputForms(sleepDataEntryForm);
});
activityDataEntryForm.addEventListener('submit', (event) => {
  showInputForms(activityDataEntryForm);
  userDataSubmit(activityDataSubmitButton, event);
});
hydrationDataEntryForm.addEventListener('submit', (event) => {
  showInputForms(hydrationDataEntryForm);
  userDataSubmit(hydroDataSubmitButton, event);
});
sleepDataEntryForm.addEventListener('submit', (event) => {
  showInputForms(sleepDataEntryForm);
  userDataSubmit(sleepDataSubmitButton, event);
});



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
    //charts need to be updated on page load even if they are hidden
    //charts will need to be "destroyed" (chartElement.destroy()) before they can be updated after a POST request
        //might have to import the chart elements themselves for that? or create new queries here...
    activityCharts.updateDaysActivityChart();
    activityCharts.updateStepChart();
    activityCharts.updateMinChart();
    activityCharts.updateSleepChart();
    activityCharts.updateHydroDateChart();
    activityCharts.updateHydroWeeklyChart();
};

function showPersonalizedWelcome() {
    let selectedMsg = selectRandom(randomGreetings);
    welcomeMessage.innerText = `Welcome, ${currentUser.name}! ${selectedMsg}`;
};

function selectRandom(selectedArray) {
    return selectedArray[Math.floor(Math.random() * selectedArray.length)];
};

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
    };
};

function displayGoalMet(selectedDate) {
    daySteps.innerText = `You've Taken ${userRepo.selectedUser.findDayActivity(selectedDate, 'numSteps')} Steps Today`;
    if(userRepo.selectedUser.checkStepGoal(selectedDate)) {
        userGoalMet.innerText = 'Way to go, you met your goal!';
    } else {
        userGoalMet.innerText = 'Keep moving to meet your goal!';
    };
};

function displayDayStepData() {

    const today = userRepo.selectedUser.findLatestDate('activityData');
    displayGoalMet(today);
    userMiles.innerText = `You have walked ${userRepo.selectedUser.findMilesWalked(today)} miles today`;
    userMinutes.innerText = `${userRepo.selectedUser.findDayActivity(today, 'minutesActive')} minutes of activity total`;
    
    //display weeks activity charts

    hideCompStepData();
    userStepsData.classList.remove('hidden');
}

function showDropDownOptions(){
    dropDownOptions.classList.toggle("show")
}

function showInputForms(idOfForm) {
  idOfForm.classList.toggle("show");
}

function userDataSubmit(idOfButton, event) {
  // event.preventDefault();
  
  // const formData = new FormData(this);
  // console.log(formData);
  
// Not sure what to do here yet or if we need this function
// There seems to be ways to post directly from the input form and submit button.
// I left the empty fields in the submit buttons that can post.
}

function displayCompStepData() {
    displayStepGoalComparison();
    displayStairsComparison();
    hideDayStepData();
    compStepsData.classList.remove('hidden');
};

function hideDayStepData() {
    userStepsData.classList.add('hidden');
};

function hideCompStepData() {
    compStepsData.classList.add('hidden');
};

function showDropDownOptions(){
    dropDownOptions.classList.toggle("show");
};

function displayStepGoalComparison() {
  if (userRepo.selectedUser.dailyStepGoal > userRepo.averageSteps()) {
    let stepGoalDiff =  userRepo.selectedUser.dailyStepGoal - userRepo.averageSteps();
    stepGoalVsAvg.innerText = `Nice work! Your step goal is
    ${stepGoalDiff} steps above average!`;
  } else {
    let stepGoalDiff =  userRepo.averageSteps() - userRepo.selectedUser.dailyStepGoal;
    stepGoalVsAvg.innerText = `Your step goal is ${stepGoalDiff} steps below average. Consider increasing your goal`;
  }
}

function displayStairsComparison() {
    const today = userRepo.selectedUser.findLatestDate('activityData')
    stairsAvg.innerText = `The average person climbed ${userRepo.calculateAllUserAvgActivity(today, 'flightsOfStairs')} flights of stairs today`
    stairsUser.innerText = `You climbed ${userRepo.selectedUser.findDayActivity(today, 'flightsOfStairs')}`
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