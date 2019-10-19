const express = require('express')
const router = express.Router()
const db = require('../models')
const User = db.User
const Record = db.Record


const { authenticated } = require('../config/auth')



// 新增一筆 Record 頁面
router.get('/new', authenticated, (req, res) => {
  return res.render('new')
})

// 新增一筆  Record
router.post('/', authenticated, (req, res) => {
  const { name, date, category, merchant, amount } = req.body

  let errors = []

  if (!name || !date || !category || !amount) {
    errors.push({ message: '必填欄位未填' })
  }

  if (errors.length > 0) {
    res.render('new', {
      errors,
      name,
      date,
      category,
      merchant,
      amount
    })
  } else {
    Record.create({
      name: req.body.name,
      date: req.body.date,
      category: req.body.category,
      merchant: req.body.merchant,
      amount: req.body.amount,
      UserId: req.user.id
    })
      .then((record) => { return res.redirect('/') })
      .catch((error) => { return res.status(422).json(error) })
  }
})


// 修改 Record 頁面
router.get('/:id/edit', authenticated, (req, res) => {
  User.findByPk(req.user.id)
    .then((user) => {
      if (!user) throw new Error("user not found")
      return Record.findOne({
        where: {
          Id: req.params.id,
          UserId: req.user.id,
        }
      })
    })
    .then((record) => {
      let time = record.date
      let year = time.getFullYear()
      let month = time.getMonth() + 1
      if (month < 10) {
        month = "0" + month
      }
      let day = time.getDate()
      let date = `${year}-${month}-${day}`

      return res.render('edit', { record: record, date: date })
    })
    .catch((error) => { return res.status(422).json(error) })
})


// 修改 Record
router.put('/:id', authenticated, (req, res) => {
  const { name, date, category, merchant, amount } = req.body

  let errors = []

  if (!name || !date || !category || !amount) {
    errors.push({ message: '必填欄位未填' })
  }

  if (errors.length > 0) {
    const id = req.params.id
    return res.redirect(`/records/${id}/edit`)

  } else {
    Record.findOne({
      where: {
        Id: req.params.id,
        UserId: req.user.id,
      }
    })
      .then((record) => {
        record.name = req.body.name
        record.date = req.body.date
        record.category = req.body.category
        record.merchant = req.body.merchant
        record.amount = req.body.amount

        return record.save()
      })
      .then((record) => { return res.redirect('/') })
      .catch((error) => { return res.status(422).json(error) })
  }
})


// 刪除 Record
router.delete('/:id/delete', authenticated, (req, res) => {
  User.findByPk(req.user.id)
    .then((user) => {
      if (!user) throw new Error("user not found")

      return Record.destroy({
        where: {
          UserId: req.user.id,
          Id: req.params.id
        }
      })
    })
    .then((record) => { return res.redirect('/') })
    .catch((error) => { return res.status(422).json(error) })
})

module.exports = router