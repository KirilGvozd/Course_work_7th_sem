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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const createUserDto_1 = require("../user/dto/createUserDto");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
const auth_dto_1 = require("./dto/auth.dto");
const swagger_1 = require("@nestjs/swagger");
let AuthController = class AuthController {
    constructor(authService, jwtService, userService) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.userService = userService;
    }
    async user(req) {
        try {
            const cookie = req.cookies['jwt'];
            const data = await this.jwtService.verifyAsync(cookie, { secret: process.env.JWT_SECRET });
            return await this.authService.findOne({ id: data.id });
        }
        catch (error) {
            throw new common_1.UnauthorizedException("User not found");
        }
    }
    async register(createUserDto) {
        const user = await this.userService.findByEmail(createUserDto.email);
        if (user) {
            throw new common_1.BadRequestException("User with this email already exists!");
        }
        createUserDto.password = await bcrypt.hash(createUserDto.password, 12);
        await this.userService.create(createUserDto);
    }
    async login(authDto, response) {
        const user = await this.userService.findByEmail(authDto.email);
        if (!user || !await bcrypt.compare(authDto.password, user.password)) {
            throw new common_1.BadRequestException('Invalid credentials!');
        }
        const token = await this.authService.generateToken(user);
        response.cookie("jwt", token, { httpOnly: true });
        return {
            message: "Login successful",
            accessToken: token,
        };
    }
    async logout(response, request) {
        if (!request.cookies.jwt) {
            throw new common_1.UnauthorizedException("You're not logged in!");
        }
        response.clearCookie("jwt");
        return { message: "Cookie has been cleared" };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('user'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User data retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Not authenticated.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "user", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User has been successfully registered.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid registration data or user already exists.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createUserDto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully logged in.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.AuthDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully logged out.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'You are not logged in.' }),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwt_1.JwtService,
        user_service_1.UserService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map