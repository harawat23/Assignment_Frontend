import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfFieldsForm } from './shelf-fields-form';

describe('ShelfFieldsForm', () => {
  let component: ShelfFieldsForm;
  let fixture: ComponentFixture<ShelfFieldsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShelfFieldsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShelfFieldsForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
