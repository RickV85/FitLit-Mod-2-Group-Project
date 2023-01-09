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
let userPromise = apiCalls.loadUserData();
let hydrationPromise = apiCalls.loadHydrationData();
let sleepPromise = apiCalls.loadSleepData();
let activityPromise = apiCalls.loadActivityData();

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
const weekData = document.getElementById('weekData');
const weekMinutesActive = document.getElementById('minutesActive')
const activityChartsButton = document.getElementById('moreActivityDisplayButton')
const activityChartButton2 = document.getElementById('moreActivityDisplayButton2')
const compareActButton = document.getElementById('compareStatsButton');
const compareActButton2 = document.getElementById('compareStatsButton2')
const userActButton = document.getElementById('userStatsButton');
const userActButton2 = document.getElementById('userStatsButton2')
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
const hideFormButtons = document.querySelectorAll('#hide-form')
const dailyStatsSteps = document.querySelectorAll('.daily-stats-steps')
const dailyStatsSleep = document.getElementById('dailyStatsSleep')
const dailyStatsHydro = document.getElementById('dailyStatsHydro')
const noDataSteps = document.querySelectorAll('.no-data-steps')
const noDataSleep = document.getElementById('noDataSleep')
const noDataSleepAvg = document.getElementById('noDataSleepAvg')
const noDataHydro = document.getElementById('noDataHydro')
const submitMessageText = document.getElementById('submit-text')
const submitFormMessage = document.getElementById('submit-form-message')
const allInputs = document.querySelectorAll('.user-input-fields')

// Global variables
let userRepo;
let currentUser;

const profileBackgrounds = ['#F8B195', '#F67280', '#C06C84', '#6C5B7B', '#355C7D', '#99B898', '#FECEAB', '	#FF847C', '#2A363B', '#A8E6CE'];

window.addEventListener('load', function () {
	resolvePromisesUpdateDOM();
	setTodaysDateToMaxDate();
});

userAvatar.addEventListener('click', toggleProfileInfo);
userName.addEventListener('click', toggleProfileInfo);
compareActButton.addEventListener('click', displayCompStepData);
compareActButton2.addEventListener('click', displayCompStepData);
activityChartsButton.addEventListener('click', displayActivityData);
activityChartButton2.addEventListener('click', displayActivityData);
userActButton.addEventListener('click', displayDayStepData);
userActButton2.addEventListener('click', displayDayStepData);
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
	postInputs(event, 'activity');
  clearAllInputValues();
});
hydrationDataEntryForm.addEventListener('submit', (event) => {
	showInputForms(hydrationDataEntryForm);
	postInputs(event, 'hydration');
  clearAllInputValues();
});
sleepDataEntryForm.addEventListener('submit', (event) => {
	showInputForms(sleepDataEntryForm);
	postInputs(event, 'sleep');
  clearAllInputValues();
});

hideFormButtons.forEach(button => {
	button.addEventListener('click', (event) => {
		var formToHide = event.target.closest('.user-data-entry-form')
		formToHide.classList.remove('show')
		formToHide.getAttribute("aria-expanded") === "false" ? formToHide.setAttribute("aria-expanded", "true") : formToHide.setAttribute("aria-expanded", "false");
	})
})


function parseData(values) {
	userRepo = new UserRepository(values[0], values[1], values[2], values[3]);
	userRepo.initialize(currentUser?.id);
	userRepo.selectedUser.findLatestDate();
	currentUser = userRepo.selectedUser;
}

function resolvePromisesUpdateDOM() {
	Promise.all([userPromise, hydrationPromise, sleepPromise, activityPromise])
		.then((values) => {
			parseData(values);
			updateDOM();
			dailyStatsExist(currentUser.latestDate);
		});
}

function dailyStatsExist(date) {
	if (!currentUser.findDayActivity(date, 'numSteps')) {
		dailyStatsSteps.forEach(stat => stat.classList.add('hidden'));
		noDataSteps.forEach(data => data.classList.remove('hidden'));
	} else {
		dailyStatsSteps.forEach(stat => stat.classList.remove('hidden'));
		noDataSteps.forEach(data => data.classList.add('hidden'));
	}
	if (!currentUser.findDaySleepData('hoursSlept', date)) {
		dailyStatsSleep.classList.add('hidden');
		noDataSleep.classList.remove('hidden');
		noDataSleepAvg.classList.remove('hidden');
	} else {
		dailyStatsSleep.classList.remove('hidden');
		noDataSleep.classList.add('hidden');
		noDataSleepAvg.classList.add('hidden');
	}
	if (!currentUser.findDaysHydration(date)) {
		dailyStatsHydro.classList.add('hidden');
		noDataHydro.classList.remove('hidden');
	} else {
		dailyStatsHydro.classList.remove('hidden');
		noDataHydro.classList.add('hidden');
	}
};

