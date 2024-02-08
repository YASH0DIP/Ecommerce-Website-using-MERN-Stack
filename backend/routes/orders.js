const { Order } = require("../models/order");
const { auth, isAdmin } = require("../middleware/auth");
const moment = require("moment");

const router = require("express").Router();

// Get Orders
router.get("/", async (req, res) => {
  const query = req.query.new;
  try {
    const orders = query
      ? await Order.find().sort({ _id: -1 }).limit(4)
      : await Order.find().sort({ _id: -1 });
    res.status(200).send(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
});

router.get("/orderview",async (req, res) => {
  const query = req.query.new;
  try {
    const orders = query
      ? await Order.find().sort({ _id: -1 }).limit(4)
      : await Order.find().sort({ _id: -1 });
    //console.log(orders);
    res.status(200).send(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
});

// Update Order
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const updateOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).send(updateOrder);
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
});

// Get an order
router.get("/findOne/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    // if (req.user._id !== order.userId || !req.user.isAdmin) {
    //   return res.status(403).send("Access Denied. Not Authorized...");
    // }
    res.status(200).send(order);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Get Order Stats
router.get("/stats", isAdmin, async (req, res) => {
  const previousMonth = moment()
    .month(moment().month() - 1)
    .set("date", 1)
    .format("YYYY-MM-DD HH:mm:ss");

  try {
    const orders = await Order.aggregate([
      {
        $match: { createdAt: { $gte: new Date(previousMonth) } },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).send(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
});

// Get Income Stats
router.get("/income/stats", isAdmin, async (req, res) => {
  const previousMonth = moment()
    .month(moment().month() - 1)
    .set("date", 1)
    .format("YYYY-MM-DD HH:mm:ss");

  try {
    const income = await Order.aggregate([
      {
        $match: { createdAt: { $gte: new Date(previousMonth) } },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$total",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).send(income);
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
});

// Get One Week Sales
router.get("/week-sales", isAdmin, async (req, res) => {
  const last7Days = moment().day(moment().day() - 7).format("YYYY-MM-DD HH:mm:ss");

  try {
    const income = await Order.aggregate([
      {
        $match: { createdAt: { $gte: new Date(last7Days) } },
      },
      {
        $project: {
          day: { $dayOfWeek: "$createdAt" },
          sales: "$total",
        },
      },
      {
        $group: {
          _id: "$day",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).send(income);
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;
