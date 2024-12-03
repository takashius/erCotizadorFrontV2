import { type CreatedShort } from "./general";

export interface CustomerBase {
    title: string;
    name: string;
    lastname: string;
    rif: string;
    email: string;
    phone: string;
    created?: CreatedShort;
    _id?: string;
}

export interface Customer extends CustomerBase {
    addresses: Address[];
}

export interface CustomerList {
    results: Customer[];
    totalCustomers: number;
    totalPages: number;
    currentPage: number;
    next?: number;
}

export interface CustomerForm extends CustomerBase {
    address?: Address;
}

export interface Address {
    title: string;
    city: string;
    line1: string;
    line2: string;
    zip: string;
    default?: boolean;
    created?: CreatedShort;
    id?: string;
    _id?: string;
    idAddress?: string;
}