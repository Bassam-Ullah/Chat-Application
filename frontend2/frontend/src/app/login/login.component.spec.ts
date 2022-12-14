import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
// import { Router } from "@angular/router";
import { LoginComponent } from './login.component';
import { routes } from '../app-routing.module';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let location: Location;
  // let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports:[
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    // router = TestBed.get(Router);
    fixture = TestBed.createComponent(LoginComponent);
    // router.initialNavigation();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change submitted and loading property on calling onsubmit method', () => {
    expect(component.submitted).toBeFalse()
    component.onSubmit()
    expect(component.submitted).toBeTrue();
  });

  // it('navigate to "" redirects you to /home', fakeAsync(() => { 
  //   const location: Location = TestBed.inject(Location);
  //   router.navigate(['']); 
  //   tick(); 
  //   expect(location.path()).toBe('/chat'); 
  // }));

});
