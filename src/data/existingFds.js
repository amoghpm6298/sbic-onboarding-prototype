// Mock: only SBI has FDs already on file for this customer. KVB is a fresh relationship.
export const EXISTING_FDS = {
  SBI: [
    { id: 'fd1', accountNo: 'XXXX4521', amount: 100000, tenure: 36, rate: 7.25, openDate: '15 Mar 2023', maturityDate: '15 Mar 2026', maturityAmount: 123414 },
    { id: 'fd2', accountNo: 'XXXX7788', amount: 50000, tenure: 12, rate: 6.80, openDate: '10 Jan 2025', maturityDate: '10 Jan 2026', maturityAmount: 53400 },
  ],
  KVB: [],
}
