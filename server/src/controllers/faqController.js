import FAQ from "../models/FAQ.js";
import { memoryStore, usingMemoryStore } from "../services/memoryStore.js";

export const listFaqs = async (req, res) => {
  if (usingMemoryStore()) return res.json(await memoryStore.listFaqs(req.query.search));

  const query = { active: true };
  if (req.query.search) query.$text = { $search: req.query.search };
  const faqs = await FAQ.find(query).sort({ category: 1, question: 1 }).limit(50);
  res.json(faqs);
};

export const createFaq = async (req, res) => {
  if (usingMemoryStore()) return res.status(201).json(await memoryStore.createFaq(req.body));
  const faq = await FAQ.create(req.body);
  res.status(201).json(faq);
};
