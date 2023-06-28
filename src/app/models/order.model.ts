import { CodeInformation } from "./code-information.model";
import { SimpleProduct } from "./product.model";

export class Order {
    id? :string;
    products?: SimpleProduct[];
    subtotal: number = 0;
    cupon: CodeInformation = new CodeInformation;
    envio: number = 0;
    tipo_envio: string = '';
    total:number  = 0;
    estado: string = 'creado'
}
