import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfPositionsTable } from './shelf-positions-table';

describe('ShelfPositionsTable', () => {
  let component: ShelfPositionsTable;
  let fixture: ComponentFixture<ShelfPositionsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShelfPositionsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShelfPositionsTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
