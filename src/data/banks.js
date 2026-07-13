export const BANKS = [
  { id: 'SBI', name: 'State Bank of India', logo: '/sbi-card-logo.png',               abbr: 'SBI', color: '#1FA8E1', rate: '7.10%' },
  { id: 'KVB', name: 'Karur Vysya Bank',    logo: '/officialkarurvysyabank_logo.jpeg', abbr: 'KVB', color: '#15803d', rate: '7.35%' },
]

export function getBankName(id) {
  return BANKS.find(b => b.id === id)?.name || id
}
