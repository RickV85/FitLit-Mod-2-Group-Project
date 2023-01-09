import User from "./User";

class UserRepository {
    constructor(allUserData, hydrationData, sleepData, activityData) {
        this.userData = allUserData;
        this.hydrationData = hydrationData;
        this.sleepData = sleepData;
        this.activityData = activityData;
        this.users = [];
        this.selectedUser;
    }
    initialize(currentUserId) {
        this.userData.forEach(user => {
            let newUser = new User(user);
            this.users.push(newUser);
        });
        this.hydrationData.forEach(hydroData => {
          if (!this.findUser(hydroData.userID)) {
            return;
          } else {
            let user = this.findUser(hydroData.userID);
            user.hydrationData.push(hydroData);
          }
        });
        this.sleepData.forEach(sleepData => {
          if (!this.findUser(sleepData.userID)) {
            return;
          } else {
            let user = this.findUser(sleepData.userID);
            user.sleepData.push(sleepData);
          }
        });
        this.activityData.forEach(actData => {
          if (!this.findUser(actData.userID)) {
            return;
          } else {
            let user = this.findUser(actData.userID);
            user.activityData.push(actData);
          }
        });
        // Helper function to assign selected user
        //if currentUser.id then this.users.find user with id 
        // assign it to selectedUser 
        this.selectedUser = this.findUser(currentUserId) || this.randomizeUser();
        this.userData = null;
        this.hydrationData = null;
        this.sleepData = null;
        this.activityData = null;
    };

    findUser(id) {
      if (!id){
        return false
      }
      let userIdArray = this.users.map(user => {
        return user.id;
        })
        if (userIdArray.includes(id)) {
        return this.users.find(user => {
            return  user.id === id});
        } else {
          return false;
        }
    };

    randomizeUser() {
        let selectedUserIndex = Math.floor(Math.random() * (this.users.length));
        return this.users[selectedUserIndex];
    };

    averageSteps() {
        let averageStepGoal = this.users.reduce((acc, user) => {
            return acc + user.dailyStepGoal;
        }, 0);
        return +(averageStepGoal/this.users.length).toFixed(0);
    };

    calculateAllUserAvgSleep(sleepKey) {
      let dataEntries = 0;
      const allUsersSleep = this.users.reduce((total, user)=> {
        user.sleepData.forEach(dataEntry => { 
          dataEntries++;
          total += dataEntry[sleepKey];
        })
        return total;
      }, 0);
      console.log('allUsersSleep', allUsersSleep)
      console.log('number of user datapoints', dataEntries)
      return +(allUsersSleep / dataEntries).toFixed(1);
    }

    calculateAllUserAvgActivity(date, activity) {
      let usersActivityData = []
      this.users.forEach(user => {
        user.activityData.forEach(userActivity => usersActivityData.push(userActivity))
      })
      let filteredActivityByDate = usersActivityData.filter(user => user.date === date)
      let averageType = filteredActivityByDate.reduce((total, value) => {
        total += value[activity]
        return total
      },0)
     
      return +(averageType/this.users.length).toFixed(0)
    }
}

export default UserRepository;