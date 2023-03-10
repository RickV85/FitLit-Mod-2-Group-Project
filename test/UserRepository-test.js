import { expect } from 'chai';
import UserRepository from '../src/UserRepository';
import hydrationTestData from './hydration-test-data';
import sleepTestData from './sleep-test-data';
import userTestData from './User-test-data';
import activityTestData from './activity-test-data';

describe('User Repository', () => {
  let fullUserData;
  beforeEach(() => {
  fullUserData = new UserRepository(userTestData, hydrationTestData, sleepTestData, activityTestData);
  });

  it('should be a function', function () {
    expect(UserRepository).to.be.a('function');
  });

  it('should have an instance that takes the parameters for selectedUser,userData, hydrationData,sleepData', function () {
    expect(fullUserData).to.be.an.instanceOf(UserRepository);
  });

  it('should be an array of all user data', function (){
    expect(fullUserData.userData).to.have.lengthOf(3);
    expect(fullUserData.userData).to.deep.equal(userTestData);
  });

  it('should have properties of selectedUser, userData, hydrationData, sleepData', function () {
    expect(fullUserData.userData).to.deep.equal(userTestData);
    expect(fullUserData.hydrationData).to.equal(hydrationTestData);
    expect(fullUserData.sleepData).to.equal(sleepTestData);
  });

  it('should be able to be given an id and return that user\'s data', function () {
    fullUserData.initialize();
    expect(fullUserData.findUser(20)).to.deep.equal({
      "id": 20,
      "name": "Ora O'Connell",
      "address": "79585 Tania Ports, North Lillie MI 38947-4029",
      "email": "Audreanne.Gulgowski6@yahoo.com",
      "strideLength": 3.4,
      "dailyStepGoal": 8000,
      "friends": [2, 12, 11, 33],
      "hydrationData": [
        { userID: 20, date: "2019/06/15", numOunces: 23 },
        { userID: 20, date: "2020/01/21", numOunces: 32 },
        { userID: 20, date: "2019/06/16", numOunces: 80 },
        { userID: 20, date: "2020/01/15", numOunces: 22 },
        { userID: 20, date: "2020/01/16", numOunces: 15 },
        { userID: 20, date: "2020/01/17", numOunces: 21 },
        { userID: 20, date: "2020/01/18", numOunces: 20 },
        { userID: 20, date: "2020/01/19", numOunces: 17 },
        { userID: 20, date: "2020/01/20", numOunces: 22 },
        { userID: 20, date: "2020/01/22", numOunces: 22 },
        { userID: 20, date: "2020/01/23", numOunces: 12 }
      ],
      "sleepData": [
        { userID: 20, date: "2019/06/15", hoursSlept: 5.9, sleepQuality: 1.6},
        { userID: 20, date: "2019/06/16", hoursSlept: 4.3, sleepQuality: 1.4},
        { userID: 20, date: "2019/06/14", hoursSlept: 5.9, sleepQuality: 1.6 },
        { userID: 20, date: "2019/06/13", hoursSlept: 7.8, sleepQuality: 3 },
        { userID: 20, date: "2019/06/12", hoursSlept: 8.5, sleepQuality: 2.5 },
        { userID: 20, date: "2019/06/11", hoursSlept: 6.5, sleepQuality: 2 },
        { userID: 20, date: "2019/06/10", hoursSlept: 7, sleepQuality: 2.8}
      ],
      "activityData": [
        { userID: 20, date: "2019/06/15", numSteps: 9052, minutesActive: 168, flightsOfStairs: 14 },
      { userID: 20, date: "2019/06/16", numSteps: 6269, minutesActive: 126, flightsOfStairs: 32 },
      { userID: 20, date: "2019/06/17", numSteps: 3081, minutesActive: 253, flightsOfStairs: 44 },
      { userID: 20, date: "2019/06/18", numSteps: 7783, minutesActive: 86, flightsOfStairs: 11 },
      { userID: 20, date: "2019/06/19", numSteps: 14356, minutesActive: 50, flightsOfStairs: 26 },
      { userID: 20, date: "2019/06/20", numSteps: 8021, minutesActive: 114, flightsOfStairs: 47 },
      { userID: 20, date: "2019/06/21", numSteps: 13376, minutesActive: 60, flightsOfStairs: 3 },
      { userID: 20, date: "2019/06/22", numSteps: 13094, minutesActive: 285, flightsOfStairs: 4 },
      { userID: 20, date: "2019/06/23", numSteps: 5249, minutesActive: 40, flightsOfStairs: 26 },
      { userID: 20, date: "2019/06/24", numSteps: 2578, minutesActive: 134, flightsOfStairs: 6 }
      ]
    });
  });

  it('should assign the selected user to current user if a current user exists', function() {
    let currentUser = userTestData[1];
    fullUserData.initialize(currentUser.id);
    expect(fullUserData.selectedUser.id).to.equal(21)
  });

  it('should let the user know the user was not found if the user ID is not found', function() {
    expect(fullUserData.findUser(5000)).to.equal(false);
  });

  it('should randomly find an id and use that id to select a user',function () {
    const indexNumber = fullUserData.randomizeUser();
    expect(fullUserData.selectedUser).to.deep.equal(userTestData[indexNumber]);
  });

  it('should calculate average dailyStepGoals for all users', function () {
    fullUserData.initialize();
    expect(fullUserData.averageSteps()).to.equal(6333);
  });

  it('should have a method to average all users sleep hours data available', function() {
    fullUserData.initialize();
    expect(fullUserData.calculateAllUserAvgSleep('hoursSlept')).to.equal(6.8);
  });

  it('should have a method to average all users sleep quality data available', function() {
    fullUserData.initialize();
    expect(fullUserData.calculateAllUserAvgSleep('sleepQuality')).to.equal(2.1);
  });

  it('should return averages for all user activity data stats on a specific date', function () {
    fullUserData.initialize()
    expect(fullUserData.calculateAllUserAvgActivity("2019/06/15", "numSteps")).to.equal(6458)
    expect(fullUserData.calculateAllUserAvgActivity("2019/06/15", "minutesActive")).to.equal(141)
    expect(fullUserData.calculateAllUserAvgActivity("2019/06/15", "flightsOfStairs")).to.equal(29)
  })
});