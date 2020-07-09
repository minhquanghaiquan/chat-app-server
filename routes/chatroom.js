  
const router = require("express").Router();
const { catchErrors } = require('../handlers/errorHandler');
const chatroomController = require("../controllers/chatroomController");

const auth = require("../middlewares/auth");

router.get("/", auth, catchErrors(chatroomController.getAllChatrooms));
router.post("/", auth, catchErrors(chatroomController.createChatroom));

router.get("/:id", auth, catchErrors(chatroomController.getMessagesRoom));
router.post("/joinroom", auth, catchErrors(chatroomController.joinRoom));
router.post("/leavefromroom", auth, catchErrors(chatroomController.leaveFromRoom));

module.exports = router;