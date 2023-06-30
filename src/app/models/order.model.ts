import { CodeInformation } from "./code-information.model";
import { NewUser } from "./new-user.model";
import { SimpleProduct } from "./product.model";
import { Timestamp } from 'firebase/firestore';
export class Order {
    id? :string;
    short_id: string = '';
    productos: SimpleProduct[] = [];
    subtotal: number = 0;
    cupon: CodeInformation = new CodeInformation;
    envio: number = 0;
    tipo_envio: string = '';
    sucursal: string = '';
    metodo: string = '';
    total:number  = 0;
    estado: string = 'creado';
    usuario: string = '';
    created_at: Timestamp | undefined;
    userData: NewUser = new NewUser;
}
