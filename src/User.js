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
  //this is relying on userdata to determine what a week is. we can set the week initially and find any dates that match any of those dates 
  //if the userdata doesnt exist, put null or empty object in the array (dynamic for hoursSlept or sleepQuality)
  findWeekSleep(selectedDate){
    //create a dummy array of strings that match the format of the dates in our sleepData
      //dummArray[0] = 7 days prior to the selectedDate and last index is the selectedDate
    
    //dummyArray.map(date => )
      //for each date, find the match within the user's sleepData.
        //if it exists, return the object.
        //if it doesn't exist, return null

    //expected output:
      //[ {1}, {2}, {3}, {4}, {5}, {6}, {7} ] *   { userID: 21, date: "2019/06/16", hoursSlept: 4.8, sleepQuality: 1.3 }
      //OR [null, {1}, {2}, {3}, null...]
      //OR [null, null, null, null...]
   
    const weekofSleep = this.sleepData.filter(day => {
      const dateConverted = new Date(day.date);
      return dateConverted > this.findSevenDaysAgo(selectedDate) && dateConverted <= new Date(selectedDate);
    }).sort((day1, day2) => {
      return Date.parse(day1.date) - Date.parse(day2.date);
    });
    //add conditional return that asks the length of the array and if it is less than 7, we add values of 0
    return weekofSleep; //<-- return the mapped dummy array

    }
  };
};


export default User;
