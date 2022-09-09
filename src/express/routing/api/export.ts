import login from './login.js';
import register from './register.js';
import logout from './logout.js';
import upload from './upload.js';
import deleteUpload from './deleteUpload.js';
import updateFile from './updateFile.js';
import updateAccount from './updateAccount.js';
import requestReset from './requestReset.js';
import resetPassword from './resetPassword.js';

const apiRoutes = {
    login,
    register,
    logout,
    upload,
    deleteUpload,
    updateFile,
    updateAccount,
    requestReset,
    resetPassword,
}

export default apiRoutes;