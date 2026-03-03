import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfSummary } from './shelf-summary';

describe('ShelfSummary', () => {
  let component: ShelfSummary;
  let fixture: ComponentFixture<ShelfSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShelfSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShelfSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
