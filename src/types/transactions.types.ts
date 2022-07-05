export interface ITransaction {
  id: string;
  amount: number;
  transaction_date: string;
  category: number;
  type: string;
  categories: any;
  comment: string;
  account: string;
  sub_categories: any;
  invoice_no: number;
  transaction_tags: any;
}
