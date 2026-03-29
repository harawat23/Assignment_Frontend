import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceFieldsForm } from './device-fields-form';

describe('DeviceFieldsForm', () => {
  let component: DeviceFieldsForm;
  let fixture: ComponentFixture<DeviceFieldsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceFieldsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceFieldsForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
