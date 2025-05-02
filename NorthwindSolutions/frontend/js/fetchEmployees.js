//const apiURL = 'http://localhost:3000/orders';

//sql select * from orders join categorys using (category_id)

document.addEventListener('DOMContentLoaded', () => {
    fillOrderTable();


    const modal = document.getElementById('employee-form');
    const deleteModal = document.getElementById('delete-modal');
    const employeeForm = document.getElementById('employee-form');
    let employeeToDelete = null;


    document.getElementById('close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });



    async function fillOrderTable() {
        let response = await fetch('/employees');
        let employees = await response.json();
        console.log(employees);
        const tbody = document.querySelector('#employees-table tbody');
        tbody.innerHTML = '';

        employees.forEach(employee => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${employee.EmployeeID}</td>
            <td>${employee.LastName}</td>
            <td>${employee.FirstName}</td>
            <td>${employee.Title}</td>
            <td>${employee.HireDate}</td>
            <td>${employee.City}</td>
            <td>${employee.Region}</td>
            <td>
                <button class="edit-btn" data-id="${employee.EmployeeID}">Edit</button>
                <button class="delete-btn" data-id="${employee.EmployeeID}">Delete</button>
            </td>
        `;
            tbody.appendChild(row);
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', openEditModal);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', deleteEmployee);
        });
    }





    async function openEditModal(event) {
        const employeeId = event.target.dataset.id;
        document.getElementById('employee-form').style.display = 'block';

        const response = await fetch(`/employees/${employeeId}`);
        const employee = await response.json();

        document.getElementById('employee-id').value = employee.EmployeeID;
        document.getElementById('last-name').value = employee.LastName;
        document.getElementById('first-name').value = employee.FirstName;
        document.getElementById('title').value = employee.Title;
        document.getElementById('hire-date').value = employee.HireDate.split('T')[0];
        document.getElementById('city').value = employee.City;
        document.getElementById('region').value = employee.Region;

        document.getElementById('modal-title').textContent = 'Edit Employee';
        document.getElementById('employee-modal').style.display = 'block';
    }




    document.getElementById('add-btn').addEventListener('click', () => {
        document.getElementById('employee-id').value = '';
        document.getElementById('last-name').value = '';
        document.getElementById('first-name').value = '';
        document.getElementById('title').value = '';
        document.getElementById('hire-date').value = '';
        document.getElementById('city').value = '';
        document.getElementById('region').value = '';

        document.getElementById('modal-title').textContent = 'Add Employee';
        document.getElementById('employee-modal').style.display = 'block';



        employeeForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const employeeId = document.getElementById('employee-id').value;

            const employeeData = {
                LastName: document.getElementById('last-name').value,
                FirstName: document.getElementById('first-name').value,
                Title: document.getElementById('title').value,
                HireDate: document.getElementById('hire-date').value,
                City: document.getElementById('city').value,
                Region: document.getElementById('region').value,
            };

            const method = employeeId ? 'PUT' : 'POST';
            const url = employeeId ? `/employees/${employeeId}` : '/employees';

            console.log(' method del form:', method, 'and URL:', url);
            console.log('Employee data ha sido enviado:', employeeData);

            

            try {
                const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(employeeData),
                });

                if (response.ok) {
                    alert('Employee added successfully!');
                    modal.style.display = 'none';
    
                    await fillOrderTable();
                } else {
                    alert('Failed to add employee.');
                }
                
            } catch (error) {
                console.error('Error adding employee:', error);
                alert('An error occurred while adding the employee.');
                
            }
        });
    });
});

let employeeToDelete = null;

async function deleteEmployee(event) {
    const employeeId = event.target.dataset.id;
    employeeToDelete = employeeId;

    const deleteModal = document.getElementById('delete-modal');
    deleteModal.style.display = 'block';
}

document.getElementById('confirm-delete').addEventListener('click', async () => {
    if (employeeToDelete) {
        try {
            const response = await fetch(`/employees/${employeeToDelete}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Employee deleted successfully!');
                await fillOrderTable();
            } else {
                alert('Failed to delete employee.');
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
            alert('An error occurred while deleting the employee.');
        } finally {
            closeDeleteModal();
        }
    }
});

document.getElementById('cancel-delete').addEventListener('click', () => {
    closeDeleteModal();
});

function closeDeleteModal() {
    const deleteModal = document.getElementById('delete-modal');
    deleteModal.style.display = 'none';
    employeeToDelete = null;
}

document.getElementById('close-delete-modal').addEventListener('click', () => {
    closeDeleteModal();
});

//con jquery $('model-comosellame').modal('hide');

document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('employee-modal').style.display = 'none';
});



