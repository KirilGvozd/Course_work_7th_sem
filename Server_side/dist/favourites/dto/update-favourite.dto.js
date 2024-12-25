"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFavouriteDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_favourite_dto_1 = require("./create-favourite.dto");
class UpdateFavouriteDto extends (0, swagger_1.PartialType)(create_favourite_dto_1.CreateFavouriteDto) {
}
exports.UpdateFavouriteDto = UpdateFavouriteDto;
//# sourceMappingURL=update-favourite.dto.js.map