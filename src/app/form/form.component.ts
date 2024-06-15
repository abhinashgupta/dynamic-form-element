import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Student } from '../models/student.model';
import { Course } from '../models/course.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  studentForm: FormGroup;
  names: string[] = ['Kunal', 'Harshit', 'Golu', 'Neha', 'Abhishek', 'Frank'];
  courses: Course[] = [
    { name: 'Math' },
    { name: 'Science' },
    { name: 'History' },
    { name: 'English' },
    { name: 'Sanskrit' },
    { name: 'Computer Science' },
  ];

  constructor(private fb: FormBuilder) {
    this.studentForm = this.fb.group({
      students: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    const savedData = localStorage.getItem('studentData');
    if (savedData) {
      const studentData: Student[] = JSON.parse(savedData);
      this.setStudents(studentData);
    }
  }

  get students(): FormArray {
    return this.studentForm.get('students') as FormArray;
  }

  createStudent(student?: Student): FormGroup {
    return this.fb.group({
      name: new FormControl(student ? student.name : ''), 
      courses: this.fb.array(
        student && student.courses.length > 0
          ? student.courses.map((course) => this.createCourse(course))
          : [this.createCourse()]
      ),
    });
  }

  createCourse(course?: Course): FormGroup {
    return this.fb.group({
      name: new FormControl(course ? course.name : ''), 
    });
  }

  setStudents(students: Student[]): void {
    const studentFGs = students.map((student) => this.createStudent(student));
    const studentFormArray = this.fb.array(studentFGs);
    this.studentForm.setControl('students', studentFormArray);
  }

  addStudent(): void {
    this.students.push(this.createStudent());
  }

  removeStudent(index: number): void {
    this.students.removeAt(index);
  }

  addCourse(studentIndex: number): void {
    const courses = this.students.at(studentIndex).get('courses') as FormArray;
    courses.push(this.createCourse());
  }

  removeCourse(studentIndex: number, courseIndex: number): void {
    const courses = this.students.at(studentIndex).get('courses') as FormArray;
    courses.removeAt(courseIndex);
  }

  saveChanges(): void {
    const studentData: Student[] = this.studentForm.value.students;
    localStorage.setItem('studentData', JSON.stringify(studentData));
    alert('Changes have been saved');
  }

  getCoursesControl(studentIndex: number): FormArray {
    return this.students.at(studentIndex).get('courses') as FormArray;
  }
}
