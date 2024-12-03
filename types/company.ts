export interface Company {
  _id?: string;
  id?: string;
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  rif?: string;
  address?: string;
  banner?: string;
  currencySymbol?: string;
  currencyRate?: string;
  iva?: number;
  logo?: string;
  logoAlpha?: string;
  configMail?: ConfigMail;
  colors?: Colors;
  configPdf?: ConfigPDF;
  pdf?: ConfigPDF;
  correlatives?: Correlative;
}

export interface ConfigMail {
  colors: Colors;
  textBody: string;
}

export interface Correlative {
  manageInvoiceCorrelative: boolean;
  invoice: number;
}

export interface Colors {
  id?: string;
  background: string;
  primary: string;
  secundary: string;
  title: string;
}

export interface ConfigPDF {
  id?: string;
  logo: Logo;
  logoAlpha: Logo;
}

export interface Logo {
  width: number;
  x: number;
  y: number;
}

export interface Image {
  image: any;
  imageType: string;
}
