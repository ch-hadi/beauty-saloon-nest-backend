import { MigrationInterface, QueryRunner } from "typeorm";

export class NewDbMigrations1704701176407 implements MigrationInterface {
    name = 'NewDbMigrations1704701176407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."social_logins_authenticationprovider_enum" AS ENUM('Google', 'Facebook', 'LinkedIn')`);
        await queryRunner.query(`CREATE TABLE "social_logins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "AuthenticationProvider" "public"."social_logins_authenticationprovider_enum" NOT NULL, "ProviderKey" character varying(100) DEFAULT '', "userId" uuid, CONSTRAINT "PK_0fcd3275db51c40e659725e1257" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "predefinedQuestionAnalysis" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "questionAnswer" character varying(250) DEFAULT '', "predefinedQuestionId" uuid, "agreementId" uuid, CONSTRAINT "PK_91bbf1d78e9da04a3e000f8edf3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."predefinedQuestion_questioncategory_enum" AS ENUM('Mortgage', 'Property', 'Employment', 'Other')`);
        await queryRunner.query(`CREATE TABLE "predefinedQuestion" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "QuestionCategory" "public"."predefinedQuestion_questioncategory_enum" NOT NULL, "QuestionText" character varying(200) NOT NULL, "authorId" uuid, CONSTRAINT "PK_c56862a8439b9de9a82782b7060" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."userSubscription_isactive_enum" AS ENUM('Active', 'InActive')`);
        await queryRunner.query(`CREATE TABLE "userSubscription" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "plan" character varying(100) NOT NULL, "startDate" date NOT NULL, "expiryDate" date NOT NULL, "isActive" "public"."userSubscription_isactive_enum" NOT NULL DEFAULT 'Active', "usedContracts" integer NOT NULL DEFAULT '0', "totalContracts" integer NOT NULL DEFAULT '0', "totalUserDefinedQuestion" integer NOT NULL DEFAULT '0', "consumeUserDefinedQuestion" integer NOT NULL DEFAULT '0', "authorId" uuid, CONSTRAINT "PK_033ad1d681ccc83f532dcda192a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."batchAgreements_agreementtype_enum" AS ENUM('Mortgage', 'Property', 'Employment', 'Other')`);
        await queryRunner.query(`CREATE TABLE "batchAgreements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "agreementName" character varying(250) DEFAULT '', "agreementType" "public"."batchAgreements_agreementtype_enum" NOT NULL, "agreementAwsUrl" character varying(150) NOT NULL, "vectorPath" character varying(100), "userDefinedQuestion" jsonb DEFAULT '[]', "preDefinedQuestionAnalysis" jsonb DEFAULT '[]', "batchId" uuid, CONSTRAINT "PK_5d1fbc72f3c78ca09b024ae3929" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "batches" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "batchName" character varying(100) NOT NULL DEFAULT '', "estimatedTime" character varying(100) NOT NULL DEFAULT '', "isCompleted" boolean NOT NULL DEFAULT false, "isFailed" boolean NOT NULL DEFAULT false, "authorId" uuid, CONSTRAINT "PK_55e7ff646e969b61d37eea5be7a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "firstName" character varying(100) DEFAULT '', "lastName" character varying(100) DEFAULT '', "phone_number" character varying DEFAULT '', "avatar" character varying(150) DEFAULT '', "birth_date" character varying DEFAULT '', "country" character varying(100) DEFAULT '', "state" character varying(100) DEFAULT '', "city" character varying(100) DEFAULT '', "userId" uuid, CONSTRAINT "REL_51cb79b5555effaf7d69ba1cff" UNIQUE ("userId"), CONSTRAINT "PK_f44d0cd18cfd80b0fed7806c3b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_userrole_enum" AS ENUM('Admin', 'User')`);
        await queryRunner.query(`CREATE TYPE "public"."users_subscriptiontype_enum" AS ENUM('Free', 'Paid', 'Expired', 'Payment Failed')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying(50) NOT NULL, "stripe_key" character varying DEFAULT '', "active" boolean NOT NULL DEFAULT true, "otp_code" character varying(25) DEFAULT '', "password" character varying, "need_change_password" boolean NOT NULL DEFAULT false, "userRole" "public"."users_userrole_enum" NOT NULL, "lastLoginAt" TIMESTAMP, "loginCount" bigint NOT NULL DEFAULT '0', "stripeCustomerId" character varying(150), "subscriptionType" "public"."users_subscriptiontype_enum" NOT NULL DEFAULT 'Free', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "userDefinedQuestions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "questionText" character varying(200) DEFAULT '', "questionAnswer" character varying(3750) DEFAULT '', "agreementId" uuid, "batchAgreementsId" uuid, CONSTRAINT "PK_b68d63da91bc85c70b246eca8f1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "graphs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "graphPointsSummary" character varying DEFAULT '', "graphPoints" jsonb DEFAULT '[]', "agreementId" uuid, CONSTRAINT "PK_4f32e4f134362de610c87cb99e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."agreements_agreementtype_enum" AS ENUM('Mortgage', 'Property', 'Employment', 'Other')`);
        await queryRunner.query(`CREATE TABLE "agreements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "agreementName" character varying DEFAULT '', "agreementType" "public"."agreements_agreementtype_enum" NOT NULL, "ipAddress" character varying(100) DEFAULT '', "summary" character varying DEFAULT '', "disclaimer" character varying DEFAULT '', "otherPoints" character varying DEFAULT '', "agreementFileKey" character varying NOT NULL, "agreementReportFileKey" character varying NOT NULL, "vecDbPath" character varying, "agreementNo" bigint, "authorId" uuid, CONSTRAINT "PK_01532f6c999d44c776e3d1fa4c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "countries" ("id" SERIAL NOT NULL, "name" character varying, "iso3" character varying, "phone_code" character varying, CONSTRAINT "PK_b2d7006793e8697ab3ae2deff18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "states" ("id" SERIAL NOT NULL, "name" character varying, "country_id" integer, CONSTRAINT "PK_09ab30ca0975c02656483265f4f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cities" ("id" SERIAL NOT NULL, "name" character varying, "state_id" integer, CONSTRAINT "PK_4762ffb6e5d198cfec5606bc11e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "social_logins" ADD CONSTRAINT "FK_c090f1ce939825e8648562d49e7" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "predefinedQuestionAnalysis" ADD CONSTRAINT "FK_94dbc2b14591e6c604b6323e67b" FOREIGN KEY ("predefinedQuestionId") REFERENCES "predefinedQuestion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "predefinedQuestionAnalysis" ADD CONSTRAINT "FK_f149c467cd886fb003850c7b511" FOREIGN KEY ("agreementId") REFERENCES "agreements"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "predefinedQuestion" ADD CONSTRAINT "FK_aa5b33f464c8dc229a1f6043bf4" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "userSubscription" ADD CONSTRAINT "FK_db99963ddba095a75ed163b9850" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "batchAgreements" ADD CONSTRAINT "FK_8fee7ba5631e5626b3d6959440b" FOREIGN KEY ("batchId") REFERENCES "batches"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "batches" ADD CONSTRAINT "FK_9f1e6a72fd4f85b3cb19e292811" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD CONSTRAINT "FK_51cb79b5555effaf7d69ba1cff9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "userDefinedQuestions" ADD CONSTRAINT "FK_7478575430cd65d0278ac3a564a" FOREIGN KEY ("agreementId") REFERENCES "agreements"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "userDefinedQuestions" ADD CONSTRAINT "FK_2c6612e851e1e2664766fbcd015" FOREIGN KEY ("batchAgreementsId") REFERENCES "batchAgreements"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "graphs" ADD CONSTRAINT "FK_e75cc3185a2218e9637eee15469" FOREIGN KEY ("agreementId") REFERENCES "agreements"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "agreements" ADD CONSTRAINT "FK_abea89de3fcfa633a634f856d84" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "states" ADD CONSTRAINT "FK_f3bbd0bc19bb6d8a887add08461" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cities" ADD CONSTRAINT "FK_1229b56aa12cae674b824fccd13" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cities" DROP CONSTRAINT "FK_1229b56aa12cae674b824fccd13"`);
        await queryRunner.query(`ALTER TABLE "states" DROP CONSTRAINT "FK_f3bbd0bc19bb6d8a887add08461"`);
        await queryRunner.query(`ALTER TABLE "agreements" DROP CONSTRAINT "FK_abea89de3fcfa633a634f856d84"`);
        await queryRunner.query(`ALTER TABLE "graphs" DROP CONSTRAINT "FK_e75cc3185a2218e9637eee15469"`);
        await queryRunner.query(`ALTER TABLE "userDefinedQuestions" DROP CONSTRAINT "FK_2c6612e851e1e2664766fbcd015"`);
        await queryRunner.query(`ALTER TABLE "userDefinedQuestions" DROP CONSTRAINT "FK_7478575430cd65d0278ac3a564a"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP CONSTRAINT "FK_51cb79b5555effaf7d69ba1cff9"`);
        await queryRunner.query(`ALTER TABLE "batches" DROP CONSTRAINT "FK_9f1e6a72fd4f85b3cb19e292811"`);
        await queryRunner.query(`ALTER TABLE "batchAgreements" DROP CONSTRAINT "FK_8fee7ba5631e5626b3d6959440b"`);
        await queryRunner.query(`ALTER TABLE "userSubscription" DROP CONSTRAINT "FK_db99963ddba095a75ed163b9850"`);
        await queryRunner.query(`ALTER TABLE "predefinedQuestion" DROP CONSTRAINT "FK_aa5b33f464c8dc229a1f6043bf4"`);
        await queryRunner.query(`ALTER TABLE "predefinedQuestionAnalysis" DROP CONSTRAINT "FK_f149c467cd886fb003850c7b511"`);
        await queryRunner.query(`ALTER TABLE "predefinedQuestionAnalysis" DROP CONSTRAINT "FK_94dbc2b14591e6c604b6323e67b"`);
        await queryRunner.query(`ALTER TABLE "social_logins" DROP CONSTRAINT "FK_c090f1ce939825e8648562d49e7"`);
        await queryRunner.query(`DROP TABLE "cities"`);
        await queryRunner.query(`DROP TABLE "states"`);
        await queryRunner.query(`DROP TABLE "countries"`);
        await queryRunner.query(`DROP TABLE "agreements"`);
        await queryRunner.query(`DROP TYPE "public"."agreements_agreementtype_enum"`);
        await queryRunner.query(`DROP TABLE "graphs"`);
        await queryRunner.query(`DROP TABLE "userDefinedQuestions"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_subscriptiontype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_userrole_enum"`);
        await queryRunner.query(`DROP TABLE "user_profile"`);
        await queryRunner.query(`DROP TABLE "batches"`);
        await queryRunner.query(`DROP TABLE "batchAgreements"`);
        await queryRunner.query(`DROP TYPE "public"."batchAgreements_agreementtype_enum"`);
        await queryRunner.query(`DROP TABLE "userSubscription"`);
        await queryRunner.query(`DROP TYPE "public"."userSubscription_isactive_enum"`);
        await queryRunner.query(`DROP TABLE "predefinedQuestion"`);
        await queryRunner.query(`DROP TYPE "public"."predefinedQuestion_questioncategory_enum"`);
        await queryRunner.query(`DROP TABLE "predefinedQuestionAnalysis"`);
        await queryRunner.query(`DROP TABLE "social_logins"`);
        await queryRunner.query(`DROP TYPE "public"."social_logins_authenticationprovider_enum"`);
    }

}
