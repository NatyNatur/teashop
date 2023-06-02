export class Category {
    category_name: string = '';
    category_status: string = 'active';
    category_id: string = '';
    subcategories?: Subcategory[];
}

export class Subcategory {
    subcategory_id: string = '';
    subcategory_name: string = '';
    subcategory_status: string = 'active';
}

export class SubcategoryToEdit {
    category_name: string = '';
    category_status: string = 'active';
    category_id: string = '';
    subcategory_id: string = '';
    subcategory_name: string = '';
    subcategory_status: string = 'active';
}

