import PageModel from '../models/page'

export default () => PageModel.aggregate([
  { $group: { _id: "$host", host: { $first: "$host" }, pages: { $sum: 1 }, terms: { $sum: "$termsCount" }, tokens: { $sum: "$tokensCount" } }},
  { $set: { pages: { $toInt: "$pages" } } },
  { $lookup: { from: "hosts", localField: "host", foreignField: "_id", as: "host" } },
  { $set: { host: { "$arrayElemAt": ["$host", 0] } } },
  { $set: { done: "$host.done", host: "$host.host" } },
  { $sort: { _id: -1 } }
])