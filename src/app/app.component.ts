
import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public employees: Employee[];
  public editEmployee: Employee;
  public deleteEmployee: Employee;

  constructor(private employeeService: EmployeeService ) {
    this.employees = [];
   }

  ngOnInit() {
    this.getEmployees();
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddEmloyee(addForm:NgForm): void {
    document.getElementById('add-employee-form').click();

    // Makes calls to Back-end so we need to subscribe()
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();

        // clears the form if successful
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);

        // Clears the form if not sussessful
        addForm.reset();
      }
    );
  }

  public onUpdateEmloyee(employee: Employee): void {
    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteEmloyee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe(
      (response: void) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchEmployees(key: string): void {
    console.log(key);
    const results: Employee[] = [];
    for (const employee of this.employees){
      if (employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1){
        results.push(employee);
      }
    }
    this.employees = results;
    if (results.length === 0 || !key){
      this.getEmployees();
    }
  }

  // Programmatically adds button to page
  public onOpenModal(employee: Employee, mode: string): void {

    // Gives access to div by id
    const container = document.getElementById('main-container');

    // Creates button
    const button = document.createElement('button');

    // Changes type of button from defaut "sumbit" to button
    button.type = 'button';

    // Hides the button
    button.style.display = 'none';


    // Bootstrap4 version
    button.setAttribute('data-toggle', 'modal');

    // Bootstrap5 version
    // button.setAttribute('data-bs-toggle', 'modal');
    if (mode === 'add') {

      // Bootstrap4 version
      button.setAttribute('data-target', '#addEmployeeModal');

      // Bootstrap5 version
      // button.setAttribute('data-bs-target', '#addEmployeeModal');
    }
    if (mode === 'edit') {
      this.editEmployee = employee;

      // Bootstrap4 version
      button.setAttribute('data-target', '#updateEmployeeModal');

      // Bootstrap5 version
      // button.setAttribute('data-bs-target', '#updateEmployeeModal');
    }
    if (mode === 'delete') {
      this.deleteEmployee = employee;

      // Bootstrap4 version
      button.setAttribute('data-target', '#deleteEmployeeModal');

       // Bootstrap5 version
      // button.setAttribute('data-bs-target', '#deleteEmployeeModal');
    }

    //  Adds button to the container
    container.appendChild(button);
    button.click();
  }

}
