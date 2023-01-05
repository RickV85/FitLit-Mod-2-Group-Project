let userData;
let sleepData;
let hydroData;
let activityData;

const dataDisplay = document.getElementById('dataDisplay')
const errorMessageDisplay = document.querySelector('.error-message')
const errorMessageId = document.getElementById('errorMessage')

function errorHandeling(message, display) {
    if (display === 'error') {
        dataDisplay.classList.add('hidden')
        errorMessageDisplay.classList.remove('hidden')
        errorMessageId.innerText = message
    } else if (display === 'noError') {
        dataDisplay.classList.remove('hidden')
        errorMessageDisplay.classList.add('hidden')
    }
}

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
            errorHandeling('message', 'noError')
            userData = data.userData
            return userData
        })
        .catch((response) => {
            errorHandeling('Sorry, the server is down. Try again later', 'error')
            console.log('Something went wrong: ', response);
        });
}
function loadSleepData() {
    const sleepURL = 'http://localhost:3001/api/v1/sleep';
    return fetch(sleepURL)
    .then((response) => {
        if (response.ok) {
            return response.json()
        }
        throw Promise.reject(response)
    })
        .then((data) => {
            errorHandeling('message', 'noError')
            sleepData = data.sleepData;
            return sleepData;
        })
        .catch((response) => {
            errorHandeling('Sorry, the server is down. Try again later', 'error')
            console.log('Something went wrong: ', response);
        })
}
function loadHydrationData() {
    const hydrationURL = 'http://localhost:3001/api/v1/hydration';
    return fetch(hydrationURL)
    .then((response) => {
        if (response.ok) {
            return response.json()
        }
        throw Promise.reject(response)
    })
        .then((data) => {
            errorHandeling('message', 'noError')
            hydroData = data.hydrationData;
            return hydroData;
        })
        .catch((response) => {
            errorHandeling('Sorry, the server is down. Try again later', 'error')
            console.log('Something went wrong: ', response);
        })
}
function loadActivityData() {
    const userURL = 'http://localhost:3001/api/v1/activity';
    return fetch(userURL)
    .then((response) => {
        if (response.ok) {
            return response.json()
        }
        throw Promise.reject(response)
    })
        .then((data) => {
            errorHandeling('message', 'noError')
            activityData = data.activityData;
            return activityData;
        })
        .catch((response) => {
            errorHandeling('Sorry, the server is down. Try again later', 'error')
            console.log('Something went wrong: ', response);
        })
}
export default { loadUserData, loadSleepData, loadHydrationData, loadActivityData };