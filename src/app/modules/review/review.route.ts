import express from "express";
import { auth } from "../../middlewares/auth";
import { USER_ROLE } from "../user/utils/user.constant";
import { reviewControllers } from "./review.controller";
import ValidateRequest from "../../middlewares/validateRequest";
import { reviewValidation } from "./review.validation";
const router = express.Router();

router.post("/", ValidateRequest(reviewValidation), reviewControllers.giveReview)

router.get("/", reviewControllers.getAllReview)

router.get("/my_reviews", auth(USER_ROLE.Admin, USER_ROLE.Customer), reviewControllers.getMyReviews)


router.get("/product_reviews/:id", reviewControllers.getReviewsForProduct)


router.patch("/update_review/:id", auth(USER_ROLE.Admin, USER_ROLE.Customer), reviewControllers.updateMyReview)

router.delete("/delete_review/:id", auth(USER_ROLE.Admin, USER_ROLE.Customer), reviewControllers.deleteReview)

export const ReviewRoutes = router
