class User {
  constructor(userData) {
    this.id = userData.id;
    this.name = userData.name;
    this.address = userData.address;
    this.email = userData.email;
    this.strideLength = userData.strideLength;
    this.dailyStepGoal = userData.dailyStepGoal;
    this.friends = userData.friends;
    this.hydrationData = [];
    this.sleepData = [];
    this.activityData = [];
    this.latestDate;
  };

  sortUserArrays(dataProperty) {
    return this[dataProperty].sort((day1,day2) => {
        return (day1.date).localeCompare(day2.date);
    });
  };

  returnFirstName() {
    let userNameSplitArray = this.name.split(' ');
    return userNameSplitArray[0];
  };

  findLatestDate() {
    const sortHydration = this.sortUserArrays('hydrationData')
    const sortSleep = this.sortUserArrays('sleepData')
    const sortActivity = this.sortUserArrays('activityData')
    const latestArray = [sortHydration[sortHydration.length -1], sortSleep[sortSleep.length-1], sortActivity[sortActivity.length-1]]
    const latestArraySorted = latestArray.sort((a, b) => {
      return (a.date).localeCompare(b.date);
    })
    this.latestDate = latestArraySorted[latestArraySorted.length-1].date;
  };

  findDaysHydration(selectedDate) {
    const result = this.hydrationData.find(day => day.date === selectedDate);
    if (result === undefined){
      return false;
    }
    return result;
  };
  
  findDaySleepData(sleepKey, date) {
    const result = this.sleepData.find(day => day.date === date)?.[sleepKey];
    if (result === undefined) {
      return false;
    }
    return result;
  };
  
  findDayActivity(selectedDate, activityKey) {
    let result = this.activityData.find(day => day.date === selectedDate)?.[activityKey];
    if (result === undefined) {
      return false;
    }
    return result;
  };

  averageSleepData(sleepKey) {
    return +(this.sleepData.reduce((total, day) => total + day[sleepKey], 0) / this.sleepData.length).toFixed(1);
  };

  findSevenDays(selectedDate, nextDate){
    return new Date(new Date(selectedDate) - (nextDate) * 24 * 60 * 60 * 1000).toISOString().split('T')[0].split("-").join("/");
  }

  createWeekLongArray(selectedDate) {
    const weekLongArray = [];
    for (let i = 6; i > -1 ; i--){
      const singleDate = this.findSevenDays(selectedDate, i);
      weekLongArray.push(singleDate.toString());
    }
    return weekLongArray;
  }
  
  findMilesWalked(selectedDate) {
    let stepsWalked = this.activityData.find(day => day.date === selectedDate);
    if (stepsWalked === undefined) {
      return false;
    }
    return +(stepsWalked.numSteps * this.strideLength / 5280).toFixed(2);
  };
  
  findMinutesActive(selectedDate) {
    let actData = this.activityData.find(day => day.date === selectedDate)
    return actData.minutesActive
  }
  
  findWeekData(selectedDate, key) {
    let weekLongArray = this.createWeekLongArray(selectedDate);

    return weekLongArray.map(day => {
      let date = this[key].find(data => {
        return data.date === day}) 
      if (date){
        return date;
      } 
      return null;
    })
  }

  findWeekAvgActiveMinutes(selectedDate) {
    const weekLongArray = this.createWeekLongArray(selectedDate);

    const weekOfActivity = weekLongArray.map(day => {
      const date = this.activityData.find(data => data.date === day) 
      if (date){
        return date
      }
      return {minutesActive: 0}
    })

    const weekActivityTotal = weekOfActivity.reduce((total, day) => {
      total += day.minutesActive;
      return total;
    }, 0)

    return +(weekActivityTotal / 7).toFixed(1);
  }

  checkStepGoal(selectedDate) {
    const actForDate = this.activityData.find(actData => actData.date === selectedDate)
    if (actForDate === undefined) {
      return undefined;
    }
    if (this.dailyStepGoal <= actForDate.numSteps) {
      return true;
    } else {
      return false;
    } 
  }

  findDatesOfStepGoalsMet() {
    let stepGoalArray = this.activityData.filter(data => data.numSteps > this.dailyStepGoal);
    return stepGoalArray.map(arrayElement => arrayElement.date);
  }

  findMostStairsClimbed() {
    this.activityData.sort((a,b) => {
      return b.flightsOfStairs - a.flightsOfStairs;
    })
    return this.activityData[0].flightsOfStairs;
  }
};

export default User;
