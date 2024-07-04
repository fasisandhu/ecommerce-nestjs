import { Module,MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
// import { JwtMiddleware } from './auth/jwt.middleware'; 





const username = encodeURIComponent("fasseeh111");
const password = encodeURIComponent("1JeDAVbJzCvAKG2x");

@Module({
  imports: [MongooseModule.forRoot(`mongodb+srv://${username}:${password}@cluster0.p1gygz9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`), ProductModule, UserModule, AuthModule, CartModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(JwtMiddleware).forRoutes('*');
  // }
}
