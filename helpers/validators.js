function stringNotEmptyValidator(errMsg) {
    return function validator(value) {
        if (value == undefined || value == null || value.trim().length == 0) {
            return errMsg;
        }
        return true;
    }
}

module.exports = {
    stringNotEmptyValidator
}