import { type CreatedShort } from "./general";

export interface Total {
    total: Number
}

export interface ProductForm {
    name: string;
    description: string;
    price: number;
    iva: boolean;
    id: string;
    _id?: string;
    amount?: number;
    master?: string;
    idProduct?: string;
}

export interface ProductCotiza {
    master: string;
    name: string;
    description: string;
    price: number;
    iva: boolean;
    id: string;
    amount?: number;
}

export interface Product extends ProductForm {
    created: CreatedShort;
    _id: string;
}