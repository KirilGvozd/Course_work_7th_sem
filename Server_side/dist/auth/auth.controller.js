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
const passport_1 = require("@nestjs/passport");
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
            console.log('Auth check request received');
            const cookie = req.cookies['jwt'];
            console.log('JWT cookie:', cookie ? 'present' : 'missing');
            const data = await this.jwtService.verifyAsync(cookie, { secret: process.env.JWT_SECRET });
            console.log(data);
            console.log('JWT verified:', data);
            if (!data) {
                throw new common_1.UnauthorizedException();
            }
            const user = await this.authService.findOne({ id: data.id });
            console.log('User found:', user ? 'yes' : 'no');
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            return user;
        }
        catch (err) {
            console.error('Auth check error:', err);
            throw new common_1.UnauthorizedException();
        }
    }
    async register(createUserDto, response) {
        const user = await this.userService.findByEmail(createUserDto.email);
        if (user) {
            throw new common_1.BadRequestException("User with this email already exists!");
        }
        await this.userService.create(createUserDto);
    }
    async login(authDto, response) {
        const user = await this.userService.findByEmail(authDto.email);
        if (!user || !await bcrypt.compare(authDto.password, user.password)) {
            throw new common_1.BadRequestException('Invalid credentials!');
        }
        const tokens = await this.authService.generateTokens(user);
        await this.authService.updateRefreshToken(user.id, tokens.refreshToken);
        response.cookie("jwt", tokens.accessToken, { httpOnly: true });
        response.cookie("refreshToken", tokens.refreshToken, { httpOnly: true, path: '/auth/refresh' });
        return {
            message: "Login successful",
            accessToken: tokens.accessToken,
        };
    }
    async refresh(req, res) {
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) {
            throw new common_1.UnauthorizedException("No refresh token found.");
        }
        try {
            const data = await this.jwtService.verifyAsync(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
            const isValid = await this.authService.validateRefreshToken(data.id, refreshToken);
            if (!isValid) {
                throw new common_1.UnauthorizedException("Invalid refresh token.");
            }
            const newAccessToken = await this.jwtService.signAsync({ id: data.id, role: data.role }, { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_TOKEN_EXPIRE });
            res.cookie("jwt", newAccessToken, { httpOnly: true, sameSite: "none", secure: false });
            return { message: "Token refreshed successfully" };
        }
        catch (err) {
            throw new common_1.UnauthorizedException("Invalid refresh token.");
        }
    }
    async logout(response, request) {
        if (!request.cookies.jwt) {
            throw new common_1.UnauthorizedException("You're not logged in!");
        }
        response.clearCookie("jwt");
        return { message: "Success" };
    }
    async googleAuth() {
    }
    async googleAuthRedirect(req, res) {
        const user = req.user;
        const tokens = await this.authService.generateTokens(user);
        await this.authService.updateRefreshToken(user.id, tokens.refreshToken);
        res.cookie("jwt", tokens.accessToken, { httpOnly: true, sameSite: "none", secure: false });
        res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true, path: '/auth/refresh', sameSite: "none", secure: false });
        res.redirect('http://localhost:3000');
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
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createUserDto_1.CreateUserDto, Object]),
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
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Token refreshed successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid refresh token.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
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
__decorate([
    (0, common_1.Get)('google'),
    (0, swagger_1.ApiExcludeEndpoint)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, swagger_1.ApiExcludeEndpoint)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthRedirect", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwt_1.JwtService,
        user_service_1.UserService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map