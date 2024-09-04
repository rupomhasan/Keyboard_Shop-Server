import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authService } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {


  const { refreshToken, accessToken } = await authService.loginUser(req.body);

  res.cookie("refreshToken", refreshToken, {
    secure: true,
    httpOnly: true
  })

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is logged in successfully",
    data: accessToken
  })

})



const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies

  const result = await authService.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token is retrieved successfully",
    data: result
  })
})

export const authControllers = {
  loginUser,

  refreshToken
}