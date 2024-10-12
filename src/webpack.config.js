module.exports = {
    devServer: {
      setupMiddlewares: (middlewares, devServer) => {
        // Thêm các middleware tùy chỉnh ở đây nếu cần
        return middlewares;
      },
    },
  };
  