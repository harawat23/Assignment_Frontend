import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, input, Input, output, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { DeviceModel } from '../../models/Device';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type DeviceMetaData = {
  deviceId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  numberOfShelfPositions?: number;
}

export type DeviceFormValue={
  deviceName:string,
  deviceType:string,
  partNumber:string,
  buildingName:string
}

@Component({
  selector: 'app-device-fields-form',
  imports: [ReactiveFormsModule],
  templateUrl: './device-fields-form.html',
  styleUrl: './device-fields-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceFieldsForm {
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  readonly title = input<string>();
  readonly model = input.required<DeviceFormValue>();
  readonly metadata = input<DeviceMetaData | null>(null); 
  readonly submitLabel = input<string>('save device'); 
  readonly showDeleteButton= input(false);

  readonly modelChange = output<DeviceFormValue>();
  readonly submitForm=output<void>();
  readonly deleteForm=output<void>();

  protected readonly deviceForm = this.formBuilder.nonNullable.group({
    deviceName:['',Validators.required],
    deviceType:['',Validators.required],
    buildingName:['',Validators.required],
    partNumber:['',Validators.required],
  });

  readonly hasMetadata=computed(()=>this.metadata()!==null);

  constructor(){
    effect(()=>{
      this.deviceForm.setValue(this.model(),{emitEvent:false});
    })

    this.deviceForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(()=>{
      this.modelChange.emit(this.deviceForm.getRawValue());
    })
  }

  onSubmit():void{
    if (this.deviceForm.invalid){
      return;
    }

    this.submitForm.emit();
  }

  onDelete():void{
    this.deleteForm.emit();
  }
}
