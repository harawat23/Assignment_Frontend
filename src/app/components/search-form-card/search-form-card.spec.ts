import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFormCard } from './search-form-card';

describe('SearchFormCard', () => {
  let component: SearchFormCard;
  let fixture: ComponentFixture<SearchFormCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFormCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFormCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
