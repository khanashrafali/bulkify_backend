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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliderController = void 0;
const tsoa_1 = require("tsoa");
let SliderController = class SliderController extends tsoa_1.Controller {
    /**
     * @summary Add slider slide
     */
    addSlider(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary Add slider slide
     */
    updateSlider(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary fetch slider
     */
    getSlider() {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary Delete Slider
     */
    deleteSlider(slideId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    /**
     * @summary Delete Slider slide
     */
    deleteSlide(sliderId, slideId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
};
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Post)(""),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SliderController.prototype, "addSlider", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Put)("{sliderId}"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SliderController.prototype, "updateSlider", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Get)(""),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SliderController.prototype, "getSlider", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Delete)("{slideId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SliderController.prototype, "deleteSlider", null);
__decorate([
    (0, tsoa_1.Security)("Bearer"),
    (0, tsoa_1.Delete)("{sliderId}/{slideId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SliderController.prototype, "deleteSlide", null);
SliderController = __decorate([
    (0, tsoa_1.Tags)("Slider"),
    (0, tsoa_1.Route)("slider")
], SliderController);
exports.SliderController = SliderController;
