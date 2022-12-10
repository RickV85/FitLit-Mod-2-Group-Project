// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS file
import './html-css/styles.css';
import activityCharts from './activityCharts';
import apiCalls from './apiCalls';
import UserRepository from './UserRepository';
// import updateHydroDateChart from './activityCharts';
// import { todaysHydroChart } from './activityCharts'

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'

// Query Selectors
const userPromise = apiCalls.loadUserData()
const hydrationPromise = apiCalls.loadHydrationData()
const sleepPromise = apiCalls.loadSleepData()
const welcomeMessage = document.querySelector('#welcomeMessage')
const friendsDisplay = document.querySelector('#friends')
const stepGoal = document.querySelector('#stepGoal')
const stepGoalVsAvg = document.querySelector('#stepGoalVsAvg')
const userProfile = document.querySelector('#profile')
const userName = document.querySelector('#userName')
const userAvatar = document.querySelector('#userAvatar')
const hydrationToday = document.getElementById('hydrationToday')
const hydrationGoal = document.getElementById('hydrationGoal')
const sleepToday = document.getElementById('sleepToday')
const sleepUserAvg = document.getElementById('sleepUserAvg')
const sleepGlobalAvg = document.getElementById('sleepGlobalAvg')
// Global variables
let userRepo;
let currentUser

const profileEmojis = ["✌","😂","😝","😁","😱","🔥","🌈","☀","🎀","⚽","🎾","🏁","😡","👿","🐻","🐶","🐬","🐟","😍","😉","😓","😳","💪","💩","💖","🌟","🎉","🌺","🏈","⚾","🏆","👽","💀","🐵","🐮","🐩","🐎","😘","😜","😵","💃","💎","🚀","🌙","⛄","🌊","⛵","🏀","💰","👶","👸","🐰","🐷","🐍","🐫","🚲",]
const profileBackgrounds = ['#F8B195','#F67280','#C06C84','#6C5B7B','#355C7D','#99B898','#FECEAB','	#FF847C','#2A363B','#A8E6CE']

window.addEventListener('load', function () {
    Promise.all([userPromise, hydrationPromise, sleepPromise])
        .then((values) => {
            userRepo = new UserRepository(values[0], values[1], values[2])
            userRepo.initialize()
            currentUser = userRepo.selectedUser
            showPersonalizedWelcome();
            showUserInfoDisplay();
            displayUserStepGoal();
            displayStepGoalComparison();
            displaySelectedUserInformation();
            displayHydrationData();
            displaySleepData();
            activityCharts.updateHydroDateChart();
            activityCharts.updateStepChart(); //update charts upon page load
            activityCharts.updateSleepChart();
            activityCharts.updateHydroWeeklyChart();
        });
});

userAvatar.addEventListener('click', toggleProfileInfo)
userName.addEventListener('click', toggleProfileInfo)

// Welcome message display
function showPersonalizedWelcome() {
  let selectedMsgInt = Math.floor(Math.random() * (2 - 0 + 1));
  let randomGreetings = [`Let's Carpe this Diem!`, `You miss 100% of the shots you don't take.`, `You can have results or excuses, not both.`];
  welcomeMessage.innerText = `Welcome, ${userRepo.selectedUser.name}! - - ${randomGreetings[selectedMsgInt]}`;
}

function selectRandom(selectedArray){
  return selectedArray[Math.floor(Math.random()*selectedArray.length)];
}

// Info card display
function showUserInfoDisplay() {
  friendsDisplay.innerText = ` `;
  userName.innerText = `${userRepo.selectedUser.name}`
  userAvatar.innerText = selectRandom(profileEmojis)
  userAvatar.style.backgroundColor = selectRandom(profileBackgrounds)
  userRepo.selectedUser.friends.forEach(friend => {
    friendsDisplay.innerHTML += `
    <div class="single-friend">
      <div class="friend-avatar friend-${friend}">${selectRandom(profileEmojis)}</div> 
        ${(userRepo.findUser(friend)).name}
    </div>
    `;
    var friendID = document.querySelector(`.friend-${friend}`)
    friendID.style.backgroundColor = selectRandom(profileBackgrounds)
  })
}

function toggleProfileInfo() {
  if (friendsDisplay.classList != 'hidden'){
    friendsDisplay.classList.add('hidden')
    friendsDisplay.classList.remove("friends-profile")
    userProfile.classList.remove('hidden')
  } else {
    friendsDisplay.classList.remove('hidden')
    friendsDisplay.classList.add('friends-profile')
    userProfile.classList.add('hidden')
  }
}

// User step goal display
function displayUserStepGoal() {
  stepGoal.innerText = `Step goal: ${userRepo.selectedUser.dailyStepGoal} steps per day`;
}

// Step Goal vs. Avg all users
function displayStepGoalComparison() {
  // Added space manually with this interpolation but can fix later with CSS
  stepGoalVsAvg.innerText = `Your step goal: ${userRepo.selectedUser.dailyStepGoal}

  Average Step Goal: ${userRepo.averageSteps()}`
}
// Hydration data display
function displayHydrationData() {
  const today = userRepo.selectedUser.findLatestDate(userRepo.selectedUser.hydrationData)
  const todaysOunces = userRepo.selectedUser.findDaysHydration(today).numOunces;
  const goal = 64;
  hydrationToday.innerText = `You have consumed ${todaysOunces} ounces of water today!`;
  if(todaysOunces < goal){
    hydrationGoal.innerText = `Only ${goal - todaysOunces} to go!`
  }else{
    hydrationGoal.innerText = 'You have met the daily recommendation, great job!';
  }
};

//Sleep data display
function displaySleepData() {
  const today = userRepo.selectedUser.findLatestDate(userRepo.selectedUser.hydrationData);
  let sleepHours = userRepo.selectedUser.findDaySleepHours(today);
  let sleepQuality = userRepo.selectedUser.findDaySleepQuality(today);
  sleepToday.innerText = `${sleepHours} hours | ${sleepQuality} quality`;

  sleepHours = userRepo.selectedUser.averageSleepHours();
  sleepQuality = userRepo.selectedUser.averageSleepQuality();
  sleepUserAvg.innerText = `${sleepHours} hours | ${sleepQuality} quality`;

  sleepHours = userRepo.calculateAllUserAvgSleep('hoursSlept');
  sleepQuality = userRepo.calculateAllUserAvgSleep('sleepQuality');
  sleepGlobalAvg.innerText = `${sleepHours} hours | ${sleepQuality} quality`;
}
// User Profile Information Display
function displaySelectedUserInformation() {
  // Added space manually with this interpolation but can fix later with CSS
  userProfile.innerText = `Mailing Address:
  ${userRepo.selectedUser.address}

  Email Address:
  ${userRepo.selectedUser.email}

  Daily Step Goal:
  ${userRepo.selectedUser.dailyStepGoal} steps

  Stride Length:
  ${userRepo.selectedUser.strideLength} feet`
}

export { userRepo };