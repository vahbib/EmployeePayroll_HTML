const salary = document.querySelector('#salary')
const salary_op = document.querySelector('.salary-output-text')
salary_op.textContent = salary.value
salary.addEventListener('input', 
function() {
salary_op.textContent = salary.value
} )