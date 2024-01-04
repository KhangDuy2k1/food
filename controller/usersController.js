import pool from '../database/index.js'
//đã sửa
export const signup = async (req, res) => {
  const { username, password, email, fullname, gender, dateofbirth, phone } = req.body
  try {
    const checkExisted = await pool.query(
      `SELECT * FROM users WHERE email = '${email}'`,
    )
    if (checkExisted.rows.length > 0)
      res.status(400).json({ message: 'Email existed!' })
    else {
      await pool.query(
        `INSERT INTO users (username, password, email, fullname, gender, dob, phone)
        VALUES ('${username}', '${password}', '${email}', '${fullname}', '${gender}', '${dateofbirth}', '${phone}')`,
      )
      res.status(200).json({ message: 'Signup successfully' })
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}
//đã sửa
export const signin = async (req, res) => {
  const { email, password } = req.body
  try {
    const checkExisted = await pool.query(
      `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`,
    )
    if (checkExisted.rows.length > 0)
      res.status(200).json({ data: checkExisted.rows[0] })
    else {
      res.status(400).json({ message: 'Wrong email or password!' })
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}
//đã sửa
export const getAllUsers = async (req, res) => {
  const { page, pageSize } = req.query
  const offset = (page - 1) * pageSize

  let queryString = `SELECT * FROM users`
  if (page && pageSize)
    queryString = queryString.concat(` OFFSET ${offset} LIMIT ${pageSize}`)

  const totalQuery = `SELECT COUNT(*) FROM users`

  try {
    const result = await pool.query(queryString)
    const total = await pool.query(totalQuery)

    res
      .status(200)
      .json({ data: result.rows, total: parseInt(total.rows[0].count) })
  } catch (error) {
    res.status(500).json({ error })
  }
}
//đã sửa
export const updateUser = async (req, res) => {
  const { userid } = req.params
  const { fullname, gender, dateofbirth, phone, address } = req.body

  try {
    const result = await pool.query(
      `UPDATE users
      SET
        fullname = '${fullname}',
        dob = TO_DATE('${dateofbirth}', 'YYYY-MM-DD'),
        gender = '${gender}',
        phone = '${phone}',
        address = '${address}'
      WHERE user_id = ${userid}
      RETURNING *`,
    )

    res.status(200).json({ data: result.rows[0] })
  } catch (error) {
    res.status(500).json({ error })
  }
}
//đã sửa
export const updateAddress = async (req, res) => {
  const { userid } = req.params
  const { address } = req.body

  try {
    const result = await pool.query(
      `UPDATE users
      SET
        address = '${address}'
      WHERE user_id = '${userid}'
      RETURNING *`,
    )

    res.status(200).json({ data: result.rows[0] })
  } catch (error) {
    res.status(500).json({ error })
  }
}
export const deleteUser = async(req, res) => { 
      try {
        console.log(req.query.id)
        const result = await pool.query(`delete from users where user_id = ${req.query.id}`)
        res.status(200).json({
          message: "Xoa thanh cong"
        })
      } catch (error) {
        res.status(500).json({
          message: "loi server"
        })
      }
}
  export const getDetailUser = async(req, res) => { 
        try {
         const [userDetail, totalOrder ] =  await Promise.all(
          [
            pool.query(`SELECT * FROM users WHERE user_id = ${req.query.id}`),

            pool.query(`SELECT count(*) AS totalOrder FROM orders WHERE user_id = ${req.query.id}`)
          ])
          console.log(userDetail, totalOrder)
          res.status(200).json({
              data: userDetail.rows,
              total: totalOrder.rows
          })
        } catch (error) {
          console.log(error)
          res.status(500).json({
            message: "lỗi"
          })
        }
    }
export const resetPassword = async(req, res) => {

      try {
        const result = await pool.query(`update users set password = 123456 where user_id = ${req.query.id}`)
        res.status(200).json({
          message: "reset thanh cong",
          data: result
        })
      } catch (error) {
        res.status(500).json({
          message: "loi server"
        })
      }
} 
