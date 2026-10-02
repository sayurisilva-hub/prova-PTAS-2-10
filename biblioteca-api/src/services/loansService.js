import { readLoans, writeLoans } from '../models/loansModel.js';

export async function getAllActive() {
  const loans = await readLoans();
  return loans.filter(l => !l.devolvidoEm);
}

export async function getById(id) {
  const loans = await readLoans();
  const loan = loans.find(l => l.id === id);
  if (!loan) {
    const error = new Error('Empréstimo não encontrado');
    error.status = 404;
    throw error;
  }
  return loan;
}

export async function create(loanData) {
  const loans = await readLoans();

  const bookIsActive = loans.some(l => l.libro === loanData.libro && !l.devolvidoEm);
  if (bookIsActive) {
    const error = new Error('Este livro já possui um empréstimo ativo!');
    error.status = 409;
    throw error;
  }

  const novoId = loans.length ? Math.max(...loans.map(l => l.id)) + 1 : 1;
  const nuevoLoan = {
    id: novoId,
    nomeAluno: loanData.nomeAluno,
    libro: loanData.libro,
    devolvidoEm: null
  };

  loans.push(nuevoLoan);
  await writeLoans(loans);
  return nuevoLoan;
}

export async function updatePut(id, loanData) {
  const loans = await readLoans();
  const idx = loans.findIndex(l => l.id === id);

  if (idx === -1) {
    const error = new Error('Empréstimo não encontrado');
    error.status = 404;
    throw error;
  }

  loans[idx] = {
    id,
    nomeAluno: loanData.nomeAluno,
    libro: loanData.libro,
    devolvidoEm: loanData.devolvidoEm !== undefined ? loanData.devolvidoEm : null
  };

  await writeLoans(loans);
  return loans[idx];
}

export async function updatePatch(id, partialData) {
  const loans = await readLoans();
  const loan = loans.find(l => l.id === id);

  if (!loan) {
    const error = new Error('Empréstimo não encontrado');
    error.status = 404;
    throw error;
  }

  const { id: _, devolvidoEm: __, ...dadosPermitidos } = partialData;
  Object.assign(loan, dadosPermitidos);

  await writeLoans(loans);
  return loan;
}

export async function softDelete(id) {
  const loans = await readLoans();
  const loan = loans.find(l => l.id === id);

  if (!loan) {
    const error = new Error('Empréstimo não encontrado');
    error.status = 404;
    throw error;
  }

  if (loan.devolvidoEm) {
    const error = new Error('Empréstimo já foi devolvido anteriormente');
    error.status = 409;
    throw error;
  }

  loan.devolvidoEm = new Date().toISOString();
  await writeLoans(loans);
}