function postInputs(event, type) {
	event.preventDefault()
	const inputData = translateInputs(type)
	apiCalls.postUserData(type, inputData)
		.then(data => {
			activityCharts.destroyCharts();
			userPromise = apiCalls.loadUserData();
			hydrationPromise = apiCalls.loadHydrationData();
			sleepPromise = apiCalls.loadSleepData();
			activityPromise = apiCalls.loadActivityData();

			resolvePromisesUpdateDOM();
			displaySubmitMessage('successful');
		})
		.catch(displaySubmitMessage('fail'))
}

function clearAllInputValues() {
  allInputs.forEach(input => {
    input.value = '';
  });
}

function translateInputs(type) {
	let userId = userRepo.selectedUser.id;
	let date;
	let flights;
	let minutes;
	let steps;
	let ounces;
	let hours;
	let quality;
	switch (type) {
		case 'activity':
			date = formatDate(document.getElementById("activityCalendar").value);
			flights = document.getElementById("userFlightsInput").value;
			minutes = document.getElementById("userMinActiveInput").value;
			steps = document.getElementById("userStepInput").value;
			return { userID: userId, date: date, flightsOfStairs: flights, minutesActive: minutes, numSteps: steps }
			break;
		case 'hydration':
			date = formatDate(document.getElementById("hydrationCalendar").value);
			ounces = document.getElementById("userHydroInput").value;
			return { userID: userId, date: date, numOunces: ounces }
			break;
		case 'sleep':
			date = formatDate(document.getElementById("sleepCalendar").value);
			hours = +document.getElementById("userHoursSleptInput").value;
			quality = +document.getElementById("userSleepQualityInput").value;
			return { userID: userId, date: date, hoursSlept: hours, sleepQuality: quality }
			break;
	}
}

function formatDate(ogDate) {
	const decon = ogDate.split("-")
	const day = decon[1]
	if (day.length === 1) {
		decon.splice(1, 1, '0' + day)
	}
	return decon.join("/");
}

