class User {
  constructor(userData) {
    this.id = userData.id;
    this.name = userData.name;
    this.address = userData.address;
    this.email = userData.email;
    this.strideLength = userData.strideLength;
    this.dailyStepGoal = userData.dailyStepGoal;
    this.friends = userData.friends;
  };

  returnFirstName() {
    let userNameSplitArray = this.name.split(' ');
    return userNameSplitArray[0];
  };
};
export default User;