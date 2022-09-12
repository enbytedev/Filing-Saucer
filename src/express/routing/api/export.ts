import login from './userAccount/loginUser.js';
import register from './userAccount/registerUser.js';
import logout from './userAccount/logout.js';
import createUpload from './handleUpload/createUpload.js';
import deleteUpload from './handleUpload/deleteUpload.js';
import updateUpload from './handleUpload/updateUpload.js';
import updateUser from './userAccount/updateUser.js';
import requestReset from './forgotPassword/requestReset.js';
import resetPassword from './forgotPassword/resetPassword.js';

const apiRoutes = {
    login,
    register,
    logout,
    createUpload,
    deleteUpload,
    updateUpload,
    updateUser,
    requestReset,
    resetPassword,
}

export default apiRoutes;