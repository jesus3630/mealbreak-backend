"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    app.enableCors({ origin: [frontendUrl, 'http://localhost:4200'], credentials: true });
    app.setGlobalPrefix('api');
    await app.listen(process.env.PORT ?? 3000);
    console.log(`Backend running on http://localhost:3000/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map