function updateDOM() {
	showPersonalizedWelcome();
	showUserInfoDisplay();
	displaySelectedUserInformation();
	displayDayStepData();
	displayHydrationData();
	displaySleepData();
	activityCharts.updateDaysActivityChart();
	activityCharts.updateStepChart();
	activityCharts.updateMinChart();
	activityCharts.updateSleepChart();
	activityCharts.updateHydroDateChart();
	activityCharts.updateHydroWeeklyChart();
	activityCharts.updateStepsWeeklyChart();
	activityCharts.updateMinutesActiveWeeklyChart();
	activityCharts.updateStairsClimbedWeeklyChart();


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
	currentUser.friends.forEach(friend => {
		if (userRepo.findUser(friend)) {
			friendsDisplay.innerHTML += `
            <div class="single-friend">
            <div class="friend-avatar friend-${friend}" style="background-color: ${selectRandom(profileBackgrounds)}" alt="user's friend profile icon">${selectRandom(profileEmojis)}</div> 
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
		friendsDisplay.setAttribute("aria-expanded", "false");
		userProfile.setAttribute("aria-expanded", "true");
	} else {
		friendsDisplay.classList.remove('hidden');
		userProfile.classList.add('hidden');
		friendsDisplay.setAttribute("aria-expanded", "true");
		userProfile.setAttribute("aria-expanded", "false");
	};
};

function displayGoalMet(selectedDate) {
	daySteps.innerText = `You've Taken ${userRepo.selectedUser.findDayActivity(selectedDate, 'numSteps')} Steps Today`;
	if (userRepo.selectedUser.checkStepGoal(selectedDate)) {
		userGoalMet.innerText = 'Way to go, you met your goal!';
	} else {
		userGoalMet.innerText = 'Keep moving to meet your goal!';
	};
};

function displayDayStepData() {

	const today = currentUser.latestDate;
	displayGoalMet(today);
	userMiles.innerText = `You have walked ${userRepo.selectedUser.findMilesWalked(today)} miles today`;
	userMinutes.innerText = `${userRepo.selectedUser.findDayActivity(today, 'minutesActive')} minutes of activity total`;
	hideCompStepData();
	hideActivityData();
	userStepsData.classList.remove('hidden');
}

function showDropDownOptions() {
	dropDownOptions.classList.toggle("show")
	dropDownOptions.getAttribute("aria-expanded") === "false" ? dropDownOptions.setAttribute("aria-expanded", "true") : dropDownOptions.setAttribute("aria-expanded", "false");
}

function showInputForms(idOfForm) {
	activityDataEntryForm.classList.remove('show')
	hydrationDataEntryForm.classList.remove('show')
	sleepDataEntryForm.classList.remove('show')
	idOfForm.classList.toggle("show");
	activityDataEntryForm.setAttribute('aria-expanded', 'false')
	hydrationDataEntryForm.setAttribute('aria-expanded', 'false')
	sleepDataEntryForm.setAttribute('aria-expanded', 'false')
	idOfForm.getAttribute("aria-expanded") === "false" ? idOfForm.setAttribute("aria-expanded", "true") : idOfForm.setAttribute("aria-expanded", "false");
}

function displayCompStepData() {
	displayStepGoalComparison();
	displayStairsComparison();
	hideDayStepData();
	hideActivityData();
	compStepsData.classList.remove('hidden');
};

function displayActivityData() {
	displayActiviteMinutesData();
	hideDayStepData();
	hideCompStepData();
	weekData.classList.remove('hidden');
};

function hideDayStepData() {
	userStepsData.classList.add('hidden');
};

function hideCompStepData() {
	compStepsData.classList.add('hidden');
};

function hideActivityData() {
	weekData.classList.add('hidden')
}

function displayStepGoalComparison() {
	if (userRepo.selectedUser.dailyStepGoal > userRepo.averageSteps()) {
		let stepGoalDiff = userRepo.selectedUser.dailyStepGoal - userRepo.averageSteps();
		stepGoalVsAvg.innerText = `Nice work! Your step goal is
    ${stepGoalDiff} steps above average!`;
	} else {
		let stepGoalDiff = userRepo.averageSteps() - userRepo.selectedUser.dailyStepGoal;
		stepGoalVsAvg.innerText = `Your step goal is ${stepGoalDiff} steps below average. Consider increasing your goal`;
	}
}

function displayStairsComparison() {
	const today = currentUser.latestDate
	stairsAvg.innerText = `The average person climbed ${userRepo.calculateAllUserAvgActivity(today, 'flightsOfStairs')} flights of stairs today`
	stairsUser.innerText = `You climbed ${userRepo.selectedUser.findDayActivity(today, 'flightsOfStairs')}`
}

function displayActiviteMinutesData() {
	const today = currentUser.latestDate
	weekMinutesActive.innerText = `You were active for an average of ${currentUser.findWeekAvgActiveMinutes(today)} minutes this week`
};

function displayHydrationData() {
	const lastHydration = currentUser.latestDate;
	const lastHydrationOunces = currentUser.findDaysHydration(lastHydration).numOunces;
	const goal = 64;
	hydrationToday.innerText = `You have consumed ${lastHydrationOunces} ounces of water today!`;
	if (lastHydrationOunces < goal) {
		hydrationGoal.innerText = `Only ${goal - lastHydrationOunces} to go!`;
	} else {
		hydrationGoal.innerText = 'You have met the daily recommendation, great job!';
	}
};


function displaySleepData() {
	const today = currentUser.latestDate;
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

  Daily Step Goal: ${currentUser.dailyStepGoal} steps

  Stride Length: ${currentUser.strideLength} feet`;
}

function setTodaysDateToMaxDate() {
	let today = new Date();

	let dd = String(today.getDate()).padStart(2, '0');
	let mm = String(today.getMonth() + 1).padStart(2, '0');
	let yyyy = today.getFullYear();

	today = `${yyyy}-${mm}-${dd}`;

	activityCalendar.setAttribute("max", today);
	hydrationCalendar.setAttribute("max", today);
	sleepCalendar.setAttribute("max", today);
}

function displaySubmitMessage(status) {
	activityDataEntryForm.classList.remove('show')
	hydrationDataEntryForm.classList.remove('show')
	sleepDataEntryForm.classList.remove('show')
	submitFormMessage.classList.remove('hidden')
	submitMessageText.classList.remove('hidden')
	if (status === 'successful') {
		submitMessageText.innerText = 'Data Succesfully Saved!'
	} else {
		submitMessageText.innerHTML = 'Data was not Saved'
	}
	setTimeout(hideSubmitMessage, 3000)
}

function hideSubmitMessage() {
	submitFormMessage.classList.add('hidden')
	submitMessageText.classList.add('hidden')
}

export { userRepo, currentUser };