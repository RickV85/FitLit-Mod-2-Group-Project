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
    console.log(this.sleepData)
    const weekofSleep = this.sleepData.filter(day => {
      const dateConverted = new Date(day.date);
      console.log('is day within past 7 days', day, dateConverted > this.findSevenDaysAgo(selectedDate) && dateConverted <= new Date(selectedDate))
      return dateConverted > this.findSevenDaysAgo(selectedDate) && dateConverted <= new Date(selectedDate);
    }).sort((day1, day2) => {
      return Date.parse(day1.date) - Date.parse(day2.date);
    });
    console.log('user.js line 64 weekofSleep', weekofSleep)
    //add conditional return that asks the length of the array and if it is less than 7, we add values of 0
    if(weekofSleep.length === 7) {
      return weekofSleep;
    } else {
      //this.findSevenDaysAgo(selectedDate) to find 7 days ago
      //create an array of raw dates that begins with seven says ago and ends with selectedDate
      //iterate through array
      //
    }
  };
};


export default User;
