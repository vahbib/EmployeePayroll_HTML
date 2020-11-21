let empPayrollList;
window.addEventListener('DOMContentLoaded',(event)=>{
    empPayrollList = getEmployeePayrollDataFromStorage();
    document.querySelector('.emp-count').textContent = empPayrollList.length;
    createInnerHTML();
});

const getEmployeePayrollDataFromStorage = () => {
    return localStorage.getItem("EmployeePayrollList") ? JSON.parse(localStorage.getItem("EmployeePayrollList")) : [];
} 

function createInnerHTML(){
    if(empPayrollList.length == 0) return;
    const headerHTML=
        "<th>Profile Pic</th>"+
        "<th>Emp Name</th>"+
        "<th>Gender</th>"+
        "<th>Department</th>"+
        "<th>Salary</th>"+
        "<th>Start Date</th>"+
        "<th>Actions</th>";
    
    let innerHTML = `${headerHTML}`;    
    for(const empData of empPayrollList) {
        innerHTML = `${innerHTML}
        <tr>
            <td><img class="profile" src="${empData._profilePic}" alt="Profile Pic"></td>
            <td>${empData._name}</td>
            <td>${empData._gender}</td>
            <td>${getDeptHTML(empData._department)}</td>
            <td>RS ${empData._salary}</td>
            <td>${empData._startDate}</td>
            <td>
                <img name="${empData._id}" onclick="remove(this)" alt="delete" src="../assets/icons/delete-black-18dp.svg">
                <img name="${empData._id}" onclick="update(this)" alt="edit" src="../assets/icons/create-black-18dp.svg">
            </td>
        </tr>
        `;
    }
    document.querySelector('#table-display').innerHTML = innerHTML;
}

function getDeptHTML(deptList) {
    let deptHTML = '';
    for(const dept of deptList) {
        deptHTML = `${deptHTML}
        <div class="dept-label">${dept}</div>`;
    }
    return deptHTML;
}