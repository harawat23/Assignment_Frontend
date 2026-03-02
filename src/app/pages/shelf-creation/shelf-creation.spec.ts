import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfCreation } from './shelf-creation';

describe('ShelfCreation', () => {
  let component: ShelfCreation;
  let fixture: ComponentFixture<ShelfCreation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShelfCreation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShelfCreation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
