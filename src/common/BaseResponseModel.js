function withSuccess(message, data) {
    return {
        code: 200,
        message: message ?? 'Thành công',
        data: data ?? null,
    };
}

function notFound(message) {
    return {
        code: 400,
        message,
    };
}

module.exports = {
    notFound,
    withSuccess
};