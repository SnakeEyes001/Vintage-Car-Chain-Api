import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import { BlockchainController } from './app/blockchain/blockchain.controller';
import { AdminOprController } from './app/admin-opr/admin-opr.controller';
import { UsersController } from './app/users/users.controller';
import { AdminOprService } from './app/admin-opr/admin-opr.service';
import { BlockchainService } from './app/blockchain/blockchain.service';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 8080;

  // Configurer la session
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your-secret-key', // Utilisez une clé secrète depuis les variables d'environnement
      resave: false,
      saveUninitialized: false,
      //cookie: { secure: process.env.NODE_ENV === 'production' }, // Activer le cookie sécurisé en production
    }),
  );

  // Configurer Swagger pour documenter uniquement les contrôleurs nécessaires
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Vintage Car Ownership Transfer API')
    .setDescription(
      'This API facilitates seamless communication with the Hyperledger Test Network for securely managing the ownership transfer of vintage cars. It ensures transparency, immutability, and efficiency in tracking ownership history while leveraging blockchain technology for a tamper-proof record of transactions.',
    )
    .setVersion('1.0')
    .addTag('Fabric test-network') // Ajouter des tags si nécessaire
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    //include: [AdminOprController, BlockchainController, UsersController], // Inclure uniquement les contrôleurs spécifiés
  });
  SwaggerModule.setup('api', app, document); // Swagger sera accessible sur /api
  // Démarrer l'application
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);

  //Create Admin eu User for each organization
  // Récupérer une instance du service BlockchainService
  const adminOprService = app.get(AdminOprService);
  const blockchainService = app.get(BlockchainService);

  // Exemple d'appel à une méthode du service
  /*  try {
    const adminOrg1 = await adminOprService.createAdminForOrg('Org1'); // Remplacez `someMethod` par le nom de votre méthode
    console.log(`Admin for Org1 succefully created..${adminOrg1}`);

    const adminOrg2 = await adminOprService.createAdminForOrg('Org2');
    console.log(`Admin for Org2 succefully created..${adminOrg2}`);

    const userAppOrg1 = await adminOprService.createUserForOrg('Org1');
    console.log(`User for Org2 succefully created..${userAppOrg1}`);

    const userAppOrg2 = await adminOprService.createUserForOrg('Org2');
    console.log(`User for Org2 succefully created..${userAppOrg2}`);
    // InitLedger
    const initLedger = await blockchainService.initLedger('Org2');
    console.log(`InitLedger..${initLedger}`);
  } catch (error) {
    console.error("Erreur lors de l'appel à someMethod:", error);
  } */
}

bootstrap();
