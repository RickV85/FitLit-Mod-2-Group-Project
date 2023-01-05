let userData;
let sleepData;
let hydroData;
let activityData;

const dataDisplay = document.getElementById('dataDisplay')
const errorMessageDisplay = document.querySelector('.error-message')
const errorMessageId = document.getElementById('errorMessage')

function loadUserData() {
    const userURL = 'http://localhost:3001/api/v1/users';
    return fetch(userURL)
        .then((response) => {
            if (response.ok) {
                return response.json()
            } 
            throw Promise.reject(response)
        })
        .then((data) => {
            dataDisplay.classList.remove('hidden')
            errorMessageDisplay.classList.add('hidden')
            userData = data.userData
            return userData
        })
        .catch((response) => {
            dataDisplay.classList.add('hidden')
            errorMessageDisplay.classList.remove('hidden')
            errorMessageId.innerText = 'Sorry, the server is down. Try again later'
            console.log('Something went wrong: ', response);
        });
}
function loadSleepData() {
    const sleepURL = 'http://localhost:3001/api/v1/sleep';
    return fetch(sleepURL)
        .then((response) => response.json())
        .then((data) => {
            sleepData = data.sleepData;
            return sleepData;
        })
}
function loadHydrationData() {
    const hydrationURL = 'http://localhost:3001/api/v1/hydration';
    return fetch(hydrationURL)
        .then((response) => response.json())
        .then((data) => {
            hydroData = data.hydrationData;
            return hydroData;
        })
}
function loadActivityData() {
    const userURL = 'http://localhost:3001/api/v1/activity';
    return fetch(userURL)
        .then((response) => response.json())
        .then((data) => {
            activityData = data.activityData;
            return activityData;
        })
}
export default { loadUserData, loadSleepData, loadHydrationData, loadActivityData };