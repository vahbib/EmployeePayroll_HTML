/*
Applying event listener on name and salary when document is loaded 
*/
let employeeData = {};
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

    const date = document.querySelector('#startDate');
    date.addEventListener('input', function() {
        let startDate = new Array();
        startDate.push(document.querySelector("#day").value);
        startDate.push(document.querySelector("#month").value);
        startDate.push(document.querySelector("#year").value);
        try {
            (new EmployeePayrollData()).startDate = new Date(startDate[2],startDate[1],startDate[0]);
            setTextValue('.date-error', "");
        } catch (e) {
            setTextValue('.date-error', e);
        }
    });

    const salary = document.querySelector('#salary')
    const output = document.querySelector('.salary-output-text')
    output.textContent = salary.value;
    salary.addEventListener('input', function () {
        output.textContent = salary.value;
    });

    checkForUpdate();
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
    set startDate(newDate){
        let now = new Date();
        if(newDate > now) 
            throw "Start Date Is A Future Date!";
        var diff = Math.abs(now.getTime() - newDate.getTime());
        if(diff / (1000 * 60 * 60 * 24) > 30)
            throw "Start Date Is A Beyond 30 Days!";
        this._startDate = newDate;
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

const save = (event) => {
    event.preventDefault();
    event.stopPropagation();
    try{
        setEmployeePayrollObject();
        createAndUpdateStorage();
        resetForm();
        window.location.replace(site_properties.home_page);
    }catch(exception){
        console.error(exception);
        alert(exception);
    }
}
function setEmployeePayrollObject() {
    try {
        employeeData._name = document.getElementById('name').value;
        employeeData._profilePic = getRadioValue(document.getElementsByName('profile'));
        employeeData._gender = getRadioValue(document.getElementsByName('gender'));
        employeeData._department = getCheckBoxValue(document.getElementsByClassName('department'));
        employeeData._salary = document.getElementById('salary').value;

        let start=new Array();
        start.push(document.getElementById('day').value);
        start.push(document.getElementById('month').value);
        start.push(document.getElementById('year').value);
        employeeData._startDate = new Date(start[2],start[1],start[0]);

        employeeData._notes = document.getElementById('notes').value;
        console.log(employeeData);
        alert(employeeData);
    }
    catch (exception) {
        alert(exception);
    }
    employees.push(employeeData);
}
function createAndUpdateStorage() {
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    if(employeePayrollList){
        let employeeData1 = employeePayrollList.find(empData => empData._id == employeeData._id);
        if (!employeeData1) employeePayrollList.push(createEmpData());
        else{
            const index = employeePayrollList.map(empData => empData._id)
                                             .indexOf(employeeData1._id);
            employeePayrollList.splice(index, 1, createEmpData(employeeData1._id));
        }
    }else{
        employeePayrollList = [createEmpData()];
    }
    console.log(employeePayrollList);
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
}

const createEmpData = (id) => {
    let employeePayrollData = new EmployeePayrollData();
    if (!id) employeePayrollData.id = createNewEmployeeId();
    else employeePayrollData.id = id;
    setEmployeePayrollData(employeePayrollData);
    return employeePayrollData;
}

function setEmployeePayrollData(employeePayrollData){
    try {
        employeePayrollData.name = employeeData._name;
    } catch (e) {
        setTextValue('.name-error', e);
    }
    employeePayrollData.profilePic = employeeData._profilePic;
    employeePayrollData.gender = employeeData._gender;
    employeePayrollData.department = employeeData._department;
    employeePayrollData.salary = employeeData._salary;
    employeePayrollData.notes = employeeData._notes;
    try {
        employeePayrollData.startDate = new Date(Date.parse(employeeData._startDate));
    } catch (e) {
        setTextValue('.date-error', e);
        throw e;
    }
    alert(employeePayrollData.toString());
}

const createNewEmployeeId = () => {
    let empId = localStorage.getItem("EmployeeID");
    empId = !empId ? 1 : (parseInt(empId)+1).toString();
    localStorage.setItem("EmployeeID", empId);
    return empId;
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
const checkForUpdate = () => {
    const employeePayrollJson = localStorage.getItem('editEmp');
    isUpdate = employeePayrollJson ? true : false;
    if(!isUpdate) return;
    employeePayrollObj = JSON.parse(employeePayrollJson);
    setForm();
}

const setForm = () => {

    console.log(employeeData);
    setValue('#name',employeeData._name);
    setSelectedValues('[name=profile]',employeeData._profilePic);
    setSelectedValues('[name=gender]',employeeData._gender);
    setCheckBox('[name=department]',employeeData._department);
    setValue('#salary',employeeData._salary);
    setTextValue('.salary-output',employeeData._salary);
    setValue('#notes',employeeData._notes);
    let date = employeeData._startDate.toString().slice(0,10).split("-");
    setValue('#day', (Number.parseInt(date[2]) + 1) % 31);
    setValue('#month', date[1]);
    setValue('#year',date[0]);
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
    setSelectedIndex('#day', 0);
    setSelectedIndex('#month', 0);
    setSelectedIndex('#year', 0);
    localStorage.removeItem('editEmp');
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

const setSelectedIndex = (id, index) => {
    const element = document.querySelector(id);
    element.selectedIndex = index;
}

const setSelectedValues = (propertyValue,value)=>{
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        if(Array.isArray(value)){
            if(value.includes(item.value)){
                item.checked = true;
            }
        }
        else if(item.value==value)
        item.checked = true;
    });
}
const setCheckBox = (property, values) => {
    let items = document.querySelectorAll(property);
    items.forEach(item => {
        if (values.includes(item.value)) {
            item.checked = true;
        }
    });
}
const setTextValue=(id,value)=>{
    const element = document.querySelector(id)
    element.textContent=value;
}

function getEmpDataFromLocalStorage() {
    return localStorage.getItem("EmployeePayrollList") ?
        JSON.parse(localStorage.getItem("EmployeePayrollList")) :
        [];
}