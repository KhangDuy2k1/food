import pool from '../database/index.js'

export const order = async (req, res) => {
  const { userid, products, total_price, store_name, address_order, phone_order } = req.body

  try {
    const order = await pool.query(
      `INSERT INTO orders (user_id, status, total_price, store_name, address_order, phone_order) VALUES ('${userid}', '0', '${total_price}', '${store_name}', '${address_order}', '${phone_order}') RETURNING order_id`,
    )
    const orderid = order.rows[0].order_id

    for(const product of products){
      await pool.query(
        `INSERT INTO order_details (order_id, product_id, quantity, price) VALUES ('${orderid}', '${product.product_id}', '${product.quantity}', '${product.price}')`,
      )
      // const cartid = await pool.query(`SELECT cart_id FROM cart WHERE user_id = ${userid} AND product_id = ${product.product_id}`,)

       await pool.query(`DELETE FROM cart WHERE user_id = ${userid} AND product_id = ${product.product_id}`,)
    }

    res.status(200).json({ message: 'Order successfully' })
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const getAllOrders = async (req, res) => {
  const { page, pageSize } = req.query;
  const newOffset = (page - 1)*pageSize;
  let queryString;
  if(page && pageSize) {
    queryString = `SELECT * FROM orders inner join users on orders.user_id = users.user_id OFFSET ${newOffset} LIMIT ${pageSize}`
   }else { 
    queryString = `SELECT * FROM orders INNER JOIN users ON orders.user_id = users.user_id `
  }
  const totalQuery = `SELECT COUNT(*) FROM orders INNER JOIN users ON orders.user_id = users.user_id`

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

export const getOrdersByUserId = async (req, res) => {
  const { userid } = req.params

  try {
    const result = await pool.query(
      `SELECT * FROM orders WHERE user_id = '${userid}'`,
    )

    res.status(200).json({ data: result.rows })
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const getOrderDetail = async (req, res) => {
  const { orderid } = req.params

  try {
    const result = await pool.query(
      `SELECT od.*, p.*
      FROM order_details od
      INNER JOIN product p ON od.product_id = p.product_id
      WHERE od.order_id = '${orderid}'`,
    )

    res.status(200).json({ data: result.rows })
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const changeStatus = async (req, res) => {
  const { orderid } = req.params
  const { status } = req.body

  try {
    await pool.query(
      `UPDATE orders
      SET status = '${status}'
      WHERE order_id = '${orderid}'`,
    )

    res.status(200).json({ message: 'Change successfully' })
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const getDetailByUserId = async (req, res) => {
  const { userid, status } = req.body

  try {
    const result = await pool.query(
      `SELECT *, a.price AS orderprice FROM (SELECT * FROM orderdetail) AS a LEFT JOIN plants ON a.plantid = plants.plantid`,
    )

    res.status(200).json({ data: result.rows })
  } catch (error) {
    res.status(500).json({ error })
  }
}
export const deleteOrder = async(req, res) => { 
    const {id} = req.query
    try {
      const result = await pool.query(`delete from orders where order_id = ${id}`)
      res.status(200).json({
        message: "xóa thành công",
        info: result
      })
    } catch (error) {
      res.status(500).json({ 
        error: error,
        message: "lỗi xảy ra"
      })
    }
}
export const getOrderSort = async(req, res) => { 
        try {
              const result = await pool.query(`SELECT * FROM orders ORDER BY order_date DESC`)
              res.status(200).json({
                  data: result.rows
              })
          
        } catch (error) {
              res.status(500).json({
                  messaga: "lỗi"
              })
        }
}
export const findOrder = async(req, res) => { 
        let {text} = req.query  
        try {
          
          let result = await pool.query(`select * from orders
          inner join users on users.user_id = orders.user_id
          where phone like '%${text}%'
          limit 8
          `)
          res.status(200).json(result.rows)
        } catch (error) {
          res.status(500).json({
            message: "lỗi"
          })
        }
}
export const updateOrder = async(req, res) => { 
        const {id} = req.query
        const {phone_order, address_order, status} = req.body
        console.log(phone_order, address_order, status)
        try {
          const result2 = await pool.query(
            `
              UPDATE orders 
              SET phone_order = '${phone_order}', address_order = '${address_order}', status = '${status}'
              WHERE order_id = ${id};
            `
          )          
          res.status(200).json({
            message: "Cập nhật thành công"
          })
        } catch (error) {
          console.error(error)
           res.status(500).json({
            message: "lỗi"
           })         
        }
}

export const countOrderByStatus = async(req, res) => { 
      try {
        const result = await pool.query(`
        SELECT status, COUNT(status) 
        FROM orders
        GROUP BY status;
        `)
        res.status(200).json(result.rows)
      } catch (error) {
        res.status(500).json({
          message: 'lỗi'
        })
      }
}

export const test = async (req, res) => {
  try {
    const result = await pool.query(`
    select * from orders
  `);
   res.json(result.rows)
  } catch (error) {
    console.error(error);
  }
};