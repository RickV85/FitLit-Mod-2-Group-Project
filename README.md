# FitLit


### Learning Goals:
- Implement ES6 classes that communicate to each other as needed.
- Use object and array prototype methods to perform data manipulation.
- Create a dashboard that is easy to use and displays information in a clear way.
- Implement a robust testing suite using TDD.
- Work with a local server and make network requests to API endpoints to retrieve and manipulate data.


### Abstract:
Tracking progress while going through your health and wellness journey can be difficult and complicated. Fortunately FitLit is here to save the day! Through this web app user data can be collected, stored, and displayed to the user in truly meaningful ways. By using FitLit you can track a user's progress on important health aspects like step goals, sleep, and hydration while also being able to compare them to user averages for all three categories. 

### Installation Instructions:
- Fork the repository found here: https://github.com/smithkirsten/fitlit-group-project  
- Clone down your new, forked repo. While cloning, name it what you want your local repo to be named, and run `git clone`. 
- cd into the repository
- Install NPM packages by running `npm install` in your terminal
- Fork and clone the FitLit-API found [here](https://github.com/RickV85/FitLit-API).
- Follow the set up instructions in the FitLit-API. This will serve as a local server that this program will GET and POST to.
- Start the server by running `npm start` in your terminal.
- After starting the server, navigate to http://localhost:8080/ in your browser to interact with the app.

### Preview of App:

![ezgif com-gif-maker (3)](https://user-images.githubusercontent.com/113728354/211416747-be803b67-56af-4163-9578-84e45594eb17.gif)


### Context:
Faye, Kirsten, Ryan, and Rick all worked on this project for 17 days. We are all in our fifth week in our second module in Turing.

### Technologies Used
- Javascript
- HTML
- CSS 
- Mocha/Chai
- Webpack
- Chart.js

### Contributors:
- [Rick Vermeil (he/him)](https://www.linkedin.com/in/rick-vermeil-b93581159/)
- [Ryan Baer (he/him)](https://www.linkedin.com/in/ryan-baer-33311114a/)
- [Kirsten Smith (they/them)](https://www.linkedin.com/in/kirsten-stamm-smith/)
- [Faye Rosenshein (she/her)](https://www.linkedin.com/in/faye-rosenshein-8ba421242/) 


### Wins + Challenges:
Some challenges included: 
- Handling inconsitent data, during the first iteration we could expect there to always be a weeks worth of data. In the second iteration the data we were given was much less consitent and lead to the need to refactor a lot of our code related to finding week-long data.
- Fetching data while utilizing promises. Having to understand JavaScript execution context and the call stack in order to have functions call after the data has already been fetched. 
- Chart.js, learning how to utilize a third-party extension

Some wins included:
- Chart.js, we successfully implemented the extension which allowed us to display user data in a meaningful way.
- Testing in Mocha and Chai, we feel that our tests and test data allowed us to accurately gauge how the code would perform when the website was active
- Post request! We were able to send information to our API and update the DOM to match that updated data accordingly.  
- Project board utilization, we successfully utilized the project board tool, the issues tab, and had very positive and meaningful task delegation and communication by using these tools.

