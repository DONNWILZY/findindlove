






const today = new Date();
const birthday = new Date(2024, 1, 26); 
const name = "GODSWILL EFFIONG";
const hobbies = ["CODING", "TRAVELLING", "READING", "SOLVING PROBLEMS"];


function celebrateBirthday() {
    if (today.getMonth() === birthday.getMonth() && today.getDate() === birthday.getDate()) {
        console.log("Happy birthday, " + name);
        console.log("Today being your birthday, you deserve a break.");
        let noHobbies = "So, no " + hobbies[0].toLowerCase() + ", no " + hobbies[1].toLowerCase() + ", no " + hobbies[2].toLowerCase() + ", no " + hobbies[3].toLowerCase();
        console.log(noHobbies);
        console.log("But hey, I'm want to enjoy myself");
    } else {
        console.log("Today is not your birthday. Have a great day anyway, " + name);
    }
}

// Call the function
celebrateBirthday();
