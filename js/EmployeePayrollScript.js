/*
Applying event listener on name and salary when document is loaded 
*/
window.addEventListener('DOMContentLoaded', (event) => {
    const name = document.querySelector('#name');
    const nameError = document.querySelector('.name-error');
    name.addEventListener('input', function() {
        if(name.value.length == 0) {
            nameError.textContent = "";
            return;
        }
        try {
            (new EmployeePayrollData()).name = name.value;
            nameError.textContent = "";
        } catch (e) {
            nameError.textContent = e;
        }
    });
    const salary = document.querySelector('#salary')
    const output = document.querySelector('.salary-output-text')
    output.textContent = salary.value;
    salary.addEventListener('input', function () {
        output.textContent = salary.value;
    });
});


class EmployeePayrollData{ 
    //properties
    // id;
    // name;
    // profilePic;
    // gender;
    // department;
    // salary;
    // startDate;
    // notes;

    get id() {return this._id;}
    set id(id){
        this._id=id;
    }
    get name(){ return this._name;}
    set name(name){
        let nameRegex = RegExp('^[A-Z]{1}[a-z\\sA-Z]{2,}$')
        if(nameRegex.test(name)) this._name = name;
        else throw "Name is Incorrect!";
    }

    get profilePic() {return this._profilePic;}
    set profilePic(profilePic){
        this._profilePic = profilePic;
    }

    get gender() {return this._gender;}
    set gender(gender){
        this._gender = gender;
    }

    get department() {return this._department;}
    set department(department){
        this._department = department;
    }

    get salary() {return this._salary;}
    set salary(salary){
        this._salary = salary;
    }

    get startDate() {return this._startDate;}
    set startDate(startDate){
        let newDate = new Date(startDate[2], startDate[1],startDate[0]);
        let currDate = new Date();
        if(currDate <= newDate) 
            this._startDate = newDate;
        else throw "Date is Incorrect!"
    }

    get notes() {return this._notes}
    set notes(notes){
        this._notes = notes;
    }

    //toString method
    toString(){
        return "\nId="+this.id+"\nName="+this.name+
                "\nGender="+this.gender+"\nDept="+this.department+
                "\nSalary="+this.salary+"\nStart Date="+ this.startDate
                +"\nNotes="+this.notes;
    }
}

let employees=new Array();
let employeeData = new EmployeePayrollData();

const save = () => {
    try {
        employeeData.name = document.getElementById('name').value;
        employeeData.profilePic = getRadioValue(document.getElementsByName('profile'));
        employeeData.gender = getRadioValue(document.getElementsByName('gender'));
        employeeData.department = getCheckBoxValue(document.getElementsByClassName('department'));
        employeeData.salary = document.getElementById('salary').value;

        let start=new Array();
        start.push(document.getElementById('day').value);
        start.push(document.getElementById('month').value);
        start.push(document.getElementById('year').value);
        employeeData.startDate = start;

        employeeData.notes = document.getElementById('notes').value;
        console.log(employeeData);

        createAndUpdateStorage(employeeData);
        alert(employeeData);
    }
    catch (exception) {
        alert(exception);
    }
    employees.push(employeeData);
}
function createAndUpdateStorage(employeeData) {
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    if(employeePayrollList != undefined)
        employeePayrollList.push(employeeData);
    else
        employeePayrollList = [employeeData];
    alert(employeePayrollList.toString());
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
}

function getRadioValue(radios) {
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
}
function getCheckBoxValue(boxes) {
    let boxlist = [];
    for (var i = 0; i < boxes.length; i++) {
        if (boxes[i].checked) {
            boxlist.push(boxes[i].value);
        }
    }
    return boxlist;
}

const resetForm = () => {
    setValue('#name', ' ');
    unsetSelectedValue('[name=profile]');
    unsetSelectedValue('[name=gender]');
    unsetSelectedValue('[name=department]');
    setValue('#salary', '');
    setValue('#notes', '');
    setValue('#day', '1');
    setValue('#month', 'January');
    setValue('#year', '2020');
}

const unsetSelectedValue = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        item.checked = false;
    });
}
const setValue = (id, value) => {
    const element = document.querySelector(id);
    element.value = value;
}