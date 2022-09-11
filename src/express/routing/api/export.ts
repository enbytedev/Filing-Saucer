import login from './userAccount/loginUser.js';
import register from './userAccount/registerUser.js';
import logout from './logout.js';
import upload from './upload.js';
import deleteUpload from './deleteUpload.js';
import updateFile from './updateFile.js';
import updateUser from './userAccount/updateUser.js';
import requestReset from './requestReset.js';
import resetPassword from './resetPassword.js';

const apiRoutes = {
    login,
    register,
    logout,
    upload,
    deleteUpload,
    updateFile,
    updateUser,
    requestReset,
    resetPassword,
}

export default apiRoutes;