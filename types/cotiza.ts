import { CustomerBase } from "./customer";
import { type CustomerShort, type CreatedShort } from "./general";
import { ProductForm } from "./products";

export interface CotizaForm {
  title: string;
  description: string;
  number: number;
  date: string;
  customer: string;
  id?: string;
  customerId?: string;
}

export interface PdfEndpoint {
  id: string;
  libre?: boolean;
}

export interface CotizaBase {
  title: string;
  description: string;
  status: string;
  number: number;
  amount: number;
  date: string;
  rate: number;
  totalIva?: number;
  total?: number;
  discount: number;
  typeDiscount: string;
  created: CreatedShort;
  sequence: number;
  _id: string;
}

export interface Cotiza extends CotizaBase {
  customer: CustomerShort;
}

export interface CotizaFull extends CotizaBase {
  customer?: CustomerBase;
  products?: ProductForm[];
}
