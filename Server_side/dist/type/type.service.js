"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const type_entity_1 = require("../entities/type.entity");
const typeorm_2 = require("@nestjs/typeorm");
const constants_1 = require("../utils/constants");
let TypeService = class TypeService {
    constructor(typeRepository) {
        this.typeRepository = typeRepository;
    }
    async findAll(paginationDto) {
        return await this.typeRepository.find({
            skip: paginationDto.skip,
            take: paginationDto.limit ?? constants_1.DEFAULT_PAGE_SIZE,
        });
    }
    async findOne(id) {
        const result = await this.typeRepository.findOne({
            where: {
                id
            }
        });
        if (!result)
            throw new common_1.NotFoundException("Not Found");
        return result;
    }
    async create(body) {
        await this.typeRepository.save(body);
    }
    async update(id, body) {
        await this.typeRepository.update(id, body);
    }
    async delete(id) {
        await this.typeRepository.delete(id);
    }
};
exports.TypeService = TypeService;
exports.TypeService = TypeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(type_entity_1.Type)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], TypeService);
//# sourceMappingURL=type.service.js.map