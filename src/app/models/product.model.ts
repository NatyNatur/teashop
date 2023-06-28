export class Product {
    id?: string = '';
    product_name: string = '';
    product_description: string = '';
    product_price: number = 0;
    product_stock: number = 0;
    product_image: string = '';
    product_imageUrl: string = '';
    product_featured: string = 'No';
    product_category: string = '';
    product_subcategory: string = '';
    product_imageName: string = '';
}

export class ProductInCart {
    id?: string = '';
    product_name: string = '';
    product_description: string = '';
    product_price: number = 0;
    product_stock: number = 0;
    product_image: string = '';
    product_imageUrl: string = '';
    product_featured: string = '';
    product_category: string = '';
    product_subcategory: string = '';
    product_imageName: string = '';
    quantity: number = 0;
}

export class SimpleProduct {
    id?: string = '';
    product_name: string = '';
    product_price: number = 0;
    product_imageUrl: string = '';
    quantity: number = 0;
}