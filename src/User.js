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
  };

  sortUserArrays(dataProperty) {
    this[dataProperty].sort((day1,day2) => {
        return (day1.date).localeCompare(day2.date);
    });
  };

  returnFirstName() {
    let userNameSplitArray = this.name.split(' ');
    return userNameSplitArray[0];
  };

  findLatestDate(dataProperty) {
    console.log("find latest date for: ", dataProperty)
    const lastIndex = (this[dataProperty].length) - 1;
    console.log("last index: ", lastIndex)
    this.sortUserArrays(dataProperty);
    console.log('returning:', this[dataProperty][lastIndex].date)
    return this[dataProperty][lastIndex].date;
  };

  findDaysHydration(selectedDate) {
    var result = this.hydrationData.find(day => day.date === selectedDate);
    return result;
  };

  findDaySleepData(sleepKey, date) {
    return this.sleepData.find(day => day.date === date)[sleepKey];
  };

  findMilesWalked(selectedDate) {
    //this function could be combined with findMinutesActive
    let stepsWalked = this.activityData.find(day => day.date === selectedDate);
    return Number((stepsWalked.numSteps * this.strideLength / 5280).toFixed(2));
  };
  
  findMinutesActive(selectedDate) {
    let actData = this.activityData.find(day => day.date === selectedDate)
    return actData.minutesActive
  }

  averageSleepData(sleepKey) {
    return Number((this.sleepData.reduce((total, day) => total + day[sleepKey], 0) / this.sleepData.length).toFixed(1));
  };
  findSevenDays(selectedDate, nextDate){
    return new Date(new Date(selectedDate) - (nextDate) * 24 * 60 * 60 * 1000).toISOString().split('T')[0].split("-").join("/")
  }

  createWeekLongArray(selectedDate) {
    const weekLongArray = []
    for (let i = 6; i > -1 ; i--){
      var singleDate = this.findSevenDays(selectedDate, i)
      weekLongArray.push(singleDate.toString())
    }
    return weekLongArray;
  }

// We could combine these next two (possibly 3?) functions with use of a 2nd param
// but I don't want to mess up anything downstream RN
  findWeekHydration(selectedDate) {
    let weekLongArray = this.createWeekLongArray(selectedDate);
    
    return weekLongArray.map(day => {
      var date = this.hydrationData.find(data => data.date === day) 
      if (date){
        return date
      } 
      return null
    })
  };
  //this is relying on userdata to determine what a week is. we can set the week initially and find any dates that match any of those dates
  //if the userdata doesnt exist, put null or empty object in the array (dynamic for hoursSlept or sleepQuality)
  findWeekSleep(selectedDate){
    let weekLongArray = this.createWeekLongArray(selectedDate);

    return weekLongArray.map(day => {
      var date = this.sleepData.find(data => data.date === day) 
      if (date){
        return date
      } 
      return null
    })
  } 
  
  findWeekData(selectedDate, key) {
    console.log(key)
    let weekLongArray = this.createWeekLongArray(selectedDate);

    return weekLongArray.map(day => {
      let date = this[key].find(data => data.date === day) 
      console.log(date)
      if (date){
        return date
      } 
      return null
    })
  }

  findWeekAvgActiveMinutes(selectedDate) {
    let weekLongArray = this.createWeekLongArray(selectedDate);

    let weekOfActivity = weekLongArray.map(day => {
      var date = this.activityData.find(data => data.date === day) 
      if (date){
        return date
      }
      return {minutesActive: 0}
    })

    let weekActivityTotal = weekOfActivity.reduce((total, day) => {
      total += day.minutesActive;
      return total;
    }, 0)

    return Number((weekActivityTotal / 7).toFixed(1));
  }

  checkStepGoal(selectedDate) {
    let actForDate = this.activityData.find(actData => actData.date === selectedDate)
    if (actForDate === undefined) {
      return undefined
    }
    if (this.dailyStepGoal <= actForDate.numSteps) {
      return true
    } else {
      return false
    } 
  }

  findDatesOfStepGoalsMet() {
    let stepGoalArray = this.activityData.filter(data => data.numSteps > this.dailyStepGoal)
    return stepGoalArray.map(arrayElement => arrayElement.date)
  }

  findMostStairsClimbed() {
    this.activityData.sort((a,b) => {
      return b.flightsOfStairs - a.flightsOfStairs
    })
    return this.activityData[0].flightsOfStairs
  }
};

export default User;
