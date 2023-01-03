let userData;
let sleepData;
let hydroData;
let activityData;

function loadUserData() {
    const userURL = 'http://localhost:3001/api/v1/users';
    return fetch(userURL)
        .then((response) => response.json())
        .then((data) => {
            userData = data.userData
            return userData
        })
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
            activityData = data.userData;
            return activityData;
        })
}
export default { loadUserData, loadSleepData, loadHydrationData, loadActivityData };