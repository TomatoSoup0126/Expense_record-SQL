const express = require('express')
const router = express.Router()

const db = require('../models')
const User = db.User
const Record = db.Record

//載入auth middleware
const { authenticated } = require('../config/auth')


const category2Icon = {
  "houseware": `<i class="fas fa-home"></i>`,
  "traffic": `<i class="fas fa-shuttle-van"></i>`,
  "entertainment": `<i class="fas fa-grin-beam"></i>`,
  "food": `<i class="fas fa-utensils"></i>`,
  "other": `<i class="fas fa-pen"></i>`
}

const category2chinese = {
  "houseware": "居家業務",
  "traffic": "交通出行",
  "entertainment": "休閒娛樂",
  "food": "餐飲食品",
  "other": "其他"
}

router.get('/', authenticated, (req, res) => {
  let user = req.user
  let category = req.query.category
  let filterObject = { UserId: req.user._id }
  if (req.query.category) {
    filterObject.category = category
  }

  User.findByPk(user.id)
    .then((user) => {
      if (!user) throw new Error("user not found")

      return Record.findAll({
        where: filterObject,
        order: ['date', 'DESC']
      })
    })
    .then((records) => {
      records.forEach(record => {
        totalAmount += record.amount
        record.formatDate = record.date.toJSON().split('T')[0]
        record.icon = category2Icon[record.category]
      })
      return records
    })
    .then((records) => { return res.render('index', { records: records, totalAmount: totalAmount, user: user, category: category2chinese[category] }) })
    .catch((error) => { return res.status(422).json(error) })
})

module.exports = router

