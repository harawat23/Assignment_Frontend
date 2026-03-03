import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDelete } from './dialog-delete';

describe('DialogDelete', () => {
  let component: DialogDelete;
  let fixture: ComponentFixture<DialogDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDelete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDelete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
