import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

export type ShelfFormValue={
  shelfName:string,
  partNumber:string,
};

export type ShelfMetaData = {
  shelfId:string,
  createdAt?: Date | string,
  updatedAt? : Date|string,
  connectedDevice?: string | null;
}

@Component({
  selector: 'app-shelf-fields-form',
  imports: [ReactiveFormsModule],
  templateUrl: './shelf-fields-form.html',
  styleUrl: './shelf-fields-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShelfFieldsForm {
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  readonly title = input<string>('Create Shelf');
  readonly model = input.required<ShelfFormValue>();
  readonly submitLabel = input('Save Shelf');
  readonly showDeleteButton=input(true);
  readonly metadata=input<ShelfMetaData | null> (null)

  readonly modelChange = output<ShelfFormValue>();
  readonly submitForm = output<void>();
  readonly deleteform= output<void>();

  protected readonly shelfForm = this.formBuilder.nonNullable.group({
    shelfName: ['', Validators.required],
    partNumber: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      this.shelfForm.setValue(this.model(), { emitEvent: false });
    });

    this.shelfForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.modelChange.emit(this.shelfForm.getRawValue());
    });
  }

  protected onSubmit(): void {
    if (this.shelfForm.invalid) {
      this.shelfForm.markAllAsTouched();
      return;
    }

    this.submitForm.emit();
  }

  onDelete(){
    this.deleteform.emit();
  }
}