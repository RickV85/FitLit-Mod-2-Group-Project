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
    console.log("user.js line 37", this.sleepData.find(day => day.date === date)[sleepKey]);
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
  
  findWeekHydration(selectedDate) {
    const weekLongArray = []
    for (let i = 6; i > -1 ; i--){
      var singleDate = this.findSevenDays(selectedDate, i)
      weekLongArray.push(singleDate.toString())
    }
    
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
    const weekLongArray = []
    for (let i = 6; i > -1 ; i--){
      var singleDate = this.findSevenDays(selectedDate, i)
      weekLongArray.push(singleDate.toString())
    }

    return weekLongArray.map(day => {
      var date = this.sleepData.find(data => data.date === day) 
      if (date){
        return date
      } 
      return null
    })
  } 
  

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
