import * as loansService from '../services/loansService.js';

export async function listActive(req, res, next) {
  try {
    const activeLoans = await loansService.getAllActive();
    res.json(activeLoans);
  } catch (err) {
    next(err);
  }
}

export async function findOne(req, res, next) {
  try {
    const id = Number(req.params.id);
    const loan = await loansService.getById(id);
    res.json(loan);
  } catch (err) {
    next(err);
  }
}

export async function store(req, res, next) {
  try {
    const { nomeAluno, libro } = req.body || {};

    if (!nomeAluno) {
      return res.status(400).json({ erro: "O campo 'nomeAluno' é obrigatório." });
    }
    if (!libro) {
      return res.status(400).json({ erro: "O campo 'libro' é obrigatório." });
    }

    const nuevoLoan = await loansService.create({ nomeAluno, libro });
    res.status(201).json(nuevoLoan);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { nomeAluno, libro } = req.body || {};

    if (!nomeAluno || !libro) {
      return res.status(400).json({ erro: "Campos 'nomeAluno' e 'libro' são obrigatórios para substituição completa (PUT)." });
    }

    const updated = await loansService.updatePut(id, { nomeAluno, libro });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function patch(req, res, next) {
  try {
    const id = Number(req.params.id);
    const updated = await loansService.updatePatch(id, req.body || {});
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    await loansService.softDelete(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
