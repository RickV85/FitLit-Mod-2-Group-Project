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
    const lastIndex = (this[dataProperty].length) - 1;
    this.sortUserArrays(dataProperty);
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
  findSevenDaysAgo(selectedDate){
    return new Date(new Date(selectedDate) - 7 * 24 * 60 * 60 * 1000)
  }
  findWeekHydration(selectedDate) {
    var newArray = this.hydrationData.filter(day => {
      var dateConverted = new Date(day.date);
      return dateConverted > this.findSevenDaysAgo(selectedDate) && dateConverted <= new Date(selectedDate);
    }).sort((day1, day2) => {
      return Date.parse(day1.date) - Date.parse(day2.date);
    });
    return newArray;
  };

  findWeekSleep(selectedDate){
    const weekofSleep = this.sleepData.filter(day => {
      const dateConverted = new Date(day.date);
      return dateConverted > this.findSevenDaysAgo(selectedDate) && dateConverted <= new Date(selectedDate);
    }).sort((day1, day2) => {
      return Date.parse(day1.date) - Date.parse(day2.date);
    });
    return weekofSleep;
  };

  findWeekActiveMinutes(selectedDate) {
    //sevenDay = [{1:0},2,3,4,5,6,{selectedDate:0}] if the previous dates exist, replace the number in the array
    console.log(this.findSevenDaysAgo(selectedDate))
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
