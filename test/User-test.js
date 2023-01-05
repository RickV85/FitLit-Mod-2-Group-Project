const chai = require("chai");
const expect = chai.expect;

import userTestData from './User-test-data';
import User from '../src/User';
import hydrationTestData from './hydration-test-data';
import sleepTestData from './sleep-test-data';
import activityTestData from './activity-test-data';

describe('User', function () {
  let selectedUser;
  let hydrationData;
  let sleepData;
  let activityData;

  beforeEach(() => {
    selectedUser = new User(userTestData[0]);
    hydrationData = hydrationTestData.filter(data => data.userID === selectedUser.id);
    selectedUser.hydrationData = hydrationData;
    sleepData = sleepTestData.filter(data => data.userID === selectedUser.id);
    selectedUser.sleepData = sleepData;
    activityData = activityTestData.filter(data => data.userID === selectedUser.id);
    selectedUser.activityData = activityData;
  });

  it('should represent a single user', function () {
    expect([selectedUser].length).to.equal(1);
  });

  it('should have a parameter to take in a userData object and instantiate a new User', function () {
    expect(selectedUser).to.be.an.instanceOf(User);
  });

  it('should hold on to the user properties from the data file', function () {
    expect(selectedUser.id).to.equal(userTestData[0].id);
    expect(selectedUser.name).to.equal(userTestData[0].name);
    expect(selectedUser.address).to.equal(userTestData[0].address);
    expect(selectedUser.email).to.equal(userTestData[0].email);
    expect(selectedUser.strideLength).to.equal(userTestData[0].strideLength);
    expect(selectedUser.dailyStepGoal).to.equal(userTestData[0].dailyStepGoal);
    expect(selectedUser.friends).to.deep.equal(userTestData[0].friends);
  });

  it('should have a method to return a user first name', function () {
    const userNameSplitArray = userTestData[0].name.split(' ');
    expect(selectedUser.returnFirstName()).to.equal(userNameSplitArray[0]);
  });

  it('should accept hydration data and store it in an attribute', function () {
    expect(selectedUser.hydrationData).to.deep.equal(hydrationData)
  });

  it('should have a method that returns a single users hydration on a given day', function () {
    expect(selectedUser.findDaysHydration("2019/06/15")).to.deep.equal({
      userID: 20,
      date: "2019/06/15",
      numOunces: 23
    });
  });

  it('should have a method for returning fluid ounces drank per day for a whole week', function () {
    expect(selectedUser.findWeekHydration("2020/01/22")).to.deep.equal([
      { userID: 20, date: '2020/01/16', numOunces: 15 },
      { userID: 20, date: '2020/01/17', numOunces: 21 },
      { userID: 20, date: '2020/01/18', numOunces: 20 },
      { userID: 20, date: '2020/01/19', numOunces: 17 },
      { userID: 20, date: '2020/01/20', numOunces: 22 },
      { userID: 20, date: '2020/01/21', numOunces: 32 },
      { userID: 20, date: '2020/01/22', numOunces: 22 }])
  });

  it('findWeekHydration should return null values for dates that lack hydration data', function() {
    expect(selectedUser.findWeekHydration("2020/01/18")).to.deep.equal(
      [null, null, null, { userID: 20, date: "2020/01/15", numOunces: 22 },
      { userID: 20, date: "2020/01/16", numOunces: 15 },
      { userID: 20, date: "2020/01/17", numOunces: 21 },
      { userID: 20, date: "2020/01/18",numOunces: 20},
      ]
    )
  });

  it('findWeekHydration should return all null values for a full week that lacks hydration data', function() {
    expect(selectedUser.findWeekHydration("2022/1/1")).to.deep.equal(
      [null, null, null, null, null, null, null]
    )
  });

  it('should be able to sort hydration data by date', function () {
    selectedUser.sortUserArrays('hydrationData')
    expect(selectedUser.hydrationData).to.deep.equal([
      { userID: 20, date: '2019/06/15', numOunces: 23 },
      { userID: 20, date: '2019/06/16', numOunces: 80 },
      { userID: 20, date: '2020/01/15', numOunces: 22 },
      { userID: 20, date: '2020/01/16', numOunces: 15 },
      { userID: 20, date: '2020/01/17', numOunces: 21 },
      { userID: 20, date: '2020/01/18', numOunces: 20 },
      { userID: 20, date: '2020/01/19', numOunces: 17 },
      { userID: 20, date: '2020/01/20', numOunces: 22 },
      { userID: 20, date: '2020/01/21', numOunces: 32 },
      { userID: 20, date: '2020/01/22', numOunces: 22 },
      { userID: 20, date: '2020/01/23', numOunces: 12 }
    ]);
  });

  it('should be able to sort sleep data by date', function () {
    selectedUser.sortUserArrays('sleepData');
    expect(selectedUser.sleepData).to.deep.equal([
      { userID: 20, date: '2019/06/10', hoursSlept: 7, sleepQuality: 2.8 },
      { userID: 20, date: '2019/06/11', hoursSlept: 6.5, sleepQuality: 2 },
      { userID: 20, date: '2019/06/12', hoursSlept: 8.5, sleepQuality: 2.5 },
      { userID: 20, date: '2019/06/13', hoursSlept: 7.8, sleepQuality: 3 },
      { userID: 20, date: '2019/06/14', hoursSlept: 5.9, sleepQuality: 1.6 },
      { userID: 20, date: '2019/06/15', hoursSlept: 5.9, sleepQuality: 1.6 },
      { userID: 20, date: '2019/06/16', hoursSlept: 4.3, sleepQuality: 1.4 }
    ]);
  });

  it('should find the latest date for hydration data', function () {
    expect(selectedUser.findLatestDate('hydrationData')).to.equal('2020/01/23');
  });

  it('should find the latest date for sleep data', function () {
    expect(selectedUser.findLatestDate('sleepData')).to.equal('2019/06/16');
  });

  it('should calculate the avg number of hours slept per night from all user data', function () {
    expect(selectedUser.averageSleepData('hoursSlept')).to.equal(6.6);
  });

  it('should calculate the avg sleep quality per night from all user data', function () {
    expect(selectedUser.averageSleepData('sleepQuality')).to.equal(2.1);
  });

  it('should find the hours slept for a given date', function () {
    expect(selectedUser.findDaySleepData('hoursSlept', '2019/06/16')).to.equal(4.3);
  });

  it('should find the sleep quality for a given date', function () {
    expect(selectedUser.findDaySleepData('sleepQuality', '2019/06/16')).to.equal(1.4);
  });

  it('should find sleep data over any given week', function () {
    expect(selectedUser.findWeekSleep("2019/06/16")).to.deep.equal([
      { userID: 20, date: "2019/06/10", hoursSlept: 7, sleepQuality: 2.8 },
      { userID: 20, date: "2019/06/11", hoursSlept: 6.5, sleepQuality: 2 },
      { userID: 20, date: "2019/06/12", hoursSlept: 8.5, sleepQuality: 2.5 },
      { userID: 20, date: "2019/06/13", hoursSlept: 7.8, sleepQuality: 3 },
      { userID: 20, date: "2019/06/14", hoursSlept: 5.9, sleepQuality: 1.6 },
      { userID: 20, date: "2019/06/15", hoursSlept: 5.9, sleepQuality: 1.6 },
      { userID: 20, date: "2019/06/16", hoursSlept: 4.3, sleepQuality: 1.4 }
    ]);
  });

  it('findweekData should be able to take sleep, hydration, or activity and return values', function () {
    expect(selectedUser.findWeekData("2019/06/16", "sleepData")).to.deep.equal([
      { userID: 20, date: "2019/06/10", hoursSlept: 7, sleepQuality: 2.8 },
      { userID: 20, date: "2019/06/11", hoursSlept: 6.5, sleepQuality: 2 },
      { userID: 20, date: "2019/06/12", hoursSlept: 8.5, sleepQuality: 2.5 },
      { userID: 20, date: "2019/06/13", hoursSlept: 7.8, sleepQuality: 3 },
      { userID: 20, date: "2019/06/14", hoursSlept: 5.9, sleepQuality: 1.6 },
      { userID: 20, date: "2019/06/15", hoursSlept: 5.9, sleepQuality: 1.6 },
      { userID: 20, date: "2019/06/16", hoursSlept: 4.3, sleepQuality: 1.4 }
    ])
    expect(selectedUser.findWeekData("2020/01/22", "hydrationData")).to.deep.equal([
      { userID: 20, date: '2020/01/16', numOunces: 15 },
      { userID: 20, date: '2020/01/17', numOunces: 21 },
      { userID: 20, date: '2020/01/18', numOunces: 20 },
      { userID: 20, date: '2020/01/19', numOunces: 17 },
      { userID: 20, date: '2020/01/20', numOunces: 22 },
      { userID: 20, date: '2020/01/21', numOunces: 32 },
      { userID: 20, date: '2020/01/22', numOunces: 22 }])
    expect(selectedUser.findWeekData("2019/06/24", "activityData")).to.deep.equal([
      { userID: 20, date: "2019/06/18", numSteps: 7783, minutesActive: 86, flightsOfStairs: 11 },
      { userID: 20, date: "2019/06/19", numSteps: 14356, minutesActive: 50, flightsOfStairs: 26 },
      { userID: 20, date: "2019/06/20", numSteps: 8021, minutesActive: 114, flightsOfStairs: 47 },
      { userID: 20, date: "2019/06/21", numSteps: 13376, minutesActive: 60, flightsOfStairs: 3 },
      { userID: 20, date: "2019/06/22", numSteps: 13094, minutesActive: 285, flightsOfStairs: 4 },
      { userID: 20, date: "2019/06/23", numSteps: 5249, minutesActive: 40, flightsOfStairs: 26 },
      { userID: 20, date: "2019/06/24", numSteps: 2578, minutesActive: 134, flightsOfStairs: 6 }
    ])
  })

  it('findWeekData should return null values for dates that lack sleep, hydration, or activity data', function () {
    expect(selectedUser.findWeekData("2019/06/13", "sleepData")).to.deep.equal([
      null, null, null,
      { userID: 20, date: "2019/06/10", hoursSlept: 7, sleepQuality: 2.8 },
      { userID: 20, date: "2019/06/11", hoursSlept: 6.5, sleepQuality: 2 },
      { userID: 20, date: "2019/06/12", hoursSlept: 8.5, sleepQuality: 2.5 },
      { userID: 20, date: "2019/06/13", hoursSlept: 7.8, sleepQuality: 3 },
    ])
    expect(selectedUser.findWeekData("2020/01/18", "hydrationData")).to.deep.equal([
      null, null, null,
      { userID: 20, date: "2020/01/15", numOunces: 22 },
      { userID: 20, date: "2020/01/16", numOunces: 15 },
      { userID: 20, date: "2020/01/17", numOunces: 21 },
      { userID: 20, date: "2020/01/18", numOunces: 20 }
    ])
    expect(selectedUser.findWeekData("2019/06/18", "activityData")).to.deep.equal([
      null, null, null,
      { userID: 20, date: "2019/06/15", numSteps: 9052, minutesActive: 168, flightsOfStairs: 14 },
      { userID: 20, date: "2019/06/16", numSteps: 6269, minutesActive: 126, flightsOfStairs: 32 },
      { userID: 20, date: "2019/06/17", numSteps: 3081, minutesActive: 253, flightsOfStairs: 44 },
      { userID: 20, date: "2019/06/18", numSteps: 7783, minutesActive: 86, flightsOfStairs: 11 }
    ])
  })

  it('findWeekData should return all null values for a full week that lacks data', function () {
    expect(selectedUser.findWeekData("2022/1/1", "sleepData")).to.deep.equal(
      [null, null, null, null, null, null, null]
    )
    expect(selectedUser.findWeekData("2022/1/1", "hydrationData")).to.deep.equal(
      [null, null, null, null, null, null, null]
    )
    expect(selectedUser.findWeekData("2022/1/1", "activityData")).to.deep.equal(
      [null, null, null, null, null, null, null]
    )
  })

  it('findWeekSleep should return null values for dates that lack sleep data', function() {
    expect(selectedUser.findWeekSleep("2019/06/13")).to.deep.equal(
      [null, null, null,
      { userID: 20, date: "2019/06/10", hoursSlept: 7, sleepQuality: 2.8 },
      { userID: 20, date: "2019/06/11", hoursSlept: 6.5, sleepQuality: 2 },
      { userID: 20, date: "2019/06/12", hoursSlept: 8.5, sleepQuality: 2.5 },
      { userID: 20, date: "2019/06/13", hoursSlept: 7.8, sleepQuality: 3 }
      ]
    )
  });

  it('findWeekSleep should return all null values for a full week that lacks sleep data', function() {
    expect(selectedUser.findWeekSleep("2022/1/1")).to.deep.equal(
      [null, null, null, null, null, null, null]
    )
  });

  it('it should have an activityData property that holds activity data', function () {
    expect(selectedUser.activityData).to.deep.equal([
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
    ])
  })

  it('should return miles walked for a given day', function () {
    expect(selectedUser.findMilesWalked("2019/06/15")).to.equal(5.83)
  })

  it('should return number of minutes active for a given day', function () {
    expect(selectedUser.findMinutesActive("2019/06/15")).to.equal(168)
  })

  it('should return the average number of minutes active for a given 7 days', function () {
    expect(selectedUser.findWeekAvgActiveMinutes("2019/06/24")).to.equal(109.9)
  })

  it('findWeekAvgActiveMinutes should work with dates that activitiy was not recorded', function () {
    expect(selectedUser.findWeekAvgActiveMinutes("2019/06/18")).to.equal(90.4)
  })

  it('should return true if a user met their step goal for a specified date', function () {
    expect(selectedUser.checkStepGoal("2019/06/15")).to.equal(true)
    expect(selectedUser.checkStepGoal("2019/06/16")).to.equal(false)
    expect(selectedUser.checkStepGoal("2019/06/14")).to.equal(undefined)
  })

  it('should return an array of dates in which a user exceeded their step goal', function () {
    expect(selectedUser.findDatesOfStepGoalsMet()).to.deep.equal(["2019/06/15", "2019/06/19", "2019/06/20", "2019/06/21", "2019/06/22"])
  })

  it('should return the record highest number of flights of stairs climbed for a user', function () {
    expect(selectedUser.findMostStairsClimbed()).to.equal(47)
  })
});