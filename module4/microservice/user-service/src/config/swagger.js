export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "User Service API",
    version: "1.0.0",
    description:
      "Tài liệu API cho user-service (tích hợp gọi API sang building-service để lấy thông tin căn hộ)",
  },
  servers: [
    {
      url: "http://localhost:3001",
      description: "User Service Local Server",
    },
  ],
  paths: {
    "/user/detail/{idUser}": {
      get: {
        tags: ["User"],
        summary: "Lấy thông tin cá nhân của user kèm thông tin căn hộ",
        description:
          "Trả về thông tin cá nhân từ user-service (id, name, age, id_apartment) và gọi sang building-service để lấy chi tiết căn hộ (room, floor, block, building).",
        parameters: [
          {
            name: "idUser",
            in: "path",
            required: true,
            description: "ID của user cần xem thông tin (ví dụ: 1, 2, 3)",
            schema: {
              type: "integer",
              example: 1,
            },
          },
        ],
        responses: {
          200: {
            description: "Lấy thông tin user và căn hộ thành công",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "integer", example: 1 },
                    name: { type: "string", example: "Nguyễn Văn A" },
                    age: { type: "integer", example: 28 },
                    id_apartment: { type: "integer", example: 101 },
                    apartment: {
                      type: "object",
                      nullable: true,
                      properties: {
                        id: { type: "integer", example: 101 },
                        room: {
                          type: "object",
                          properties: {
                            id: { type: "integer", example: 101 },
                            name: { type: "string", example: "A-10.01" },
                            area: { type: "string", example: "75m2" },
                            bedrooms: { type: "integer", example: 2 },
                          },
                        },
                        floor: {
                          type: "object",
                          properties: {
                            id: { type: "integer", example: 1 },
                            name: { type: "string", example: "Tầng 10" },
                            floor_number: { type: "integer", example: 10 },
                          },
                        },
                        block: {
                          type: "object",
                          properties: {
                            id: { type: "integer", example: 1 },
                            name: { type: "string", example: "Block A" },
                          },
                        },
                        building: {
                          type: "object",
                          properties: {
                            id: { type: "integer", example: 1 },
                            name: { type: "string", example: "Landmark 81" },
                            address: {
                              type: "string",
                              example: "720A Điện Biên Phủ, Bình Thạnh, TP.HCM",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Không tìm thấy user",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Không tìm thấy user với id = 99",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Lỗi server",
          },
        },
      },
    },
  },
};
