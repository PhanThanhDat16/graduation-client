export interface IBankAccount {
  _id: string
  code: string
  bankShortName: string
  accountNumber: string
  accountName: string
  status: string
  logo: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface ICreateBankAccount {
  code: string
  bankShortName: string
  accountNumber: string
  accountName: string
  status?: string
  logo: string
}

export interface IUpdateBankAccount {
  accountNumber: string
  accountName: string
}

export interface IUpdateStatusBankAccount {
  status: 'active' | 'inactive'
}
