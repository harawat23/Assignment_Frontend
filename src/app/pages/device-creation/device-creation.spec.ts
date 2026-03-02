import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceCreation } from './device-creation';

describe('DeviceCreation', () => {
  let component: DeviceCreation;
  let fixture: ComponentFixture<DeviceCreation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceCreation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceCreation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
