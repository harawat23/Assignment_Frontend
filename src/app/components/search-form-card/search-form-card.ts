import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
 
type SearchOption = {
    label: string;
    value: string;
};
 
@Component({
    selector: 'app-search-form-card',
    imports: [ReactiveFormsModule],
    templateUrl: './search-form-card.html',
    styleUrl: './search-form-card.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFormCard {
    private readonly destroyRef = inject(DestroyRef);
    private readonly formBuilder = inject(FormBuilder);
 
    readonly title = input('Search');
    readonly label = input('ID');
    readonly inputId = input('searchInput');
    readonly placeholder = input('Enter ID');
    readonly value = input('');
    readonly submitLabel = input('Submit');
    readonly selectLabel = input('Search By');
    readonly options = input<SearchOption[]>([]);
    readonly selectedOption = input('');
 
    readonly valueChange = output<string>();
    readonly selectedOptionChange = output<string>();
    readonly submitSearch = output<void>();
 
    protected readonly searchForm = this.formBuilder.nonNullable.group({
        selectedOption: '',
        value: '',
    });
 
    constructor() {
        effect(() => {
            this.searchForm.controls.value.setValue(this.value(), { emitEvent: false });
            this.searchForm.controls.selectedOption.setValue(this.selectedOption(), { emitEvent: false });
        });
 
        this.searchForm.controls.value.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((value) => {
                this.valueChange.emit(value);
            });
 
        this.searchForm.controls.selectedOption.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((value) => {
                this.selectedOptionChange.emit(value);
            });
    }
 
    protected onSubmit(): void {
        this.submitSearch.emit();
    }
}