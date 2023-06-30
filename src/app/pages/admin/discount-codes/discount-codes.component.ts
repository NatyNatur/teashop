import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { CodeInformation } from 'src/app/models/code-information.model';
import { DiscountCodesService } from 'src/app/services/discount-codes.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-discount-codes',
  templateUrl: './discount-codes.component.html',
  styleUrls: ['./discount-codes.component.css']
})
export class DiscountCodesComponent implements OnInit {

  discountCodesList: CodeInformation[] = [];
  newCodeForm!: FormGroup;
  editCodeForm!: FormGroup;

  codeToEdit: CodeInformation = new CodeInformation;
  codeToDelete: CodeInformation = new CodeInformation;

  @ViewChild('newCodeModal') newCodeModal?: ModalDirective;
  @ViewChild('editCodeModal') editCodeModal?: ModalDirective;
  @ViewChild('deleteCodeModal') deleteCodeModal?: ModalDirective;

  constructor(private _discountCodes: DiscountCodesService,
    private _loader: LoaderService,
    private _formBuilder: FormBuilder,
    private _toastr: ToastrService) {

    this.createCodeForm();
  }

  ngOnInit(): void {
    this.getAllCodes();
  }

  getAllCodes() {
    this._loader.loaderOn();
    this._discountCodes.readAllCodes().then((res: any) => {
      this.discountCodesList = res;
      this._loader.loaderOff();
    })
  }

  createCodeForm() {
    this.newCodeForm = this._formBuilder.group({
      monto: ['', [Validators.required, Validators.pattern(/^(100|[1-9][0-9]?)$/)]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      vigente: [true, [Validators.required]],
    })
    this.editCodeForm = this._formBuilder.group({
      monto: ['', [Validators.required, Validators.pattern(/^(100|[1-9][0-9]?)$/)]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      vigente: [true, [Validators.required]],
      id: ['', [Validators.required]],
    })
  }

  get newName() {
    return this.newCodeForm?.get('nombre');
  }

  get newAmount() {
    return this.newCodeForm?.get('monto');
  }

  onSubmitNewCode() {
    if (!this.newCodeForm.valid) {
      this._toastr.error('Recuerda completar todos los campos.', 'Código no creado');
      return;
    }
    else {
      this._loader.loaderOn();
      this._discountCodes.createDiscountCode(this.newCodeForm.getRawValue()).then(() => {
        this.getAllCodes();
      }).finally(() => {
        this.newCodeModal?.hide();
      })
    }
  }

  get editName() {
    return this.editCodeForm?.get('nombre');
  }

  get editAmount() {
    return this.editCodeForm?.get('monto');
  }

  get editVigente() {
    return this.editCodeForm?.get('vigente');
  }



  openEditCodeModal(code: CodeInformation) {
    this.codeToEdit = code;
    this.fillEditCodeForm();
    setTimeout(() => {
      this.editCodeModal!.show()
    }, 200);
  }

  fillEditCodeForm() {
    this.editCodeForm.patchValue({
      nombre: this.codeToEdit.nombre,
      monto: this.codeToEdit.monto,
      vigente: this.codeToEdit.vigente, 
      id: this.codeToEdit.id
    })
  }

  onSubmitEditCode() {
    if (!this.editCodeForm.valid) {
      this._toastr.error('Recuerda completar todos los campos.', 'Código no actualizado');
      return;
    }
    else {
      this._loader.loaderOn();
      this._discountCodes.updateDiscountCode(this.editCodeForm.getRawValue()).then(() => {
        this.getAllCodes();
      }).finally(() => {
        this.editCodeModal?.hide();
      })
    }
  }

  openDeleteCodeModal(code: CodeInformation) {
    this.codeToDelete = code;
    setTimeout(() => {
      this.deleteCodeModal!.show()
    }, 200);
  }

  deleteCode(code: CodeInformation) {
    this._loader.loaderOn();
    this._discountCodes.deleteDiscountCode(code.id).then(()=> {
      this.getAllCodes();
    }).finally(()=> {
      this.deleteCodeModal?.hide();
    })
  }
}
